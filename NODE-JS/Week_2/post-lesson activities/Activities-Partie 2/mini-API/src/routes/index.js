const express = require('express');
const router = express.Router();
const infoRouter = require('./info');
const resourceRouter = require('./resources');

router.use('/info', infoRouter);
router.use('/resources', resourceRouter);

module.exports = router;