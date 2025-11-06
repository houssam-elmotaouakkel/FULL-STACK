const express = require('express');
const router = express.Router();
const infoRouter = require('./info');
const resourceRouter = require('./resources');
const privateRouter = require('./private');

router.use('/info', infoRouter);
router.use('/resources', resourceRouter);
router.use('/private', privateRouter);


module.exports = router;