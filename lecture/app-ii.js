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
//   req.requestTime = new Date().toLocaleString();
//   next();
// });
//
// // READING LOCAL FILES  -->
// const data = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8');
// const tours = JSON.parse(data);
//
// // ROUTE HANDLERS -->
// const getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     items: tours.length,
//     requestedAt: req.requestTime,
//     data: {
//       tours: tours
//     }
//   });
// };
//
// const getTour = (req, res) => {
//   const tour = tours.find(item => item.id === parseInt(req.params.id));
//
//   if (!tour) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'Invalid ID'
//     });
//   }
//
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     data: {
//       tour: tour
//     }
//   });
// };
//
// const createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);
//
//   tours.push(newTour);
//
//   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour
//       }
//     });
//   });
// };
//
// const updateTour = (req, res) => {
//   const tour = tours.find(item => item.id === parseInt(req.params.id));
//
//   if (!tour) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'Invalid ID'
//     });
//   }
//
//   tour.name = req.body.name;
//
//   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//     res.status(200).json({
//       status: 'success',
//       tour: tour
//     });
//   });
// };
//
// const deleteTour = (req, res) => {
//   const tour = tours.find(items => items.id === parseInt(req.params.id));
//
//   if (!tour) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'Tours is not found'
//     });
//   }
//
//   const idx = tours.indexOf(tour);
//   tours.splice(idx, 1);
//
//   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//     res.status(200).json({
//       status: 'success',
//       message: 'Item deleted successfully',
//       data: {
//         tour: tour
//       }
//     });
//   });
// };
//
// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   });
// };
//
// const createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   });
// };
//
// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   });
// };
//
// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   });
// };
//
// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   });
// };
//
// // ROUTES  -->
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);
// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);
//
// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on ${port}...`);
// });
