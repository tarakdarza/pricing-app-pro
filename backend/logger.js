// Importer Winston
const { createLogger, format, transports } = require("winston");
const path = require("path");

// Création du logger principal
const logger = createLogger({
  // Niveau minimum des logs
  level: process.env.LOG_LEVEL || "info",

  // Format des logs (JSON + timestamp + stack)
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),

  // Métadonnées globales (Datadog)
  defaultMeta: {
    service: "pricing-app-pro",
    env: process.env.NODE_ENV || "development"
  },

  // Transports = destinations des logs
  transports: [
    // 📁 Fichier (avec rotation)
    new transports.File({
      //filename: process.env.LOG_FILE || path.join(__dirname, "logs/app.log"),
      filename: process.env.LOG_FILE || "C:/logs/app.log",

      maxsize: 5 * 1024 * 1024, // 5MB max par fichier
      maxFiles: 5               // garder 5 fichiers max
    }),

    // 🖥️ Console (utile en dev + Docker)
    new transports.Console()
  ]
});

// Export du logger
module.exports = logger;