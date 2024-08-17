const express = require('express')


const router = express.Router()

const { createOrderItems, getOrderItems, deleteOrderItem } = require('../Controller/orderCtrl')

router.post('/', createOrderItems)
router.get('/:id', getOrderItems)
router.delete('/', deleteOrderItem)

module.exports = router