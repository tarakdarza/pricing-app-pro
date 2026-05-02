require("dotenv").config();

const { testConnection } = require("../db");

(async () => {
  const result = await testConnection();

  if (result) {
    console.log("🎉 Test DB réussi");
  } else {
    console.log("💥 Test DB échoué");
  }
})();