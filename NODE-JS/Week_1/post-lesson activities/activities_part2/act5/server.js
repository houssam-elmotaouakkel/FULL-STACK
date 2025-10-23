const http = require('http'); // nimportiw module http li kaykhlina ndirou serveur

const server = http.createServer((req, res) => { // kancreaw serveur jdida
    if (req.url === "/") { // ila l'utilisateur tla3 l'url "/"
        res.write("Bienvenue sur notre serveur node.js !"); // kansift message simple f browser
        res.end();
    } else if (req.url === "/api/etudiants") {  // ila l'utilisateur tla3 l'url "/api/etudiants"
        res.writeHead(200, { 'Content-Type': 'application/json' });  // kansift header li kaygol li browser hadchi JSON
        res.end(JSON.stringify(["Asma", "youness", "oussama"])); // kansift liste dyal etudiants f format JSON
    } else {   // ila l'url ma matchach m3a chi path ma3ruf
        res.writeHead(404);  // kansift status 404 w message
        res.end("Page non trouvée");
    }
});

server.listen(3000, () => console.log("Le serveur écoute sur le port 3000...")); // kanbda serveur f port 3000 w katprint message f console