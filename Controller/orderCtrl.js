const Order = require('../Models/orderModel')
const catchAsync = require('../utils/CatchAsync')
const AppError = require('../utils/AppError')

const sumTotal = function (price, quantity, tax, shippingCharges) {
    initialTotal = price * quantity
    finalTotal = initialTotal + tax + shippingCharges

    return finalTotal
}



exports.createOrderItems = catchAsync(async (req, res, next) => {
    const order = await Order.create(req.body)

    res.status(201).json({
        status: "success",
        data: order
    })
})

exports.getAllOrderItems = catchAsync(async (req, res, next) => {
    const order = await Order.find()

    res.status(200).json({
        status: "success",
        data: order
    })
})