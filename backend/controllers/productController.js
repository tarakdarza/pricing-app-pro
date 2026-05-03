const { getConnection } = require("../db");
const oracledb = require("oracledb");
const logger = require("../logger");


const { sendEvent } = require("../kafka/producer");

/**
 * Ferme proprement la connexion Oracle
 */
async function closeConnection(connection) {
  if (!connection) return;

  try {
    await connection.close();
  } catch (err) {
    logger.error({
      action: "DATABASE_CONNECTION_CLOSE_ERROR",
      message: err.message,
      stack: err.stack
    });
  }
}

/**
 * Valide les données envoyées pour créer un produit
 */
function validateProductData(product) {
  const { productId, name, basePrice, currency } = product;

  if (!productId || !name || basePrice === undefined || !currency) {
    return "productId, name, basePrice and currency are required";
  }

  if (typeof basePrice !== "number" || Number.isNaN(basePrice)) {
    return "basePrice must be a valid number";
  }

  return null;
}

/**
 * GET /products
 * Récupérer tous les produits
 */
async function getAllProducts(req, res) {
  let connection;

  logger.info({
    action: "GET_PRODUCTS_REQUEST"
  });

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT PRODUCT_ID, NAME, BASE_PRICE, CURRENCY
       FROM PRODUCTS`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    logger.info({
      action: "GET_PRODUCTS_SUCCESS",
      count: result.rows.length
    });

    return res.json(result.rows);
  } catch (err) {
    logger.error({
      action: "GET_PRODUCTS_ERROR",
      message: err.message,
      code: err.errorNum,
      stack: err.stack
    });

    return res.status(500).json({
      error: "Internal server error"
    });
  } finally {
    await closeConnection(connection);
  }
}

/**
 * GET /products/:productId
 * Récupérer un seul produit par son ID
 */
async function getProductById(req, res) {
  let connection;
  const { productId } = req.params;

  logger.info({
    action: "GET_PRODUCT_BY_ID_REQUEST",
    productId
  });

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT PRODUCT_ID, NAME, BASE_PRICE, CURRENCY
       FROM PRODUCTS
       WHERE PRODUCT_ID = :productId`,
      { productId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      logger.warn({
        action: "GET_PRODUCT_BY_ID_NOT_FOUND",
        productId
      });

      return res.status(404).json({
        error: "Product not found"
      });
    }

    logger.info({
      action: "GET_PRODUCT_BY_ID_SUCCESS",
      productId
    });

    return res.json(result.rows[0]);
  } catch (err) {
    logger.error({
      action: "GET_PRODUCT_BY_ID_ERROR",
      productId,
      message: err.message,
      code: err.errorNum,
      stack: err.stack
    });

    return res.status(500).json({
      error: "Internal server error"
    });
  } finally {
    await closeConnection(connection);
  }
}

/**
 * POST /products
 * Créer un nouveau produit
 */
async function createProduct(req, res) {
  let connection;

  const { productId, name, basePrice, currency } = req.body;

  logger.info({
    action: "CREATE_PRODUCT_REQUEST",
    productId,
    name,
    basePrice,
    currency
  });

  const validationError = validateProductData(req.body);

  if (validationError) {
    logger.warn({
      action: "CREATE_PRODUCT_VALIDATION_ERROR",
      message: validationError,
      productId,
      name,
      basePrice,
      currency
    });

    return res.status(400).json({
      error: validationError
    });
  }

  try {
    connection = await getConnection();

    await connection.execute(
      `INSERT INTO PRODUCTS (PRODUCT_ID, NAME, BASE_PRICE, CURRENCY)
       VALUES (:productId, :name, :basePrice, :currency)`,
      { productId, name, basePrice, currency },
      { autoCommit: true }
    );

    logger.info({
      action: "CREATE_PRODUCT_SUCCESS",
      productId
    });
    await sendEvent("product-events", {
    event: "PRODUCT_CREATED",
    productId,
    name,
    basePrice,
    currency
});

    return res.status(201).json({
      message: "Product created successfully",
      productId,
      name,
      basePrice,
      currency
    });
  } catch (err) {
    if (err.errorNum === 1) {
      logger.warn({
        action: "CREATE_PRODUCT_ALREADY_EXISTS",
        message: "Product already exists",
        productId,
        code: err.errorNum
      });

      return res.status(409).json({
        error: "Product already exists"
      });
    }

    logger.error({
      action: "CREATE_PRODUCT_ERROR",
      productId,
      message: err.message,
      code: err.errorNum,
      stack: err.stack
    });

    return res.status(500).json({
      error: "Internal server error"
    });
  } finally {
    await closeConnection(connection);
  }
}
/**
 * PUT /products/:productId
 * Modifier un produit existant
 */
async function updateProduct(req, res) {
  let connection;
  const { productId } = req.params;
  const { name, basePrice, currency } = req.body;

  logger.info({
    action: "UPDATE_PRODUCT_REQUEST",
    productId,
    name,
    basePrice,
    currency
  });

  if (!name || basePrice === undefined || !currency) {
    return res.status(400).json({
      error: "name, basePrice and currency are required"
    });
  }

  if (typeof basePrice !== "number" || Number.isNaN(basePrice)) {
    return res.status(400).json({
      error: "basePrice must be a valid number"
    });
  }

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `UPDATE PRODUCTS
       SET NAME = :name,
           BASE_PRICE = :basePrice,
           CURRENCY = :currency
       WHERE PRODUCT_ID = :productId`,
      { productId, name, basePrice, currency },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      logger.warn({
        action: "UPDATE_PRODUCT_NOT_FOUND",
        productId
      });

      return res.status(404).json({
        error: "Product not found"
      });
    }

    logger.info({
      action: "UPDATE_PRODUCT_SUCCESS",
      productId
    });

    return res.json({
      message: "Product updated successfully",
      productId,
      name,
      basePrice,
      currency
    });
  } catch (err) {
    logger.error({
      action: "UPDATE_PRODUCT_ERROR",
      productId,
      message: err.message,
      code: err.errorNum,
      stack: err.stack
    });

    return res.status(500).json({
      error: "Internal server error"
    });
  } finally {
    await closeConnection(connection);
  }
}

/**
 * DELETE /products/:productId
 * Supprimer un produit existant
 */
async function deleteProduct(req, res) {
  let connection;
  const { productId } = req.params;

  logger.info({
    action: "DELETE_PRODUCT_REQUEST",
    productId
  });

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `DELETE FROM PRODUCTS
       WHERE PRODUCT_ID = :productId`,
      { productId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      logger.warn({
        action: "DELETE_PRODUCT_NOT_FOUND",
        productId
      });

      return res.status(404).json({
        error: "Product not found"
      });
    }

    logger.info({
      action: "DELETE_PRODUCT_SUCCESS",
      productId
    });

    return res.json({
      message: "Product deleted successfully",
      productId
    });
  } catch (err) {
    logger.error({
      action: "DELETE_PRODUCT_ERROR",
      productId,
      message: err.message,
      code: err.errorNum,
      stack: err.stack
    });

    return res.status(500).json({
      error: "Internal server error"
    });
  } finally {
    await closeConnection(connection);
  }
}
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};