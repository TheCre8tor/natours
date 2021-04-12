const express = require('express');
const tourController = require('./../controllers/tourController');
const reviewRouter = require('./../routes/reviewRoutes');
const router = express.Router();

const {
    aliasTopTours,
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyPlan
} = tourController;
const { protect, restrictTo } = require('./../controllers/authController');

router.route('/top-five-ratings').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// <!-- Nested Routes -->

// POST /tour/tour:id/reviews
// GET /tour/tour:id/reviews
// GET /tour /tour:id/reviews/review:id

// <!-- Good Solution But not best -->
// router.route('/:tourId/reviews').post(protect, restrictTo('user'), createReview);

// <!-- Best Solution -->
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
