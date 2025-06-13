class AppError extends Error {
    constructor(message, statusCode=500, details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.isOperational = true;
        
        // Maintains proper stack trace (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        };
    };
    
    toJSON() {
        const result = {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            timestamp: this.timestamp
        };
      
        if (this.details !== null) {
            result.details = this.details;
        };
      
        return result;
    };
};

class ValidationError extends AppError {
    constructor(message, details, statusCode=400) {
        super(message, statusCode, details);
    };
};

class AuthenticationError extends AppError {
    constructor(message, failureReason='unknown', statusCode=401) {
        super(message, statusCode, { failureReason });
    };
};


class AccessDeniedError extends AppError {
    constructor(
        message, 
        { role, resourceType, resourceId, userPermissions, requiredPermission, reason }, 
        statusCode=403
    ) {
        super(message, statusCode, { role, resourceType, resourceId, userPermissions, requiredPermission, reason });
    };
};
  

class ResourceNotFoundError extends AppError {
    constructor(message, resourceType, resourceId, statusCode=404) {
        const details = !resourceType && !resourceId ? null : { resourceType, resourceId } ;
        super(message, statusCode, details);
    };
};

module.exports = { ValidationError, AuthenticationError, AccessDeniedError, ResourceNotFoundError };