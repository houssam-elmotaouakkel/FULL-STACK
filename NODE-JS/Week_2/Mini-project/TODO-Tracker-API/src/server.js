require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const todosRoutes = require('./routes/todos.routes');


app.use(express.json());
app.use(logger);
app.use('/api/todos', todosRoutes);


app.get('/', (req, res) => {
    res.send('A mar7ba biiiiiiiiiiiik n3amas');
});


app.use(errorHandler);


app.listen(PORT, () =>{
    console.log(`Le serveur ecoute sur le port ${PORT}`);
});