const appErrror = require('../utils/appError');

const errorHandler = (err, req, res, next) => {
    console.error('Erreur interceptee', err.message);


    let errorResponse;


    if (err instanceof appErrror) {
        errorResponse = {
            status: "error",
            message: err.message,
            code: err.statusCode,
            timestamp: err.timestamp
        };
    }


    else {
        errorResponse = {
            status: "error",
            message: err.message || 'Erreur interne du serveur',
            code: err.statusCode || 500,
            timestamp: new Date().toISOString(),
        };
    }

    res.status(errorResponse.code).json(errorResponse);

};

module.exports = errorHandler;
