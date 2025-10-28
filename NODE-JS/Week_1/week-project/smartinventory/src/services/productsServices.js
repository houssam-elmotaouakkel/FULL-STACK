//had fichier kayqra data mn products.json
const fs = require("fs");
const path = require("path");

//function kt9ra Data mn products.json
function readProducts() {
  const file = path.join("../data/products.json");
 
  try {
    // kanqraw contenu dyal fichier
    const data = fs.readFileSync(file, "utf8");
    return JSON.parse(data); // kat7wel txt json l'object
  } catch (err) {
    console.error(" Erreur f lecture produits:", err);
    return []; // array vide bach programme mayw9efch
  }
}
 // export dyal function
module.exports = { readProducts };
