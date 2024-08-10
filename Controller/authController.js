const catchAsync = require('../utils/CatchAsync')
const AppError = require('../utils/AppError')
const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')

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
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new AppError('No user with this email', 404))
    }

    const resetToken = user.createPasswordResetToken()
    console.log(resetToken)
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