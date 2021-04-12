const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
    let { user, tour } = req.body;

    // <!-- Allow nested routes -->
    if (!tour) req.body.tour = req.params.tourId;
    if (!user) req.body.user = req.user.id;

    next();
};

// Factory Functions -->
exports.createReview = factory.createOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
