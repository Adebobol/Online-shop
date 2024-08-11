const catchAsync = require('../utils/CatchAsync')
const AppError = require('../utils/AppError')
const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const sendEmail = require("../utils/sendmail")

// const signToken = id => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
// }

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })

    const id = newUser._id
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

    newUser.password = undefined

    res.status(201).json({
        status: "success",
        token,
        data: {
            newUser
        }
    })

})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Please provide email or password', 401))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

    res.status(200).json({
        status: "success",
        token
    })
})




exports.forgetPassword = catchAsync(async (req, res, next) => {
    // console.log("Working")
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new AppError('No user with this email', 404))
    }

    const resetToken = user.createPasswordResetToken()
    console.log(resetToken)

    await user.save({ validateBeforeSave: false })

    const resetURL = `${req.protocol}://${req.get('host')}/api/user/resetPassword/${resetToken}`

    const message = `Forget your password? Submit a PATCH request with your new password and passwordConfirm to: 
    ${resetURL}.\n If you didn't forget your passwword, please ignore this email`
    // const message = `Missing your man? Send a video request with your top off to "08081237...".\n If you don't miss your man, please ignore this email`

    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset token",
            message
        })

        res.status(200).json({
            status: "success",
            message: "Check your emaiL for reset token"
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined

        await user.save({ validateBeforeSave: false })

        return next(new AppError('There was an error sending the email. Try again later', 500))
    }
})



exports.isAuth = catchAsync(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please do', 401))
    }

    const testing = jwt.verify(token, process.env.JWT_SECRET)

    // console.log(testing)

    const loggedInUser = await User.findById(testing.id)
    console.log(loggedInUser)

    if (!loggedInUser) {
        return next(new AppError("User doesn't exist", 401))
    }

    next()

})


exports.resetPassword = catchAsync(async (req, res, next) => { })

exports.updatePassword = catchAsync(async (req, res, next) => { })