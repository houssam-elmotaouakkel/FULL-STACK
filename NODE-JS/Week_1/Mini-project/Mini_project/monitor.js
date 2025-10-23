// nimportiw les modules nécessaires
const os = require("os");       // bach njibo infos système (mémoire, uptime, etc.)
const Logger = require("./logger"); // nimportiw Logger li drnaha
const logger = new Logger();        // ncréiw instance menha

// nssma3o l’événement messageLogged bach n3rfou wa9tma ytloga chi haja
logger.on("messageLogged", (data) => {
  console.log("Événement capturé :", data);
});

// fonction bach tcollecta infos système
function collectSystemData() {
  const freeMem = os.freemem();   // mémoire libre
  const totalMem = os.totalmem(); // mémoire totale
  const uptime = os.uptime();     // durée depuis démarrage système

  // ncalculiw pourcentage mémoire libre
  const percentFree = ((freeMem / totalMem) * 100).toFixed(2);

  // nsajlo message formaté
  const logMessage = ` ${new Date().toLocaleString()} | Mémoire libre: ${freeMem} / ${totalMem} (${percentFree}%) | Uptime: ${uptime}s`;

  // nsajlo message f fichier log.txt
  logger.log(logMessage);

  //  ila mémoire libre < 20%, nsifto événement "lowMemory"
  if (percentFree < 20) {
    logger.emit("lowMemory", { percentFree });
  }
}

// nssma3o l’événement "lowMemory" bach n3rfo ila système 3ando problème
logger.on("lowMemory", (data) => {
  console.log(`Alerte : Mémoire faible (${data.percentFree}%)`);
});

// n3ayto 3la fonction kol 5 secondes
setInterval(collectSystemData, 5000);
