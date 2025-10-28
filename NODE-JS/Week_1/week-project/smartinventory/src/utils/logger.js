// hna kanjibo wahd class 'EventEmitter' mn nodejs
// had class katkhlina nsaybo des objects kaytl9o a7dat'Events' w ysem3o lihom 'Listners'
const EventEmitter = require("events");

//hna kansaybo class Logger katwret mn "EventEmitter"(ya3ni ghadi twret ga3 lkhasa2is dyal "EventEmitter" E/L)
class Logger extends EventEmitter {
  constructor() 
  {
    super(); // khas n3yto liha mn nste3mel constructor dyal "EventEmitter" hit wretna mno
    // kol wa9t kayji event 'log' katprint message f console
    this.on("log", (info) => {
      console.log(`[LOG ${new Date().toISOString()}]`, info);
    });
  }

  // fonction log mn kan3yet liha katle9 (emit) wahd l7adate (event) smito "log" + katdwez wahd info
  log(info) {
    this.emit("log", info);
  }
}
// hna kandiro tasdir (export) dyal Logger bach y9der ay dossier f project yste3mlo
module.exports = { Logger };
