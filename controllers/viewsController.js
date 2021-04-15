const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appErrors');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();
    // 2) Build Template
    // 3) Render that template using tour data from step 1

    res.status(200).render('overview', {
        title: 'All Tours',
        tours: tours
    });
});

exports.getTour = catchAsync(async (req, res) => {
    // Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({ path: 'reviews', fields: 'review rating user' });
    console.log(tour);
    // Build template
    // Render template using data from step 1

    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour',
        tour: tour
    });
});
