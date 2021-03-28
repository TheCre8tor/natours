const Tour = require('./../models/tourModel');

// <!-- Aliasing Middleware Function -->
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,-price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

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

        let query = Tour.find(queryJson);

        // 2. SORTING -->
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            // query = query.sort('-createdAt');
        }

        // 3. FIELD-LIMITING || PROJECTING -->
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v'); // This will exclude the __v items
            // The - excluded this __v item
        }

        // 4. PAGINATION -->
        if (req.query.page || req.query.limit) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 100;
            const skip = (page - 1) * limit;

            query = query.skip(skip).limit(limit);

            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist!');
        }

        // 5. EXECUTE QUERY -->
        const tours = await query;

        // 6. SEND RESPONSE -->
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
