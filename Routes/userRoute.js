const express = require('express')

const router = express.Router()

const { createUser, getAllUsers, getUser } = require("../Controller/userCtrl")

const { signUp, login, forgetPassword, isAuth } = require('../Controller/authController')


router.post('/signUp', signUp)
router.post('/login', login)
// router.post('/forgetPassword', forgetPassword)



router.use(isAuth)



router.route('/').post(createUser).get(getAllUsers)
router.route('/:id').get(getUser)


module.exports = router