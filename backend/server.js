// Charger les variables d'environnement depuis le fichier .env
require("dotenv").config();
// Importer le logger (Winston → utilisé pour Datadog)
const logger = require("./logger");
// Importer l'application Express (routes + middlewares)
const app = require("./app");
// Importer la fonction pour tester la connexion à la base Oracle
const { testConnection } = require("./db");
// Définir le port du serveur (7000 par défaut si non défini dans .env)
const PORT = process.env.PORT || 7000;
// Démarrer le serveur Express :ouvre ton API sur http://localhost:7000
//kafka
const { connectProducer } = require("./kafka/producer");



app.listen(PORT, async () => {
// Log de démarrage du serveur
  logger.info({
    action: "SERVER_STARTED",
    message: "Server running",
    port: Number(PORT)
  });
await connectProducer();

// Tester la connexion à la base de données:avant d’accepter des requêtes, tu vérifies que Oracle est OK
  const isConnected = await testConnection();

// Si la connexion échoue → arrêter l'application :très important en prod ➡️ sinon ton API tourne… mais ne sert à rien
  if (!isConnected) {

// Log d'erreur pour Datadog
    logger.error({
      action: "DATABASE_CONNECTION_FAILED",
      message: "DB not connected"
    });

// Stopper le serveur (évite de tourner sans DB)
    process.exit(1);
  }

// Si la connexion réussit → log de succès
  logger.info({
    action: "DATABASE_CONNECTION_AVEC_SUCCESS",
    message: "DB connected"
  });
});