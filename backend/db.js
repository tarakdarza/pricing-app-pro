// Import du driver Oracle
const oracledb = require("oracledb");
// Import du logger Winston (Datadog)
const logger = require("./logger");
/**
 * 🔌 Ouvre une connexion à la base Oracle
 * Utilise les variables d'environnement (.env)
 */
async function getConnection() {
  return oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
  });
}
/**
 * Teste la connexion à la base de données
 * Utilisé au démarrage du serveur (server.js)
 */
async function testConnection() {
  let connection;

  try {
    // Tentative de connexion
    connection = await getConnection();

    // Log de succès (visible dans Datadog)
    logger.info({
      action: "DATABASE_CONNECTION_TEST_SUCCESS",
      message: "Oracle connection successful"
    });

    return true;

  } catch (err) {

    // Log d'erreur détaillé (très important pour debug)
    logger.error({
      action: "DATABASE_CONNECTION_ERROR",
      message: err.message,
      code: err.errorNum,   // Code Oracle (ex: ORA-01017)
      stack: err.stack
    });

    return false;

  } finally {
    // Toujours fermer la connexion pour éviter fuite mémoire
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        logger.error({
          action: "DATABASE_CONNECTION_CLOSE_ERROR",
          message: closeErr.message
        });
      }
    }
  }
}

// Export des fonctions pour les utiliser ailleurs
module.exports = {
  getConnection,
  testConnection
  
};
logger.debug({
  action: "DATABASE_CONNECTION_OPEN"
});