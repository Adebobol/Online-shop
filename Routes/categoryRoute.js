const express = require("express")

const router = express.Router()

const { isAuth, restrictTo } = require('../Controller/authController')

const { createCategory, getAllCategory, getCategory, deleteCategory, updateCategory } = require("../Controller/categoryCtrl")

router.use(isAuth)

router.route('/').get(getAllCategory)
router.route('/:id').get(getCategory)

router.use(restrictTo('admin'))

router.delete('/', deleteCategory)
router.post('/', createCategory)

router.put('/:id', updateCategory)




module.exports = router