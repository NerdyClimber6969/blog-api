function handleError(error, req, res, next) {
    console.error(error)

    // Handle non-operational errors (unexpected errors)
    if (!error.isOperational) {
        return res.status(500).json({
            success: false,
            error: {
                name: 'UnexpectedError',
                message: 'Unexpected internal server error occurred',
                statusCode: 500,
                timestamp: new Date().toISOString(),
            }
        });
    };
    
    // Build the error response object
    const errorResponse = {
        success: false,
        error: error.toJSON()
    };

    return res.status(error.statusCode).json(errorResponse);
};

module.exports = { handleError };