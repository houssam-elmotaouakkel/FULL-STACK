class appErrror extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.timestamp =new Date().toISOString();
    }
}

module.exports = appErrror;