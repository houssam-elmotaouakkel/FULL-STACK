const http = require('http'); // nimportiw module http bach nkhdmo serveur web
const Logger = require('./logger');  // nimportiw class Logger men fichier logger.js
const logger = new Logger();  // kancreaw instance jdida dyal Logger

logger.on('messageLogged', (data) =>  // kan3aytou l'event 'messageLogged' — ila t9adat, kaytprint data f console
    console.log('evenement capture :', data)
);

const server = http.createServer((req, res) => { // kancreaw serveur li kayst3mel http module
    logger.log(`requete recue: ${req.url}`); // kol ma tji requête (GET, POST, etc.), kanlogiw l'URL f fichier log.txt
    res.end("requete enregistree");  // kansift réponse simple l'utilisateur
});

server.listen(4000, () => console.log("serveur sur le port 4000..."));  // kanbda serveur f port 4000 w kanprint message f console