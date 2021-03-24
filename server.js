const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
        useUnifiedTopology: true
    })
    .then(connection_datas => {
        console.log('DB connected successfully...');
    });

// SERVER RUNNER -->
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on ${port}...`);
});
