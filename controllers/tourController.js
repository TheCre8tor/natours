const fs = require('fs');
const Tour = require('./../models/tourModel');

// READ LOCAL FILES  -->

exports.checkID = (req, res, next, value) => {
    console.log(`Tour id is: ${value}`);
    const tour = tours.find(item => item.id === parseInt(value));

    if (!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID'
        });
    }

    next();
};

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(404).json({
            status: 'failed',
            message: 'Missing name or price!'
        });
    }

    next();
};

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        items: tours.length,
        requestedAt: req.requestTime,
        data: {
            tours: tours
        }
    });
};

exports.getTour = (req, res) => {
    const tour = tours.find(item => item.id === parseInt(req.params.id));

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
            tour: tour
        }
    });
};

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
};

exports.updateTour = (req, res) => {
    const tour = tours.find(item => item.id === parseInt(req.params.id));

    tour.name = req.body.name;

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: 'success',
            tour: tour
        });
    });
};

exports.deleteTour = (req, res) => {
    const tour = tours.find(items => items.id === parseInt(req.params.id));

    const idx = tours.indexOf(tour);
    tours.splice(idx, 1);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: 'success',
            message: 'Item deleted successfully',
            data: {
                tour: tour
            }
        });
    });
};
