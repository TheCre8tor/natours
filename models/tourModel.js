const mongoose = require('mongoose');
const slugify = require('slugify');

// DATABASE SCHEMA  -->
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a price'],
            unique: true,
            trim: true
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            trim: true
        },
        ratingsAverage: {
            type: Number,
            default: 4.5
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: Number,
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false // if false, this will hide the field in response
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        }
    },
    {
        // Enabling Virtual Properties -->
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// VIRTUAL PROPERTIES -->
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// 1. DOCUMENT MIDDLEWARE: --> Runs before .save() and .create() and not .insertMany()
tourSchema.pre('save', function (next) {
    this['slug'] = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', function (next) {
//     console.log('We can have multiple pre() middleware');
//     next();
// });

// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// });

// 2. QUERY MIDDLEWARE: --> Runs before any .find() query is executed
// This Regex finds everything that start with find /^find/
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

// This middleware is going to run after the query as already executed
tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
});

// AGGREGATION MIDDLEWARE -->
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    next();
});
// DATABASE MODEL -->
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
