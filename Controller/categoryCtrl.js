const Category = require('../Models/categoryModel')
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError")
const Product = require('../Models/productModel')

exports.createCategory = catchAsync(async (req, res, next) => {
    const newCategory = await Category.create(req.body)

    if (!newCategory) {
        return next(new AppError('No Category input', 404))
    }

    res.status(201).json({
        status: "success",
        data: newCategory
    })
})


exports.getAllCategory = catchAsync(async (req, res, next) => {
    // filtering
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    excludedFields.forEach((el) => delete queryObj[el])
    let queryStr = JSON.stringify(queryObj)

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = Category.find(JSON.parse(queryStr))

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

    const Categorys = await query
    res.status(200).json({
        status: "success",
        results: Categorys.length,
        data: {
            Categorys
        }
    })
})


exports.getCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id)
    console.log(category)
    if (!category) {
        return next(new AppError("This Category can't be found", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            category
        }
    })
})


exports.deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id)

    if (!category) {
        return next(new AppError('No Category found with id', 404))
    }
    const productUnderCategory = await Product.find({ category: category._id })
    productUnderCategory.forEach((product) => {
        product.category = undefined
        product.save()
    })
    await category.deleteOne()

    res.status(204).json({
        status: "success",
        data: null
    })
})

exports.updateCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json({
        status: "success",
        message: "Done",
        data: { category }
    })
})



