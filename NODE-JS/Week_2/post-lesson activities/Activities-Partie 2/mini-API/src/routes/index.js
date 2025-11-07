const express = require('express');
const router = express.Router();
const infoRouter = require('./info');
const resourceRouter = require('./resources');
const privateRouter = require('./private');
const productsRouter = require('./products');


router.use('/info', infoRouter);
router.use('/resources', resourceRouter);
router.use('/private', privateRouter);
router.use('/products', productsRouter);


module.exports = router;