// kan-importiw modules li hna ghadi nkhdmo bihom
const http = require("http");
const { router } = require("./router");
const { Logger } = require("./utils/logger");


const logger = new Logger();


const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // kan-logiw kol requête katji
  logger.log({ event: "request:received", method: req.method, url: req.url });

  // kanmchiw l router bach ychouf chno path
  router(req, res, logger);
});

// kan-khaliw serveur ytsna 3la port
server.listen(PORT, () => {
  console.log(`Smart Inventory System khdem 3la port ${PORT}`);
  logger.log({ event: "server:start", port: PORT });
});
