const express = require('express');
const { isLoggedIn, protect } = require('../controllers/authController');
const {
    getOverview,
    getTour,
    getLoginForm,
    getUserProfile,
    updateUserData,
    getMyTours,
    alert,
} = require('../controllers/viewsController');

const router = express.Router();

router.use(alert);

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/my-tours', protect, getMyTours);

// Protected Routes -->
router.get('/profile', protect, getUserProfile);
router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
