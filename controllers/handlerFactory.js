const AppError = require('./../utils/appErrors');
const catchAsync = require('./../utils/catchAsync');

exports.deleteOne = Model => {
    return catchAsync(async (req, res, next) => {
        const document = await Model.findByIdAndDelete(req.params.id);

        if (!document) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            message: null
        });
    });
};
