const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenue a mon application Express');
});

app.listen(3000, () => {
    console.log('Le serveur ecoute sur le port 3000');
});

app.get('/api/products', (req, res) => {
    res.json([{id: 1, name: 'Laptop'}, {id: 2, name: 'phone'}])
});

app.get('/api/products/:id', (req, res) => {
    res.json({ message: `produit ${req.params.id}`});
});