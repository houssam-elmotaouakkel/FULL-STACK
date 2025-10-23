const os = require("os"); // bach njibo infos système

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bienvenue sur le Node System Logger ");

  } else if (req.url === "/logs") {
    fs.readFile("log.txt", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Erreur lors de la lecture du fichier log.txt ");
      } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(data);
      }
    });

  } else if (req.url === "/stats") {
    // njibo infos système
    const stats = {
      freeMemory: os.freemem(),
      totalMemory: os.totalmem(),
      uptime: os.uptime(),
      percentFree: ((os.freemem() / os.totalmem()) * 100).toFixed(2) + "%",
      time: new Date().toLocaleTimeString(),
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(stats, null, 2)); // n’affichi en format JSON 
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page non trouvée ");
  }
});

server.listen(3000, () => console.log("Serveur en écoute sur le port 3000..."));
