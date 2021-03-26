const Tour = require('./../models/tourModel');

// This is git problems
exports.getAllTours = async (req, res) => {
    try {
        // 1. BUILD QUERY  -->  Implementing Pagination and Sorting
        // <!-- 1a. Filtering -->
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(item => delete queryObj[item]);

        // <!-- 1b. Advanced Filtering -->
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        const queryJson = JSON.parse(queryStr);

        // 2. EXECUTE QUERY -->
        const tours = await Tour.find(queryJson);

        // 3. SEND RESPONSE -->
        res.status(200).json({
            status: 'success',
            items: tours.length,
            data: {
                tours: tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // Tour.findById() === Tour.findOne({ _id: req.params.id }) -->

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({})
        // newTour.save()

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            items: '',
            data: {
                tour: tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        // const tour = await Tour.findOneAndDelete({ _id: req.params.id });

        res.status(204).json({
            status: 'success',
            message: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
};
