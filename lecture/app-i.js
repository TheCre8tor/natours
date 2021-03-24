// const fs = require('fs');
// const express = require('express');
// const morgan = require('morgan');
//
// const app = express();
//
// // MIDDLEWARE  -->
// app.use(morgan('dev'));
// app.use(express.json());
//
// app.use((req, res, next) => {
//     req.requestTime = new Date().toLocaleString();
//     next();
// });
//
// // READING LOCAL FILES  -->
// const data = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8');
// const tours = JSON.parse(data);
//
// // CRUD ROUTES  -->
// app.get('/api/v1/tours', (req, res) => {
//     res.status(200).json({
//         status: 'success',
//         items: tours.length,
//         requestedAt: req.requestTime,
//         data: {
//             tours: tours
//         }
//     });
// });
//
// app.get('/api/v1/tours/:id', (req, res) => {
//     const tour = tours.find(item => item.id === parseInt(req.params.id));
//
//     if (!tour) {
//         return res.status(404).json({
//             status: 'failed',
//             message: 'Invalid ID'
//         });
//     }
//
//     res.status(200).json({
//         status: 'success',
//         requestedAt: req.requestTime,
//         data: {
//             tour: tour
//         }
//     });
// });
//
// app.post('/api/v1/tours', (req, res) => {
//     const newId = tours[tours.length - 1].id + 1;
//     const newTour = Object.assign({ id: newId }, req.body);
//
//     tours.push(newTour);
//
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         });
//     });
// });
//
// app.patch('/api/v1/tours/:id', (req, res) => {
//     const tour = tours.find(item => item.id === parseInt(req.params.id));
//
//     if (!tour) {
//         return res.status(404).json({
//             status: 'failed',
//             message: 'Invalid ID'
//         });
//     }
//
//     tour.name = req.body.name;
//
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(200).json({
//             status: 'success',
//             tour: tour
//         });
//     });
// });
//
// app.delete('/api/v1/tours/:id', (req, res) => {
//     const tour = tours.find(items => items.id === parseInt(req.params.id));
//
//     if (!tour) {
//         return res.status(404).json({
//             status: 'failed',
//             message: 'Tours is not found'
//         });
//     }
//
//     const idx = tours.indexOf(tour);
//     tours.splice(idx, 1);
//
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(200).json({
//             status: 'success',
//             message: 'Item deleted successfully',
//             data: {
//                 tour: tour
//             }
//         });
//     });
// });
//
// const port = 3000;
// app.listen(port, () => {
//     console.log(`App running on ${port}...`);
// });
