const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
        trim: true,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        trim: true,
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (element) {
                return element === this.password;
            },
            message: 'Password are not the same!'
        }
    },
    passwordChangedAt: Date
});

// PASSWORD ENCRYPTION MANAGEMENT -->
userSchema.pre('save', async function (next) {
    // <!-- Only run this function if password was actually modified -->
    if (!this.isModified('password')) {
        return next();
    }

    // <!-- Hash the password with coast of 12 -->
    this.password = await bcrypt.hash(this.password, 12);

    // <!-- We set confirmPassword to undefined because we only need it for validation -->
    this.confirmPassword = undefined;
    next();
});

// <!-- Password Comparison -->
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// <!-- This logic check if password was changed -->
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this['passwordChangedAt']) {
        // Convert getTime to seconds.
        const changedTimestamp = this['passwordChangedAt'].getTime() / 1000;
        // If JWTTimestamp is less than changedTimestamp, it means that password was changed
        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

// <!-- Created a model using the schema -->
const User = mongoose.model('User', userSchema);

module.exports = User;
