class AuthError extends Error {
    constructor(message, statusCode=401) {
        super(message);
        this.type = "auth error";
        this.statusCode = statusCode;
        this.isOperational = true;
    };
};

module.exports = AuthError;