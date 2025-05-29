const { checkExact, validationResult } = require('express-validator');
const { ValidationError } = require('../../errors/Error.js');

function formatError(errors) {
    const errorDetails = {};

    for (const error of errors) {
        switch (error.type) {
            case 'field':
                errorDetails.invalidFieldError ?  (
                    errorDetails.invalidFieldError .fields.push({ value: error.value, message: error.msg, path: error.path, location: error.location })
                ) : (
                    errorDetails.invalidFieldError  = { type: error.type, fields: [{ value: error.value, message: error.msg, path: error.path, location: error.location }] }
                );

                break;

            case 'unknown_fields':
                errorDetails.unknownFieldError = { ...error };
                break;

            default:
                // Error is not any of the known types! Do something else.
                throw new Error(`Unknown error type ${error.type}`);
        }; 
    };

    return errorDetails;         
};


function handleValdationError(req, res, next) {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        const errorArray = error.array();
        const formatedErrors = formatError(errorArray);
        return next(new ValidationError('Invalid input', formatedErrors));
    };
    
    next();
}

function createValidationMiddleware(valdationChain) { 
    const validateKey = checkExact([], { message: (fields) => { 
        const [field] = fields;
        return (`Unknown field '${field.path}' found in ${field.location} with value '${field.value}'`);
    }});

    return [
        ...valdationChain,
        validateKey,
        handleValdationError
    ];
};


module.exports = { createValidationMiddleware };