const express = require('express')


const router = express.Router()

const { isAuth, restrictTo } = require('../Controller/authController')
const { createOrderItems, getOrderItems, deleteOrderItem } = require('../Controller/orderCtrl')

router.use(isAuth)

router.use(restrictTo('buyer'))
router.post('/', createOrderItems)
router.get('/', getOrderItems)
router.delete('/', deleteOrderItem)

module.exports = router