const express = require('express');
const { getAllReviews, getReview, createReview, deleteReview, updateReview, setTourUserIds } = require('./../controllers/reviewController');
const { protect, restrictTo } = require('./../controllers/authController');

// mergeParams merge the Nested Route in Tour Route with Review Route
const router = express.Router({ mergeParams: true });

router.use(protect); // This middleware protect all the routes below it generally

router.route('/').get(getAllReviews).post(restrictTo('user'), setTourUserIds, createReview);
router.route('/:id').get(getReview).patch(restrictTo('user', 'admin'), updateReview).delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
