const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARE  -->
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toLocaleString();

    next();
});

// ROUTER MOUNTS MIDDLEWARE  -->
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// ERROR HANDLING
/* Why did this work?
  If we are able to reach this point, then it means
  the req and res circle as not yet finished. */
app.all('*', (req, res, next) => {
    // const error = new Error(`Can't find ${req.originalUrl} on this server`);
    // error.status = 'General Error: failed';
    // error.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
