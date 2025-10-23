function formaterContact(contact) { // Had l-fonction "formaterContact" katakhod wahd l-contact (objet) w katrja3o f chi format mzn : "smito - numéro dyalou"
    return `${contact.nom} - ${contact.telephone}`;
}

module.exports = formaterContact; // Hna kan3mlo export l-fonction bach nkhdmo biha f fichiers okhrin bach mnin ndir require("./utils/format") tkon had fonction mawjouda