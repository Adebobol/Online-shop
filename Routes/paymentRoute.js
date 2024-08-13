const express = require('express')


const router = express.Router()

const { acceptTransaction } = require('../Controller/paymentController')

router.post('/acceptPayment', acceptTransaction)



module.exports = router