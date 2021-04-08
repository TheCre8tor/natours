const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appErrors');
const sendEmail = require('./../utils/email');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Signup Controller Logic -->
exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, role, password, confirmPassword, passwordChangedAt } = req.body;
    const newUser = await User.create({
        name: name,
        email: email,
        role: role,
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

// Authorization Controller Logic -->
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // granted roles ['admin', 'lead-guide']
        // The current user is added to the req pipeline from protect route function
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

// Forgot Password Controller Logic -->
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on Posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no user with the email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10min).',
            message: message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

// Password Reset Controller Logic -->
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    // Modify the document -->
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Persist the document to the database -->
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // We perform this step in the userModel module with the pre 'save' middleware

    // 4) Log the user in, send JWT
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token: token
    });
});
