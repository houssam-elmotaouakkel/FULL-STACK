const getInfo = (req, res) => {
    const info = {
        name: process.env.PROJECT_NAME || 'mini-api',
        version: process.env.VERSION || '1.0.0',
        date: new Date().toISOString()
    };
    res.json(info);
};
module.exports = { getInfo }; 