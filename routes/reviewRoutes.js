const express = require('express');
const { getAllReviews, createReview } = require('./../controllers/reviewController');
const { protect, restrictTo } = require('./../controllers/authController');

// mergeParams merge the Nested Route in Tour Route with Review Route
const router = express.Router({ mergeParams: true });

router.route('/').get(protect, getAllReviews).post(protect, restrictTo('user'), createReview);

module.exports = router;
