console.log(__filename); // Kat-affichi (console.log) smiya kamla dyal l-fichier li rah khddam daba
console.log(__dirname);  // Kat-affichi l-chemin (path) dyal dossier li kayn fih had l-fichier
console.log(module);     // Kat-affichi l-objet "module" li kaykoun fih toutes les infos 3la had fichier
console.log(exports === module.exports); // Katqaren wach "exports" hiya nafs l-objet b7al "module.exports". (kayrja3 true ila kaynin b7al b7al)


exports.direSalut = () => console.log("salut !");  // Hna kanzido wahd l-fonction jdida smitha "direSalut" f exports li kat-affichi "salut !" f'console.log
console.log(module.exports);   // Kat-affichi l-objet "module.exports" bach tchouf daba chno kayn f exports