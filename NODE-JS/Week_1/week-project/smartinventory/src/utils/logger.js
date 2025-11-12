const EventEmitter = require("events");

class Logger extends EventEmitter {
  constructor() 
  {
    super(); 

    this.on("log", (info) => {
      console.log(`[LOG ${new Date().toISOString()}]`, info);
    });
  }

  log(info) {
    this.emit("log", info);
  }
}
module.exports = { Logger };
