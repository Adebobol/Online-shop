const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
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
    orderItems: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
        }
    ],
    paymentMethod: {
        type: String,
        enum: {
            values: ['Card', 'Bank Transfer'],
            message: 'Payment method is needed'
        },
        default: "Card"
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    paidAt: Date,
    paymentInfo: {
        type: String
    },
    // itemPrice: {
    //     type: Number,
    //     // required: true
    // },
    // tax: {
    //     type: Number,
    //     required: true
    // },
    // shippingCharges: {
    //     type: Number,
    //     required: true
    // },
    totalAmount: {
        type: Number,
        // required: true
    },
    orderStatus: {
        type: String,
        enum: {
            values: ['Processing', 'Shipped', 'Delivered']
        }
    },
    deliveredAt: Date
})

orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'orderItems',
        select: 'name price quantity images'
    })
    next()
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

