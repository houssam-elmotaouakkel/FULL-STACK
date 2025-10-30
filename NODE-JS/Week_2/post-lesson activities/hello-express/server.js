const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', (req, res) => {
    res.send('Bienvenue a mon application Express');
});

app.get('/api/products', (req, res, next) => {
    const data = fs.readFileSync('./data/products.json');
    const products = JSON.parse(data);
    res.json(products);
});

app.get('/api/products', (req, res) => {
    res.json([{id: 1, name: 'Laptop'}, {id: 2, name: 'phone'}])
});

app.get('/api/products/:id', (req, res) => {
    res.json({ message: `produit ${req.params.id}`});
});

app.use((req, res, next) => {
    comsole.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use((req, res, next) => {
    req.startTime = Date.now();
    next();
});

app.get('/ping', (req, res) => {
    const duration = Date.now() - req.startTime;
    res.json({ message: 'pong', duration: `${duration}ms` });
});

app.get('/api/crash', (req, res, next) => {
    const err = new Error('Erruer simulée');
    next(err);
});

app.use((err, req, res, next) =>{
    console.error('Erreur detectée:', err.message);
    res.status(500).json({ error: err.message});
});

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Le serveur ecoute sur le port 3000');
});
