const Review = require('./../models/reviewModel');
const AppError = require('./../utils/appErrors');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) {
        filter = { tour: req.params.tourId };
    }

    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        items: reviews.length,
        data: {
            reviews: reviews
        }
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    let { user, tour, review, rating } = req.body;

    // <!-- Allow nested routes -->
    if (!tour) tour = req.params.tourId;
    if (!user) user = req.user.id;

    const newReview = await Review.create({
        user: user,
        tour: tour,
        review: review,
        rating: rating
    });

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    });
});
