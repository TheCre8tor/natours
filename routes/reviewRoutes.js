const express = require('express');
const { getAllReviews, createReview, deleteReview, updateReview, setTourUserIds } = require('./../controllers/reviewController');
const { protect, restrictTo } = require('./../controllers/authController');

// mergeParams merge the Nested Route in Tour Route with Review Route
const router = express.Router({ mergeParams: true });

router.route('/').get(protect, getAllReviews).post(protect, restrictTo('user'), setTourUserIds, createReview);
router.route('/:id').patch(updateReview).delete(deleteReview);

module.exports = router;
