const express = require('express');
const router = express.Router();
const { getInfo } = require('../controllers/infoController');

router.get('/', getInfo);

module.exports = router;