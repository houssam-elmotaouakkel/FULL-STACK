require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');


const apiRouter = require('./routes');


app.use(express.json());
app.use(logger);
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send('Bienvenue a mon application Express');
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Le serveur ecoute sur le port ${PORT}`);
});
