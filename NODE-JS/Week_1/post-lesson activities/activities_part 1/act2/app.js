const saluer = require('./greet');             // Hna kan3ayto (require) l-fichier li smyto "greet.js" bach nkhdmo bih f had fichier
console.log(saluer("Houssam"));               // Hna kan3ayto l-fonction l-kbira li katji men "greet" bach tsalem 3la "Houssam"
console.log(saluer.DireAuRevoir("Houssam")); // Hna kan3ayto l-fonction "DireAuRevoir" li katkon exportée mn "greet.js"+
                                            // bach tqol bssa7a ("au revoir") l "Houssam"