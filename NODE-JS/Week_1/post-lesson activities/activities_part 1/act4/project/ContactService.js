const contacts = [];  // Hna 3ndna wahd l-tableau (array) smito "contacts" bach nkhdmo bih bach nkhznou fih les contacts

function ajouterContact(nom, telephone) {// Had l-fonction "ajouterContact" katdkhl smit l-contact w numéro dyalou w katzid wahd l-objet jdida f tableau "contacts"
    contacts.push({nom, telephone});
}

function listerContacts() {  // Had l-fonction "listerContacts" katrja3 lina tableau kaml dyal les contacts
    return contacts;
}

module.exports = { ajouterContact, listerContacts};  // Hna kan3mlo "export" l-jouj fonctions bach nkhdmo bihom f fichier akhor bach mnin ndir require('./ContactService') ykoun 3andna access 3lihom