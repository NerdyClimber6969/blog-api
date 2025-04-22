class ServiceError extends Error {
    constructor(message, statusCode=400) {
        super(message);
        this.type = "service error";
        this.statusCode = statusCode;
        this.isOperational = true;
    };
};

module.exports = ServiceError;