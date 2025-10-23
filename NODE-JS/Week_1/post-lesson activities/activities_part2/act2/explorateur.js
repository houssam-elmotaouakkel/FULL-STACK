const fs = require("fs");  // Hna kan3ayto (require) l-module "fs" li khas b fichier system (File System) bach nkhdmo m3a les fichiers w les dossiers
const path = require("path");  // W kan3ayto l-module "path" bach nkhdmo b les chemins (paths) dyal fichiers w dossiers

fs.readdir(__dirname, (err, files) => {  // Hna kanst3mlo "fs.readdir" bach n9ra contenu dyal dossier li fih had fichier (__dirname kay3ni chemin dyal dossier li fih had script)
  if (err) return console.error("erreur :", err.message);   // Ila w9a3 chi erreur f qra2a, kat-affichi l-message dyal l'erreur
    console.log("contenu du dossier :", files);  // Kat-affichi liste dyal les fichiers li kaynin f had dossier

    files.forEach(f => console.log(path.join(__dirname, f)));  // Katmchi 3la kol fichier f had dossier w kat-affichi l-chemin kaml dyal kol wa7ed (path.join katjma3 dirname + smit fichier)
});

