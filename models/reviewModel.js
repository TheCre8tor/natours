const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user.']
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a tour.']
        },
        review: {
            type: String,
            trim: true,
            required: [true, 'Review can not be empty!']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.pre(/^find/, function (next) {
    // this.populate({ path: 'tour', select: 'name' }).populate({ path: 'user', select: 'name photo' });
    this.populate({ path: 'user', select: 'name photo' });
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
