// nimportiw les modules nécessaires
const fs = require("fs"); // bach nkhdmo m3a fichiers
const EventEmitter = require("events"); // bach nkhdmo b système d’événements

// ncréiw classe Logger li kat hériti men EventEmitter
class Logger extends EventEmitter {
  // méthode log bach nktbo message f fichier log.txt
  log(message) {
    // nktbo message f fichier (append: kayzid f la fin)
    fs.appendFileSync("log.txt", message + "\n");

    // nsifto événement "messageLogged" b data (message + date)
    this.emit("messageLogged", { message, date: new Date() });
  }
  log(message) {
  const time = new Date().toLocaleTimeString(); // ex: 10:45:02
  fs.appendFileSync("log.txt", `[${time}] ${message}\n`);
  this.emit("messageLogged", { message, time });
}

}


// nkhdmo export bach n9dro nimportiwha f fichiers okhrin
module.exports = Logger;
