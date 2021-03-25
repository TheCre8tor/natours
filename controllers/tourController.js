const Tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        // items: tours.length,
        requestedAt: req.requestTime
        // data: {
        //     tours: tours
        // }
    });
};

exports.getTour = (req, res) => {
    // const tour = tours.find(item => item.id === parseInt(req.params.id));
    //
    // res.status(200).json({
    //     status: 'success',
    //     requestedAt: req.requestTime,
    //     data: {
    //         tour: tour
    //     }
    // });
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
