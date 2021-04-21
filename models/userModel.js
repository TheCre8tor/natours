const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

// PASSWORD ENCRYPTION MANAGEMENT -->
userSchema.pre('save', async function (next) {
    // <!-- Only run this function, if password was actually modified -->
    if (!this.isModified('password')) {
        return next();
    }

    // <!-- Hash the password with coast of 12 -->
    this.password = await bcrypt.hash(this.password, 12);

    // <!-- We set confirmPassword to undefined because we only need it for validation -->
    this.confirmPassword = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    /* Putting the passwordChangeAt 1seconds in the past will ensure that
    the token is always created after the password has been changed */
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// QUERY MIDDLEWARE  |  This temporarily delete user -->
userSchema.pre(/^find/, function (next) {
    // This points to the current query
    this.find({ active: { $ne: false } });
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

// <!-- Create Password Reset Token -->
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this['passwordResetToken'] = crypto.createHash('sha256').update(resetToken).digest('hex');

    // console.log({ resetToken }, this['passwordResetToken']);

    // this['passwordResetExpires'] = Date.now() + min * sec * milliseconds;
    this['passwordResetExpires'] = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// <!-- Created a model using the schema -->
const User = mongoose.model('User', userSchema);

module.exports = User;
