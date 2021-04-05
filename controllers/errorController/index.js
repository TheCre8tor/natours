const AppError = require('./../../utils/appErrors');

const handleCastErrorDB = error => {
    let message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    let message = `Duplicate field value: ${value[0]}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorDev = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack
    });
};

const sendErrorProd = (error, res) => {
    if (error.isOperational) {
        // Operational, trusted errors: send message to client
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    } else {
        //  Programming or other unknown errors: don't leak error details
        // 1) Log Error --> console.error('Error', error);

        // 2) Send generic error
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'errors';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        /* It is not a good idea to mutate a response directly,
         * that's the reason why we need to have a shallow copy,
         * but in this case we can't because we are not receiving
         * the name property after we perform the shallow copy.
         * so I mutate the object directly...  */
        // let error = { ...err };

        if (err.name === 'CastError') {
            err = handleCastErrorDB(err);
        }
        if (err.code === 11000) {
            err = handleDuplicateFieldsDB(err);
        }
        if (err.name === 'ValidationError') {
            err = handleValidationErrorDB(err);
        }
        sendErrorProd(err, res);
    }

    next();
};
