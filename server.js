const mongoose = require('mongoose');
const dotenv = require('dotenv');

// <!-- Global Uncaught Exception | Error Handling -->
process.on('uncaughtException', (error) => {
    console.log(`${error.name}: ${error.message.replace(' :', ',')}`);
    console.log('Uncaught Exception!, Shutting down...');
    process.exit(1);
});

dotenv.config({ path: './config.env' });
console.log(`We are currently on: ${process.env.NODE_ENV} environment`);

const app = require('./app');

// CONNECTING OUR DATABASE  -->
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB connected successfully...');
    });

// SERVER RUNNER -->
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on ${port}...`);
});

// GLOBAL UNHANDLED REJECTION - ERROR HANDLING -->
process.on('unhandledRejection', (error) => {
    console.log(`${error.name}: ${error.message.replace(' :', ',')}`);
    console.log('Unhandeled Rejection!, Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('🧐 SIGTERM RECEIVED. Shutting down gracefully!');
    server.close(() => {
        console.log('🔥 Process Terminated!');
    });
});
