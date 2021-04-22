const express = require('express');
const { isLoggedIn, protect } = require('./../controllers/authController');
const {
    getOverview,
    getTour,
    getLoginForm,
    getUserProfile,
    updateUserData
} = require('./../controllers/viewsController');
const { createBookingCheckout } = require('./../controllers/bookingController');
const router = express.Router();

router.get('/', createBookingCheckout, isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);

// Protected Routes -->
router.get('/profile', protect, getUserProfile);
router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
