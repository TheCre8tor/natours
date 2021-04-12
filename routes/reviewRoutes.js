const express = require('express');
const { getAllReviews, getReview, createReview, deleteReview, updateReview, setTourUserIds } = require('./../controllers/reviewController');
const { protect, restrictTo } = require('./../controllers/authController');

// mergeParams merge the Nested Route in Tour Route with Review Route
const router = express.Router({ mergeParams: true });

router.route('/').get(protect, getAllReviews).post(protect, restrictTo('user'), setTourUserIds, createReview);
router.route('/:id').get(getReview).patch(updateReview).delete(deleteReview);

module.exports = router;
