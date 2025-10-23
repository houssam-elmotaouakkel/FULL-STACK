const Logger = require("./logger"); // nimportiw class Logger li darna f fichier logger.js

const logger = new Logger(); // kancreaw instance jdida dyal Logger

logger.on("messageLogged", (data) => { // kan3aytou listener l'event 'messageLogged' ila t9adat, kayt9ra callback li katprint data dyal l'event f console
    console.log("evenment capture :", data); 
});

logger.log("Application demaree !"); // kan3aytou method log li katsift message w katemiti event 'messageLogged'