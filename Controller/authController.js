const catchAsync = require('../utils/CatchAsync')
const AppError = require('../utils/AppError')
const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const sendEmail = require("../utils/sendmail")
const crypto = require('crypto')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

const sendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

    res.cookie('jwt', token, cookieOptions)

    user.password = undefined
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    })

}


exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        individual: req.body.individual
    })

    // const url = `${req.protocol}://${req.get('host')}/me`
    // console.log(url)
    // new Email(newUser, url).sendWelcome()
    // const id = newUser._id
    // const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    // token = signToken(id)

    // newUser.password = undefined

    // res.status(201).json({
    //     status: "success",
    //     token,
    //     data: {
    //         newUser
    //     }
    // })
    sendToken(newUser, 201, res)

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

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    token = signToken(user._id)

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




    try {
        await sendEmail({
            email: user.email,
            subject: "Naught Diares 1",
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

exports.restrictTo = (...individuals) => {
    return (req, res, next) => {
        if (!individuals.includes(req.user.individual)) {
            return next(new AppError("You don't have access to perform this actiom", 403))
        }
        next()
    }
}

exports.isAuth = catchAsync(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please do', 401))
    }

    const testing = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    console.log("testing:", testing)

    const loggedInUser = await User.findById(testing.id)

    if (!loggedInUser) {
        return next(new AppError("User doesn't exist", 401))
    }

    req.user = loggedInUser
    next()
})


exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })

    // 2) If token has expired, and there is no user, set the new password

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400))
    }

    user.password = req.body.password

    user.passwordConfirm = req.body.passwordConfirm

    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')
    console.log(user)

    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is wrong', 401))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    token = signToken({ id: user._id })


    await user.save();
    res.status(200).json({
        status: "success",
        token,
        data: {
            user
        }
    })

})