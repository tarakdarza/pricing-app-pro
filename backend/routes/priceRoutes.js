// Importer Express pour créer un router
const express = require("express");

// Créer un router Express
// Un router permet de regrouper les routes liées au prix
const router = express.Router();

// Importer la fonction calculatePrice depuis le controller
const { calculatePrice } = require("../controllers/priceController");

// Route POST pour calculer le prix
// URL finale : POST /calculate-price
router.post("/", calculatePrice);

// Exporter le router pour l’utiliser dans app.js
module.exports = router;