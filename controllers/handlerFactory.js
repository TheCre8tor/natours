const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appErrors');
const catchAsync = require('./../utils/catchAsync');

exports.createOne = Model => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });
};

exports.getAll = Model => {
    return catchAsync(async (req, res, next) => {
        // To allow for nested GET reviews on tour (HACK)
        let filter = {};
        if (req.params.tourId) {
            filter = { tour: req.params.tourId };
        }

        const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().pagination();
        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            items: doc.length,
            data: {
                tours: doc
            }
        });
    });
};

exports.getOne = (Model, populateOption) => {
    return catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (populateOption) query = query.populate(populateOption);
        const doc = await query;

        // const doc = await Model.findById(req.params.id).populate('reviews');
        // Tour.findById() === Tour.findOne({ _id: req.params.id }) -->

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });
};

exports.updateOne = Model => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            items: '',
            data: {
                data: doc
            }
        });
    });
};

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
