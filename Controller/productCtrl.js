const Product = require('../Models/productModel')
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError")

exports.createProduct = catchAsync(async (req, res, next) => {
    const newProduct = await Product.create(req.body)

    if (!newProduct) {
        return next(new AppError('No product input', 404))
    }

    res.status(201).json({
        status: "success",
        data: newProduct
    })

})

exports.getAllProduct = catchAsync(async (req, res, next) => {
    // filtering
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    console.log(queryObj)
    excludedFields.forEach((el) => delete queryObj[el])
    let queryStr = JSON.stringify(queryObj)

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = Product.find(JSON.parse(queryStr))

    // sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(" ")
        query = query.sort(sortBy)
    } else {
        query.sort('-createdAt')
    }

    // limiting 
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)
    } else {
        query = query.select('-__v')
    }
    // paginate 
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    const products = await query
    res.status(200).json({
        status: "success",
        results: products.length,
        data: {
            products
        }
    })

})

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new AppError("This product can't be found", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            product
        }
    })

})
exports.deleteProduct = catchAsync(async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)

    if (!deletedProduct) {
        return next(new AppError('No product found with id', 404))
    }

    res.status(204).json({
        status: "success",
        data: null
    })
})
exports.updateProduct = catchAsync(async (req, res, next) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    if (!updatedProduct) {
        return next(new AppError('No product found with id', 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            data: updatedProduct
        }
    })

})