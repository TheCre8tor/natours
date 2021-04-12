const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appErrors');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

// Update Current User Data Except Password -->
exports.updateProfile = catchAsync(async (req, res, next) => {
    // 1) Create error if user POST password data
    const { password, confirmPassword } = req.body;
    if (password || confirmPassword) {
        return next(new AppError('This route is not for password updates. Please use /update-password', 400));
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// Delete User Profile -->
exports.deleteProfile = catchAsync(async (req, res, next) => {
    const { id } = req.user;
    await User.findByIdAndUpdate(id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Factory Functions -->
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User); // --> Do NOT update passwords with this!
exports.deleteUser = factory.deleteOne(User);
