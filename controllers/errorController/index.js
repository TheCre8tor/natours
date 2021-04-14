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

const handleJWTError = () => {
    return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
    return new AppError('Your token has expired! Please log in again.', 401);
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
        console.log(error);

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
        // I clone the err object with Object.assign(), spread operator is not showing CastErrors name.
        let error = Object.assign(err);
        // console.log(error.constructor.name)
        // console.log({ error });

        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        }
        if (error.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        if (error.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        }
        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }
        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        }
        sendErrorProd(error, res);
    }

    next();
};
