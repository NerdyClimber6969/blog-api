function handleError (error, req, res, next) {
    console.error(error);

    const baseErrorJson = { success: false };
    if (!error.isOperational) {
        return res.status(500).json({
            ...baseErrorJson,
            errors: [
                {
                    message: 'Unexpected internal server error occured',
                    type: 'unexpected error',
                }
            ]
        });
    };

    return res.status(error.statusCode).json({ 
        ...baseErrorJson,
        errors: [
            {
                message: error.message, 
                type: error.type
            }
        ]
    });
};

module.exports = { handleError };