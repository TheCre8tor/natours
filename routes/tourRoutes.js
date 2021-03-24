const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

const { checkBody, getAllTours, createTour, getTour, updateTour, deleteTour } = tourController;

router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
