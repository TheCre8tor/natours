const express = require('express');
const { getAllReviews, createReview, deleteReview } = require('./../controllers/reviewController');
const { protect, restrictTo } = require('./../controllers/authController');

// mergeParams merge the Nested Route in Tour Route with Review Route
const router = express.Router({ mergeParams: true });

router.route('/').get(protect, getAllReviews).post(protect, restrictTo('user'), createReview);
router.route('/:id').delete(deleteReview);

module.exports = router;
