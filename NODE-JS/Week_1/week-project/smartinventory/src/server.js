const http = require("http");
const { router } = require("./router");
const { Logger } = require("./utils/logger");


const logger = new Logger();


const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  logger.log({ event: "request:received", method: req.method, url: req.url });
  router(req, res, logger);
});

server.listen(PORT, () => {
  console.log(`Smart Inventory System khdem 3la port ${PORT}`);
  logger.log({ event: "server:start", port: PORT });
});
