const Review = require('./../models/reviewModel');
const AppError = require('./../utils/appErrors');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        items: reviews.length,
        data: {
            reviews: reviews
        }
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    const { user, tour, review, rating } = req.body;

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
