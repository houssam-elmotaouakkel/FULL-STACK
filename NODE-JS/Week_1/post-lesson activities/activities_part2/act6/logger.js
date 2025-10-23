const fs = require('fs');  // nimportiw module fs bach n9dro nkhdmo m3a fichiers
const EventEmitter = require('events');  // nimportiw EventEmitter bach nist3mlo events

class Logger extends EventEmitter {  // kancreaw class Logger li katsowwr EventEmitter
    log(message) { // method log li katakhod message
        fs.appendFileSync("log.txt", message + "\n");   // katsift message l'fichier log.txt w katzid newline
        this.emit('messageLogged', { message, date: new Date() });  // kanemitiw event 'messageLogged' w kansiftu object fih message w date dyal waqt
    }
}

module.exports = Logger;   // kanexportiw Logger bach ykhdem f fichiers akhrin