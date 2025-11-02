const errorHandler = (err, req, res, next) => {
    // Default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Log error for debugging
    console.error(err);

};

module.exports = errorHandler;
