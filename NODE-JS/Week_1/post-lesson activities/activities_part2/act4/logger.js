const EventEmitter = require('events');  // nimportiw module dyal events bach nist3mlo EventEmitter

class Logger extends EventEmitter { // kancreaw class jdida smitha Logger li katsowwr EventEmitter
    log(message) {  // method smitha log li katakhod message
        console.log("LOG :", message);  // katsift message f console
        this.emit('messageLogged', { message: message, timestamp: new Date() });  // kanemitiw event smitu 'messageLogged' w kansiftu object fih message w timestamp dyal waqt
    }
}

module.exports = Logger; // kanexportiw Logger bach ykhdem f fichiers akhrin