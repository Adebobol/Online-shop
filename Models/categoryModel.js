const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: [true, 'A category is required']
    }
})



const Category = mongoose.model('Category', categorySchema)

module.exports = Category