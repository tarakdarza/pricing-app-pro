const { getConnection } = require("../db");
const oracledb = require("oracledb");
const logger = require("../logger");

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
 * Vérifie les données reçues pour le calcul du prix
 */
function validatePriceRequest(data) {
  const { productId, quantity, promotion, tax } = data;

  if (!productId) {
    return "productId is required";
  }

  if (quantity !== undefined && (typeof quantity !== "number" || quantity <= 0)) {
    return "quantity must be a positive number";
  }

  if (promotion?.value !== undefined && typeof promotion.value !== "number") {
    return "promotion.value must be a number";
  }

  if (tax?.rate !== undefined && typeof tax.rate !== "number") {
    return "tax.rate must be a number";
  }

  return null;
}

/**
 * Récupère un produit par son ID depuis Oracle
 */
async function findProductById(connection, productId) {
  const result = await connection.execute(
    `SELECT PRODUCT_ID, NAME, BASE_PRICE, CURRENCY
     FROM PRODUCTS
     WHERE PRODUCT_ID = :productId`,
    { productId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  return result.rows[0];
}

/**
 * Calcule le prix final avec quantité, promotion et taxe
 */
function calculateFinalPrice(product, data) {
  const basePrice = product.BASE_PRICE;
  const quantity = data.quantity ?? 1;
  const promotionValue = data.promotion?.value ?? 0;
  const taxRate = data.tax?.rate ?? 0;

  const priceAfterPromo = basePrice - (basePrice * promotionValue) / 100;
  const priceWithTax = priceAfterPromo + (priceAfterPromo * taxRate) / 100;
  const finalPrice = priceWithTax * quantity;

  return {
    productId: product.PRODUCT_ID,
    name: product.NAME,
    basePrice,
    quantity,
    promotionValue,
    taxRate,
    priceAfterPromo,
    priceWithTax,
    finalPrice,
    currency: product.CURRENCY
  };
}

/**
 * POST /calculate-price
 * Calcule le prix final d’un produit
 */
async function calculatePrice(req, res) {
  let connection;

  logger.info({
    action: "CALCULATE_PRICE_REQUEST",
    productId: req.body.productId,
    quantity: req.body.quantity,
    promotion: req.body.promotion,
    tax: req.body.tax
  });

  const validationError = validatePriceRequest(req.body);

  if (validationError) {
    logger.warn({
      action: "CALCULATE_PRICE_VALIDATION_ERROR",
      message: validationError,
      body: req.body
    });

    return res.status(400).json({
      error: validationError
    });
  }

  try {
    const { productId } = req.body;

    connection = await getConnection();

    const product = await findProductById(connection, productId);

    if (!product) {
      logger.warn({
        action: "CALCULATE_PRICE_PRODUCT_NOT_FOUND",
        productId
      });

      return res.status(404).json({
        error: "Product not found"
      });
    }

    const priceResult = calculateFinalPrice(product, req.body);

    logger.info({
      action: "CALCULATE_PRICE_SUCCESS",
      productId,
      finalPrice: priceResult.finalPrice,
      currency: priceResult.currency
    });

    return res.json(priceResult);
  } catch (err) {
    logger.error({
      action: "CALCULATE_PRICE_ERROR",
      productId: req.body?.productId,
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
  calculatePrice
};