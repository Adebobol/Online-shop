const User = require('../Models/userModel')
const catchAsync = require('../utils/CatchAsync')
const AppError = require('../utils/AppError')


const filterUpdates = (obj, ...requiredUpdates) => {
    const newUpdates = {}
    Object.keys(obj).forEach(el => {
        if (el.includes(requiredUpdates)) newUpdates[el] = obj[el]
    })

    console.log(newUpdates[el])
    return newUpdates
}

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
    const id = req.params.id
    const user = await User.findById(id)

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

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!user) {
        return next(new AppError('No user found with id', 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
})


exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
        return next(new AppError('No user found with id', 404))
    }

    res.status(200).json({
        status: "success",
        data: null
    })
})

exports.getMe = catchAsync(async (req, res, next) => {
    req.params.id = req.user.id
    console.log(req.user.id)

    next()
})

exports.deleteMe = catchAsync(async (req, res, next) => {

    // await User.findByIdAndDelete(req.user.id)
    // res.status(200).json({
    //     status: "success",
    //     data: null
    // })
    console.log('iyutr')
})

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Route not for updating password. Kindly visit the /updatePassword Route', 400))
    }

    const newUserUpdates = await User.findByIdAndUpdate(req.user.id, filterUpdates(req.body, 'name', 'photo', 'email'), {
        runValidators: true,
        new: true
    })


    res.status(200).json({
        status: "success",
        data: {
            newUserUpdates
        }
    })
})



