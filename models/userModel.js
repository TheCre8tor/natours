const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
        trim: true
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        trim: true
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        trim: true,
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (element) {
                return element === this.password;
            }
        }
    }
});

// <!-- Created a model using the schema -->
const User = mongoose.model('User', userSchema);

module.exports = User;
