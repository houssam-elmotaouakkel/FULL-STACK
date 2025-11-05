const validateResurce = (req, res, next) => {
    try {
        const { title } = req.body;
        const errors = [];

        if (req.method === 'POST' || req.method === 'PUT') {
            if (!title || title.trim() === '') {
                errors.push('darori tekteb lina title');
            } else {
                req.body.title = title.trim();

            if (title.length < 3) {
                errors.push ('title khaso ykon 3la l2a9al 3 d\'les caractere');
            } else if (title.length > 100) {
                errors.push('3ay9ti 100 caractere kamlha title kon t7chem');
            }
        }
    }
    if (errors.length > 0) {
        console.log('erreur fl\'validation', errors);
        return res.status(400).json({
            error: 'donnees ghaltin',
            message: errors,
            statuscode: 400,
            timestamp: new Date().toISOString()
        });
    }
    next();
    } catch (error){
        console.error('erreur f\'validateResource:', error);
        next(error);
    }
};

module.exports = validateResurce;