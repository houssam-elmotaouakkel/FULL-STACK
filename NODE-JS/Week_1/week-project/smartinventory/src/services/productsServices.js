const fs = require("fs");
const path = require("path");

function readProducts() {
  const file = path.join("../data/products.json");
 
  try {
    const data = fs.readFileSync(file, "utf8");
    return JSON.parse(data); 
  } catch (err) {
    console.error(" Erreur f lecture produits:", err);
    return []; 
  }
}

module.exports = { readProducts };
