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
            name: { type: String, required: [true, 'Product name is required'] },
            price: {
                type: Number,
                required: [true, 'Product price is required']
            },
            quantity: {
                type: Number,
                required: [true, 'Product quantity is required']
            },
            image: {
                type: String,
                required: [true, 'Product image is required']
            },
            product: {
                type: mongoose.Schema.Types.objectId,
                ref: 'Products',
                required: true
            }
        }
    ],
    paymentMethod: {
        type: String,
        enum: {
            values: ['Card', 'Bank Transfer'],
            message: 'Payment method is needed'
        }
    },
    user: {
        type: mongoose.Schema.Types.objectId,
        ref: 'Users',
        required: true
    },
    paidAt: Date,
    paymentInfo: {
        type: String
    },
    itemPrice: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    shippingCharges: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: {
            values: ['Processing', 'Shipped', 'Delivered']
        }
    },
    deliveredAt: Date
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order

