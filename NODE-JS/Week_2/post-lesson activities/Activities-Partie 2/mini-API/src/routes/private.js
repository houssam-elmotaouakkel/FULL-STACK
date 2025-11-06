const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');
const timeLimiter = require('../middlewares/timeLimiter');

router.get('/', authMiddleware, timeLimiter, (req, res) => {
    res.status(200).json({
        message: 'bienvenue dans la zone privee',
        accessTime: new Date().toISOString()
    });
});


module.exports = router;