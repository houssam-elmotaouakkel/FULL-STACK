const EventEmitter = require('events');  // nimportiw module dyal events li kaykhlina ndirou event listener w emitter
const emitter = new EventEmitter();  // kancreaw instance jdida dyal EventEmitter

emitter.on("utilisateurConnecte", (data) => {  // kan3aytou l'event "utilisateurConnecte" w ila t9adat, kayt9ra callback function li katakhod data (information dyal l'utilisateur) w katsiftih f console
    console.log(`nouvelle connexion : ${data.nom} (${data.id})`);
});

emitter.emit("utilisateurConnecte", { id: 1, nom: "asma" }); // kanemitiw l'event "utilisateurConnecte" w kansiftu object li fih id w nom dyal l'utilisateur