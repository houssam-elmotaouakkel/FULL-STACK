const fs = require("fs");
const path = require("path");

function readOrders() {
  const file = path.join(__dirname, "../../data/orders.json");

  try {
    const data = fs.readFileSync(file, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erreur f lecture commandes:", err);
    return [];
  }
}

module.exports = { readOrders };
