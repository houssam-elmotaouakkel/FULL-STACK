const authMiddleware = (req, res, next) => {
    console.log('middleware auth appele');
    
    const token = req.headers.authorization;
    console.log('token recu:', token);

    if (!token) {
        console.log('token makinach');
        return res.status(401).json({
            error: 'acces refuse',
            reason: 'token manquant',
            statusCode: 401,
            timestamp: new Date().toISOString()
        });
    }

    if (token !== "1234") {
        console.log('token invalide');
        return res.status(401).json({
            error: 'acces refuse',
            reason: 'token incorrecte',
            statusCode: 401,
            timestamp: new Date().toISOString()
        });
    }

    console.log('token valider');

    next();
};


module.exports = authMiddleware;