const url = require("url");
const { getFilteredProducts, getProductById ,exportgz } = require("./controllers/productsController");
const { getOrders, getOrderById } = require("./controllers/ordersController");

function router(req, res, logger) {

  const { URL } = require('url');

const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
const { pathname } = parsedUrl;


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

  if (pathname === "/api/products") return getFilteredProducts(req, res, parsedUrl, logger);;
  if (pathname.startsWith("/api/products/")) return getProductById(req, res, logger);

  if (pathname === "/api/orders") return getOrders(req, res, logger);
  if (pathname.startsWith("/api/orders/")) return getOrderById(req, res, logger);

  if(pathname==="/api/export.gz") return exportgz(req,res,logger); 
  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Not Found" }));
  logger.log({ event: "response:sent", statusCode: 404, route: pathname });

  
}

module.exports = { router };
