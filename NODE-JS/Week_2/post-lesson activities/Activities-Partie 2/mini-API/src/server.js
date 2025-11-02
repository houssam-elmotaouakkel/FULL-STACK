require('dotenv').config();
const express = require('express');

const logger = require('./middlewares/logger');
const apiRouter = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(logger);
app.use('/api', apiRouter);
app.use(errorHandler);

app.get('/', (req, res, next) => {
    res.send('Bienvenue a mon application Express');
});


app.listen(PORT, () => {
    console.log(`Le serveur ecoute sur le port ${PORT}`);
});
