const express = require('express')


const router = express.Router()

const { isAuth, restrictTo } = require('../Controller/authController')
const { acceptTransaction } = require('../Controller/paymentController')

router.use(isAuth)
router.use(restrictTo('buyer'))
router.post('/acceptPayment', acceptTransaction)



module.exports = router