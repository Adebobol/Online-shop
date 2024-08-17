const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, 'Address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        country: {
            type: String,
            required: [true, 'Country is required']
        }
    },
    orderItems: [{
        itemId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            min: 1,
            default: 1
        },
        price: Number
    }],
    paymentMethod: {
        type: String,
        enum: {
            values: ['Card', 'Bank Transfer'],
            message: 'Payment method is needed'
        },
        default: "Card"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalAmount: {
        type: Number,
    },
    orderStatus: {
        type: String,
        enum: {
            values: ['Processing', 'Shipped', 'Delivered']
        },
        default: "Processing"
    },
    deliveredAt: Date
})


orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName mobile email'
    })
    next()
})


const Order = mongoose.model('Order', orderSchema)

module.exports = Order

