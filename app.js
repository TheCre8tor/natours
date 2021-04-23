const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const csp = require('express-csp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// Enabling PugJs View Engine -->
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARE  -->

// <-- IMPLEMENT CORS -->
// This will only work for simple request --> GET & POST
// It set Access-Control-Allow-Origin *, by default
app.use(cors());
// To allow a single or specified domain -->
// Example: Backend ->api.natours.com, Frontend -> natours.com
/* Solution:
   to allow the frontend only without exposing the API to the public:
   app.use(cors({
       origin: 'https://www.natours.com'
   }));
*/

// This will only work for non-simple request --> PUT, PATCH & DELETE
// --> Or request that send cookies or use non standard headers
/* NOTE: This non-simple requests require a Pre-Flight Phase, when ever
 * there's a non-simple request the browser would then automatically issue
 * the Pre-Flight Phase.
 *
 * HOW IT WORK'S: Before the real request actually happens like a DELETE
 * request, the browser will first create an OPTION request in other to
 * figure out if the actually request is safe to send, then on our server
 * we need to actually respond to the OPTION request.
 * OPTION is really just an http method, like GET, POST...
 *
 * Basically, when we get one of this options request on our server, we
 * then need to send back Access-Control-Allow-Origin header, this way the
 * browser will then know the actual request, in this case, the DELETE
 * request is safe to perform and then execute the DELETE request. */

// Applied to all the routes -->
app.options('*', cors());

// Applied to a single/specified route -->
// app.options('/api/v1/tours/:id', cors());

// <!-- Serving static files -->
app.use(express.static(path.join(__dirname, 'public')));

// 1) Set Security HTTP Headers
app.use(helmet());
// <!-- Fix for CSP (Content-Security-Policy) -->
csp.extend(app, {
    policy: {
        directives: {
            'default-src': ['self'],
            'style-src': ['self', 'unsafe-inline', 'https:'],
            'font-src': ['self', 'https://fonts.gstatic.com'],
            'script-src': [
                'self',
                'unsafe-inline',
                'data',
                'blob',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:8828',
                'ws://localhost:56558/',
                'ws://127.0.0.1:*/',
                'http://127.0.0.1:*/'
            ],
            'worker-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                'ws://localhost:*/',
                'ws://127.0.0.1:*/',
                'http://127.0.0.1:*/'
            ],
            'frame-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                'ws://localhost:*/',
                'ws://127.0.0.1:*/',
                'http://127.0.0.1:*/'
            ],
            'img-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                'ws://localhost:*/',
                'ws://127.0.0.1:*/',
                'http://127.0.0.1:*/'
            ],
            'connect-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                // 'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                'ws://localhost:*/',
                'ws://127.0.0.1:*/',
                'http://127.0.0.1:*/'
            ]
        },
        featurePolicy: {
            'allow-list': ['*']
        }
    }
});

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
// The urlencoded middleware help encode the html form data | RENDERED WEBSITE -->
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

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

// # This will compression the response to a smaller size -->
app.use(compression());

// 8) Custom Timestamp Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toLocaleString();
    // console.log(req.cookies);
    next();
});

// 9) ROUTER MOUNTS MIDDLEWARE  -->
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

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
