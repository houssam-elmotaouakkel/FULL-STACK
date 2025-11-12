const errorHandler = async (err, req, res, next) => {
    console.error('erreur intercepter:', err);

    let statusCode = 500;
    let message = 'erreur interne du serveur';

    if (err.name === 'validationError') {
        statusCode = 400;
        message = 'JSON mal formé';
    }

    res.status(statusCode).json({
        status: 'error',
        message: message,
        code: statusCode,
        timestamp: new Date().toISOString()
    });
};


module.exports = errorHandler;