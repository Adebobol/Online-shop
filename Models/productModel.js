const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'A description is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    stock: {
        type: Number,
        required: [true, 'quantity is required']
    },
    sold: {
        type: Number,
        default: 0
    },
    brand: {
        type: String,
        unique: true
    },
    images: [String],
    color: {
        type: String,
        enum: ['Black', 'Yellow', 'White'],
        default: "Black",
    },
    ratings: [{
        type: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
    ]
}, { timestamps: true })

productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category'
    })
    next()
})


const Product = mongoose.model('Product', productSchema)

module.exports = Product