const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

const { aliasTopTours, getAllTours, createTour, getTour, updateTour, deleteTour, getTourStats } = tourController;

router.route('/top-five-ratings').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
