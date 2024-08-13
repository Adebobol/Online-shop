const express = require("express")
const errorHandler = require('./Controller/errorController')
const productRoute = require("./Routes/productRoute")
const userRoute = require("./Routes/userRoute")
const categoryRoute = require("./Routes/categoryRoute")
const orderRoute = require("./Routes/orderRoute")
const paymentRoute = require("./Routes/paymentRoute")

const app = express()

// middlewares
app.use(express.json())


// routes
app.use('/api/product', productRoute)
app.use('/api/user', userRoute)
app.use('/api/category', categoryRoute)
app.use('/api/order', orderRoute)
app.use('/api/checkout', paymentRoute)

// catching error
app.use(errorHandler)
module.exports = app