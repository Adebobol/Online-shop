const initializePayment = require('../utils/onlinePayment')
const Order = require("../Models/orderModel")
const catchAsync = require("../utils/CatchAsync")


exports.acceptTransaction = catchAsync(async (req, res, next) => {
    const user = req.user.id
    const userOrder = await Order.findOne({ user })

    const totalAmount = userOrder.totalAmount
    const email = userOrder.user.email
    const firstName = userOrder.user.firstName
    const lastName = userOrder.user.lastName

    const name = `${firstName} ${lastName}`


    const pay = new initializePayment(email, name, totalAmount)
    pay.acceptPayment()

    res.status(200).json({
        status: "success",
        message: "Payment succesfully"
    })
})