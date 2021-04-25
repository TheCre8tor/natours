const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');

exports.alert = (req, res, next) => {
    const { alert } = req.query;
    if (alert === 'booking') {
        res.locals.alert =
            "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
    }

    next();
};

// GET ALL TOURS DATA AND RENDERS OVERVIEW TEMPLATE -->
exports.getOverview = catchAsync(async (req, res, next) => {
    // Get tour data from collection
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All Tours',
        tours: tours,
    });
});

// GET TOUR DATA AND ALSO RENDER IT TEMPLATE -->
exports.getTour = catchAsync(async (req, res, next) => {
    // Get the data, for the requested tour (including reviews and guides) -->
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour: tour,
    });
});

// RENDER LOGIN PAGE TEMPLATE -->
exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};

// RENDER USER ACCOUNT PAGE TEMPLATE -->
exports.getUserProfile = (req, res) => {
    res.status(200).render('account', {
        title: 'user profile',
    });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned ID
    // # Alternative for Virtual Populate -->
    const tourIDs = bookings.map((element) => element.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours: tours,
    });
});

// UPDATING DATA WITHOUT API -->
exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        },
    );

    res.status(200).render('account', {
        title: 'Your Account',
        currentUser: updatedUser,
    });
});
