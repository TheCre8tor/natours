const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();

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

exports.updateTour = (req, res) => {
    // const tour = tours.find(item => item.id === parseInt(req.params.id));
    //
    // tour.name = req.body.name;
    //
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    //     res.status(200).json({
    //         status: 'success',
    //         tour: tour
    //     });
    // });
};

exports.deleteTour = (req, res) => {
    // const tour = tours.find(items => items.id === parseInt(req.params.id));
    //
    // const idx = tours.indexOf(tour);
    // tours.splice(idx, 1);
    //
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    //     res.status(200).json({
    //         status: 'success',
    //         message: 'Item deleted successfully',
    //         data: {
    //             tour: tour
    //         }
    //     });
    // });
};
