const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

// This middleware restrict a user from writing two reviews and on the same tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    // this.populate({ path: 'tour', select: 'name' }).populate({ path: 'user', select: 'name photo' });
    this.populate({ path: 'user', select: 'name photo' });
    next();
});

// Calculate Average Rating on Tour -->
// <!-- Static Methods are called on models  -->
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    // <!-- Aggregation Pipeline -->
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // <!-- We save the statistics to the current Tour -->
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
    console.log(stats);
};

// We call the function right here -->
reviewSchema.post('save', async function () {
    //  This points to current review
    await this.constructor.calcAverageRatings(this.tour);
});

// Reflect Updated & Deleted Average Ratings on Tour -->
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.newReview = await this.findOne();
    // console.log(this['newReview']);
    next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
    // this.review = await this.findOne(); does not work here, query has already been executed
    await this['newReview'].constructor.calcAverageRatings(this['newReview'].tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
