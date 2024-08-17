const express = require('express')


const router = express.Router()

const { isAuth } = require('../Controller/authController')
const { createOrderItems, getOrderItems, deleteOrderItem } = require('../Controller/orderCtrl')

router.use(isAuth)

router.post('/', createOrderItems)
router.get('/:id', getOrderItems)
router.delete('/', deleteOrderItem)

module.exports = router