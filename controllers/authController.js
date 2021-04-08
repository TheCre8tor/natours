const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appErrors');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Signup Controller Logic -->
exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword, passwordChangedAt } = req.body;
    const newUser = await User.create({
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        passwordChangedAt: passwordChangedAt
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token: token,
        data: {
            user: newUser
        }
    });
});

// Login Controller Logic -->
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if user input email and password
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists && password is correct
    // <!-- When a model item is hidden and we need the hidden item, attach .select('+hidden-item") -->
    const user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);

    // 3) If everything is ok, send token to client
    res.status(200).json({
        status: 'success',
        token: token
    });
});

// Protected Routes Controller Logic -->
exports.protect = catchAsync(async (req, res, next) => {
    // <!-- 1) Getting token and check if it's there -->
    const { authorization } = req.headers;
    let token;

    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }

    // <!-- 2) Verification token -->
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // <!-- 3) Check if user still exists -->
    const isUserInDB = await User.findById(decoded.id);

    if (!isUserInDB) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // <!-- 4) Check if user changed password after the token was issued -->
    if (isUserInDB.changedPasswordAfter(decoded['iat'])) {
        return next(new AppError('User recently changed password! Please log in again', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE -->
    req.user = isUserInDB;
    next();
});
