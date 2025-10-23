const os = require("os"); // Hna kan3ayto (require) l-module "os" li jaye m3a Node.js had module kay3tina ma3lomat 3la système dyal l'ordinateur (Operating System)

console.log("platforme :", os.platform());  // Kat-affichi platforma (Windows, Linux, macOS, etc.)
console.log("architecturee :", os.arch()); // Kat-affichi architecture dyal système (b7al x64, arm, etc.)
console.log("CPU :", os.cpus().length, "coeurs");  // Kat-affichi ch7al mn processeur (CPU) 3andek — b nombre dyal coeurs
console.log("memoire totale :", os.totalmem());  // Kat-affichi la mémoire totale (en octets)
console.log("memoire libre :", os.freemem());   // Kat-affichi la mémoire li mazal khawya (disponible)
console.log("uptime (en heures) :", (os.uptime() / 3600).toFixed(2));  // Kat-affichi ch7al mn wa9t (en heures) l'ordinateur khddam (uptime)