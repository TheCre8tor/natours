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
    getMonthlyPlan,
    getToursWithin,
    getDistances,
    uploadTourImages,
    resizeTourImages
} = tourController;
const { protect, restrictTo } = require('./../controllers/authController');

router.route('/top-five-ratings').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

// Location Route -->
router.route('/distances/:latlng/unit/:unit').get(getDistances);
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);
// Using Params -->/tours-within/233/center/-40,45/unit/mi
// Using Query Strings --> /tours-within?distance=233&center=-40,45&unit=mi

router.route('/').get(getAllTours).post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
    .route('/:id')
    .get(getTour)
    .patch(protect, restrictTo('admin', 'lead-guide'), uploadTourImages, resizeTourImages, updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
// <!-- Nested Routes -->

// POST /tour/tour:id/reviews
// GET /tour/tour:id/reviews
// GET /tour /tour:id/reviews/review:id

// <!-- Good Solution But not best -->
// router.route('/:tourId/reviews').post(protect, restrictTo('user'), createReview);

// <!-- Best Solution -->
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
