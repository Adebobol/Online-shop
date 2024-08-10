const express = require('express')


const router = express.Router()

const { createOrderItems, getAllOrderItems } = require('../Controller/orderCtrl')

router.post('/', createOrderItems)
router.get('/', getAllOrderItems)


module.exports = router