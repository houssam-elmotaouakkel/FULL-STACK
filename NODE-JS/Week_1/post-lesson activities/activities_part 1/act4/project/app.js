const {ajouterContact, listerContacts} = require("./ContactService"); // Hna kan3ayto (require) l-fichier "ContactService.js" w kanstakhdmo la déstructuration bach nkhdo ghir les fonctions li 7na bghina : "ajouterContact" w "listerContacts"
const formaterContact = require("./utils/format");  // Hna kan3ayto l-fichier "utils/format.js" bach nkhdmo bih f had fichier had fichier kaykon fih wahd l-fonction li kat-formati contact (tartbo f chi style)

ajouterContact("Alice", "0600000000"); // Hna kanzido contact jdida smitha "Alice" m3a numéro "0600000000"
ajouterContact("Bob", "0611111111");  // Hna kanzido contact akhor smitou "Bob" b numéro "0611111111"
listerContacts().forEach(c => console.log(formaterContact(c)));  // Hna kanjibo la liste dyal contacts (b fonction listerContacts) w kanmoro 3la kol wa7ed bihom bach n-formatih b formaterContact w n-affichih f la console