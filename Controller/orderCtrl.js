const Order = require('../Models/orderModel')
const catchAsync = require('../utils/CatchAsync')
const AppError = require('../utils/AppError')
const Product = require('../Models/productModel')


exports.createOrderItems = catchAsync(async (req, res, next) => {
    // get user id from IsAuth
    const user = req.user.id
    console.log(user, req.user)
    // getting all parameters from body
    const { itemId, quantity, address, city, country } = req.body
    // finding our item by Id
    const item = await Product.findById(itemId)
    // price of the item
    const price = item.price
    const orderExit = await Order.findOne({ user })
    if (orderExit) {
        const getIndexOfItem = orderExit.orderItems.findIndex(ex => ex.itemId == itemId)


        if (getIndexOfItem > -1) {
            let item
            item = orderExit.orderItems[getIndexOfItem]
            item.quantity += quantity
            orderExit.totalAmount = orderExit.orderItems.reduce((acc, curr) => { return acc + (curr.price * curr.quantity) }, 0)
            await orderExit.save()
        } else {
            orderExit.orderItems.push({ itemId, price, quantity })
            orderExit.totalAmount = orderExit.orderItems.reduce((acc, curr) => { return acc + (curr.price * curr.quantity) }, 0)
            await orderExit.save()
        }
        res.status(201).json({
            message: "success",
        })
    } else {

        const order = await Order.create({
            shippingInfo: { address, city, country },
            orderItems: [{ itemId, quantity, price }],
            totalAmount: quantity * price,
            user,
        })
        res.status(201).json({
            message: "success",
            data: {
                order
            }
        })
    }
})

exports.getOrderItems = catchAsync(async (req, res, next) => {

    const user = req.user.id
    const order = await Order.findOne({ user })

    if (!order) {
        return next(new AppError("User dosen't have orders.", 500))
    }
    res.status(200).json({
        message: "success",
        data: { order }
    })
})

exports.deleteOrderItem = catchAsync(async (req, res, next) => {
    const user = req.user.id
    const itemId = req.query.itemKey

    const orderDet = await Order.findOne({ user })
    if (orderDet) {
        const getIndexOfItem = orderDet.orderItems.findIndex(ex => ex.itemId == itemId)
        if (getIndexOfItem > -1) {
            let item
            item = orderDet.orderItems[getIndexOfItem]
            orderDet.totalAmount -= item.price * item.quantity

            if (orderDet.totalAmount < 0) {
                orderDet.totalAmount = 0
            }
            orderDet.orderItems.splice(getIndexOfItem, 1)
            orderDet.orderItems.reduce((acc, curr) => {
                console.log(acc)
                return acc + (curr.price * curr.quantity)
            }, 0)
            await orderDet.save()
            res.status(200).json({
                message: "success",
                data: {
                    orderDet
                }
            })
        } else {
            return next(new AppError('Item does not exit', 404))
        }
    } else {
        return next(new AppError('No order created yet', 404))
    }
})