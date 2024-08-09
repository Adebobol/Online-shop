const User = require('../Models/userModel')
const catchAsync = require('../utils/CatchAsync')
const AppError = require('../utils/AppError')

exports.createUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body)

    if (!newUser) {
        return next(new AppError('This requires an input.', 404))
    }

    res.status(201).json({
        message: "success",
        data: {
            data: newUser
        }
    })
})

exports.getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById({ id })

    if (!user) {
        return next(new AppError(`No user is found with this ${req.params.id}`, 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })

})

exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await User.find()
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users
        }
    })


})

exports.updateUser = catchAsync(async (req, res, next) => { })


exports.deleteUser = catchAsync(async (req, res, next) => { })