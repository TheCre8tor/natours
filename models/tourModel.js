const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

// DATABASE SCHEMA  -->
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a price'],
            unique: true,
            trim: true,
            maxlength: [40, 'A tour name must have less or equal than 40 characters'],
            minlength: [10, 'A tour name must have more or equal than 10 characters']
            // validate: [validator.isAlpha, 'Tour name must only contains characters']
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
            trim: true,
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty should be either: easy, medium or difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be equal to or below 5.0'],
            set: val => Math.round(val * 10) / 10 // This will round 3.666666 --> 3.7
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (value) {
                    // 'this'only points to current doc on NEW document creation
                    return value < this['price'];
                },
                message: 'Discount price ({VALUE}) must be lower than the regular price'
            }
        },
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
        },
        startLocation: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        // Enabling Virtual Properties -->
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// 1. Improve Read Performance with [Single Field Index] -->
// tourSchema.index({ price: 1 });

// 2. Improve Read Performance with [Compound Field Index] -->
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// VIRTUAL PROPERTIES -->
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// Virtual Populate --> connecting reviews to tour
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

// Virtual Populate --> connecting bookings to tour
tourSchema.virtual('bookings', {
    ref: 'Booking',
    foreignField: 'tour',
    localField: '_id'
});

// 1. DOCUMENT MIDDLEWARE: --> Runs before .save() and .create() and not for update
tourSchema.pre('save', function (next) {
    this['slug'] = slugify(this.name, { lower: true });
    next();
});

// Embedding Documents
// tourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//
//     next();
// });

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

// Referencing Documents
tourSchema.pre(/^find/, function (next) {
    this.populate({ path: 'guides', select: '-__v -passwordChangedAt' });
    next();
});

// This middleware is going to run after the query as already executed
// tourSchema.post(/^find/, function (docs, next) {
//     console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//     next();
// });

// AGGREGATION MIDDLEWARE -->
// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     // console.log(this.pipeline());
//     next();
// });

// DATABASE MODEL -->
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
