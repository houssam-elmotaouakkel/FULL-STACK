// kanjibo data mn service dyal orders
const { readOrders } = require("../services/orderService");

// fonction katrd ga3 les orders
function getOrders(req, res, logger) {
  const orders = readOrders();
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(orders));
  logger.log({ event: "response:sent", statusCode: 200, route: "/api/orders" });
}

// katrd order bl'ID
function getOrderById(req, res, logger) {
  const id = req.url.split("/").pop();
  const orders = readOrders();
  const order = orders.find((o) => String(o.id) === id);

  if (!order) {
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Order not found" }));
    logger.log({ event: "response:sent", statusCode: 404, route: req.url });
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(order));
  logger.log({ event: "response:sent", statusCode: 200, route: req.url });
}

module.exports = { getOrders, getOrderById };
