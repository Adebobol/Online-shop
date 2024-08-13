const initializePayment = require('../utils/onlinePayment')
const catchAsync = require("../utils/CatchAsync")


exports.acceptTransaction = catchAsync(async (req, res, next) => {
    const { amount, name, email } = req.body

    const pay = new initializePayment(email, name, amount)
    pay.acceptPayment()

    res.status(200).json({
        status: "success",
        message: "Payment succesfully"
    })

})