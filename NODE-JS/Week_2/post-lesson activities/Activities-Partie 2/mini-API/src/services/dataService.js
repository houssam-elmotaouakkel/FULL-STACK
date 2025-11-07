const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../data/products.json');


const readProducts = () => {
    try {
        if (!fs.existsSync(dataPath)) {
            console.error('fichier prosucts,json makinch');
            return [];
        }
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(rawData);
        return data.products || [];
    } catch (error) {
        console.error('erruer fl9raya dyal products.json:', error);
        return [];
    }
};


const getProducts = (filters = {}) => {
    console.log('filters appliques:', filters);

    let products = readProducts();
    console.log('produits charges:', products.length);

    if (filters.category) {
        products = products.filter(product =>
            product.category === filters.category
        );
        console.log(`filtre categorie: ${filters.category} -> ${products.length} produits`);
    }

    if (filters.minPrice) {
        const minPrice = parseFloat(filters.minPrice);
        products = products.filter(product => product.price >= minPrice);
        console.log(`filtre prix min: ${minPrice} -> ${products.length} produits`);
    }

    if (filters.maxPrice) {
        const maxPrice = parseFloat(filters.maxPrice);
        products = products.filter(product => product.price <= maxPrice);
        console.log(`filtre prix max: ${maxPrice} -> ${products.length} produits`);
    }

    if (filters.sort) {
        if (filters.sort === 'asc') {
            products.sort((a, b) => a.price - b.price);
            console.log('tri prix croisssant');
        } else if (filters.sort === 'desc') {
            products.sort((a, b) => b.price - a.price);
            console.log('tri par prix decroissant');
        }
    }

    console.log(`resultats finaux: ${products.length} products`);
    return products;
};


const getCategories = () => {
    const products = readProducts();
    const categories = [];
    products.forEach(product => {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });

    return categories;
};

module.exports = {
    getProducts,
    getCategories
};