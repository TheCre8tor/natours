const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// GLOBAL MIDDLEWARE  -->
// 1) Set Security HTTP Headers
app.use(helmet());

// 2) Development Lodging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 3) Limit Request From Same API
// <!-- This also prevent DOS - Denial Of Service or Brute Force Attack -->
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, Please try again in an hour!'
});
app.use('/api', limiter);

// 4) Body parser, reading data from body into req.body
// <!-- The limit prevent data larger than 10kb -->
app.use(express.json({ limit: '10kb' }));

// 5) Data Sanitization against NoSQL Query Injection
/* Example: By guessing the password of a user, hackers can gain access into the admin account
   with NoSQL Query Injection { "email": { "$gt": "" }, "password": "test1234" } */
app.use(mongoSanitize());

// 6) Data Sanitization again XSS - Cross Site Scripting Attacks
app.use(xss());

// 7) Prevent Parameter Pollution
app.use(
    hpp({
        whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
    })
);

// 8) Serving static files
app.use(express.static(`${__dirname}/public`));

// 9) Custom Timestamp Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toLocaleString();

    next();
});

// 10) ROUTER MOUNTS MIDDLEWARE  -->
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
