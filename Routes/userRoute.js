const express = require('express')

const router = express.Router()

const { createUser, getAllUsers, getUser } = require("../Controller/userCtrl")

const { signUp, login, forgetPassword, updatePassword, isAuth, resetPassword } = require('../Controller/authController')


router.post('/signUp', signUp)
router.post('/login', login)
router.post('/forgetPassword', forgetPassword)
router.patch('/resetPassword/:token', resetPassword)



router.use(isAuth)


router.patch('/updatePassword', updatePassword)
router.route('/').post(createUser).get(getAllUsers)
router.route('/:id').get(getUser)


module.exports = router