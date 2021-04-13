const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser, getProfile, updateProfile, deleteProfile } = require('./../controllers/userController');
const { signup, login, protect, forgotPassword, resetPassword, updatePassword, restrictTo } = require('./../controllers/authController');

const router = express.Router();

// Public Routes -->
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Authenticated Routes -->
router.use(protect); // This middleware protect all the routes below it generally

router.patch('/update-password', updatePassword);
router.get('/profile', getProfile, getUser);
router.patch('/update-profile', updateProfile);
router.delete('/delete-profile', deleteProfile);

/* This middleware protect all the routes
 * below it from everyone except admin --> */
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
