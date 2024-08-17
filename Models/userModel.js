const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, ' first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        validate: [validator.isEmail, 'Provide a valid email']
    },
    mobile: {
        type: Number,
        required: [true, 'mobile number is required']
    },
    individual: {
        type: String,
        enum: {
            values: ['buyer', 'admin', 'seller'],
            message: "{VALUE} is not supported"
        },
        required: [true, 'individual is required']
        // default: 'buyer'
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Enter a same password to confirm.'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'Password not the same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
})

userSchema.methods.correctPassword = async function (userPassword, password) {
    return await bcrypt.compare(userPassword, password)
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    console.log(resetToken)

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    console.log({ resetToken }, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}


const User = mongoose.model('User', userSchema)

module.exports = User
