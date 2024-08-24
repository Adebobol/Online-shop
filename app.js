const express = require("express")
const path = require('path')
const errorHandler = require('./Controller/errorController')
const productRoute = require("./Routes/productRoute")
const userRoute = require("./Routes/userRoute")
const categoryRoute = require("./Routes/categoryRoute")
const orderRoute = require("./Routes/orderRoute")
const paymentRoute = require("./Routes/paymentRoute")
// const handlebars = require('handlebars')
const hbs = require('hbs')


const app = express()
app.use(express.static('public'))
// middlewares
app.use(express.json())
// handlebars settings
app.set('view engine', 'hbs')

app.set('views', path.join(__dirname, 'views'))

// app.engine('handlebars', handlebars({
//     layoutsDir: __dirname + '/views/layouts',
//     extname: 'hbs',
//     defaultLayout: 'planB'
// }));
// 

// routes
app.get('/', (req, res) => {
    res.render('welcome')
})
app.use('/api/product', productRoute)
app.use('/api/user', userRoute)
app.use('/api/category', categoryRoute)
app.use('/api/order', orderRoute)
app.use('/api/checkout', paymentRoute)

// catching error
app.use(errorHandler)
module.exports = app