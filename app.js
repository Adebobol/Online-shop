const express = require("express")
const errorHandler = require('./Controller/errorController')
const productRoute = require("./Routes/productRoute")
const userRoute = require("./Routes/userRoute")
const categoryRoute = require("./Routes/categoryRoute")
const orderRoute = require("./Routes/orderRoute")


const app = express()

// middlewares
app.use(express.json())


// routes
app.use('/api/product', productRoute)
app.use('/api/user', userRoute)
app.use('/api/category', categoryRoute)
app.use('/api/order', orderRoute)

// catching error
app.use(errorHandler)
module.exports = app