const express = require("express")

const router = express.Router()

const { createProduct, getAllProduct, getProduct, deleteProduct, updateProduct } = require("../Controller/productCtrl")





router.route('/').post(createProduct).get(getAllProduct)
router.route('/:id').get(getProduct).delete(deleteProduct).patch(updateProduct)

module.exports = router