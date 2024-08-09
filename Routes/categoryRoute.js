const express = require("express")

const router = express.Router()

const { createCategory, getAllCategory, getCategory, deleteCategory, updateCategory } = require("../Controller/categoryCtrl")





router.route('/').post(createCategory).get(getAllCategory)
router.route('/:id').get(getCategory).delete(deleteCategory).put(updateCategory)

module.exports = router