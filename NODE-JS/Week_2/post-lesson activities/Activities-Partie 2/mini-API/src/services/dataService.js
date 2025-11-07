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
        console.error('erreur fl9raya dyal products.json:', error);
        return [];
    }
};


const getProducts = (filters = {}) => {

    let products = readProducts();

    if (filters.category) {
        products = products.filter(product =>
            product.category === filters.category
        );
    }

    if (filters.minPrice) {
        const minPrice = parseFloat(filters.minPrice);
        products = products.filter(product => product.price >= minPrice);
    }

    if (filters.maxPrice) {
        const maxPrice = parseFloat(filters.maxPrice);
        products = products.filter(product => product.price <= maxPrice);
    }

    if (filters.sort) {
        if (filters.sort === 'asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (filters.sort === 'desc') {
            products.sort((a, b) => b.price - a.price);
        }
    }

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