// kan-importiw controllers dyal produits w orders
const url = require("url");
const { getFilteredProducts, getProductById ,exportgz } = require("./controllers/productsController");
const { getOrders, getOrderById } = require("./controllers/ordersController");

// had fonction hiya li kat-dir routing
function router(req, res, logger) {

// kan-importiw module URL bach nparsew l URL
  const { URL } = require('url');

// kanparsew l URL bach n3rfou path
const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
const { pathname } = parsedUrl;


  // route /health bach n3rf server kaykhdem
  if (pathname === "/health") {
    const data = {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(data));
    logger.log({ event: "response:sent", statusCode: 200, route: "/health" });
    return;
  }

  // route dyal produits
  if (pathname === "/api/products") return getFilteredProducts(req, res, parsedUrl, logger);;
  if (pathname.startsWith("/api/products/")) return getProductById(req, res, logger);

  // route dyal commandes
  if (pathname === "/api/orders") return getOrders(req, res, logger);
  if (pathname.startsWith("/api/orders/")) return getOrderById(req, res, logger);

  if(pathname==="/api/export.gz") return exportgz(req,res,logger); 
  // ila makanch route katsmatchi → 404
  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Not Found" }));
  logger.log({ event: "response:sent", statusCode: 404, route: pathname });

  
}

module.exports = { router };
