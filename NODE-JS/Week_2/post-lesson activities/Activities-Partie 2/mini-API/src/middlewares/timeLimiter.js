const timeLimiter = (req, res, next) => {
    console.log('middleware timeLimiter appele');

    const now = new Date();
    const currentHour = now.getHours();

    console.log(`current time is: ${currentHour}h`);

    if (currentHour >= 22 || currentHour < 6) {
        console.log('acces refuse hors haorares');
        return res.status(403).json({
            error: 'acces refuse',
            reason: 'horaire interdit',
            currentTime: now.toISOString(),
            statusCode:403,
            timestamp: new Date().toISOString()
        });
    }

    console.log('horaire autorise');

    next();

};


module.exports = timeLimiter;