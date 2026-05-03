// Rôle de app.js :    
                    // 1. Créer l'app Express    
                    // 2. Ajouter des règles (middlewares)   
                    // 3. Brancher les routes
//1. Import des modules
const express = require("express"); // importes Express 👉 Express = framework pour créer ton API
const cors = require("cors"); //Permet d’autoriser le frontend à appeler ton API  👉 Sinon → erreur CORS (tu l’as déjà vue 😄)
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const priceRoutes = require("./routes/priceRoutes");
// 👉 IMPORTANT : créer app AVANT de l'utiliser
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/products", productRoutes);
app.use("/calculate-price", priceRoutes);
app.use(express.static(path.join(__dirname, "../frontend")));
// Frontend
app.use(express.static(path.join(__dirname, "../frontend")));
module.exports = app;
