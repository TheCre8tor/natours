const express = require('express');

const { getOverview, getTour, getLoginForm } = require('./../controllers/viewsController');
const router = express.Router();

const { protect } = require('./../controllers/authController');

router.get('/', getOverview);
router.get('/tour/:slug', protect, getTour);

router.get('/login', getLoginForm);

module.exports = router;
