const fs =  require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../data.json');


//n9raw data mn l'fichier dyalna
const readData = () => {
    try {
        if (!fs.existsSync(dataPath)) {
            return { resources: [] };
        }
        const rawData = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error('erreur fl9raya dyal Data.json:', error);
        return { resources: []};
    }
};


// labghina nektbo chi haja fdik l'fichier
const writeData = (data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error){
        console.error('erreur flktaba flfichier Data.json:', error);
        return false;
    }
};


// GET ga3 les donnee li kaynin
const findAll = () => {
    const data = readData();
    return data.resources || [];
};


//GET data special bl'Id dyalha
const findById = (id) => {
    const data = readData();
    const resources = data.resources || [];
    return resources.find(resource => resource.id === parseInt(id));
};


//POST labghina n'creiw chi resource jdid
const create = (resourceData) => {
    const data = readData();
    const resources = data.resources || [];

    //n9albo 3la l'Id jdid
    const nextId = resources.length > 0 
    ? Math.max(...resources.map(r => r.id)) + 1 : 1;

    const newResource = {
        id: nextId,
        ...resourceData,
        createdAt: new Date().toISOString,
        updatedAt: new Date().toISOString
    };

    resources.push(newResource);
    data.resources = resources;

    if (writeData(data)) {
        return newResource;
    }
    throw new error('erreur fsauvgarde dyal had resource');
};


//PUT la bghina nbedlo chi resource
const update = (id, resourceData) => {
    const data = readData();
    const resources = data.resources || [];
    const index = resources.findIndex(resource => resource.id === parseInt(id));

    if (index === -1) return null;

    resources[index] = {
        ...data.resources[index],
        ...resourceData,
        updatedAt: new Date().toISOString()
    };

    data.resources = resources;

    if (writeData(data)) {
        return resources[index];
    }
    throw new error('erreur fsauvgarde');
};


// DELETE labghina nmes7o chi resource
const deleteById = (id) => {
    const data = readData();
    const resources = data.resources || [];
    const initialLength = resources.length;

    data.resources = resources.filter(resource => resource.id !== parseInt(id));

    if (data.resources.length === initialLength) return false;

    return writeData(data);
};


module.exports = {
    findAll,
    findById,
    create,
    update,
    deleteById
};