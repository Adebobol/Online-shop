const express = require('express')

const router = express.Router()

const { createUser, getAllUsers, getUser, getMe, updateMe, deleteMe } = require("../Controller/userCtrl")

const { signUp, login, forgetPassword, updatePassword, isAuth, resetPassword, restrictTo } = require('../Controller/authController')


router.post('/signUp', signUp)
router.post('/login', login)
router.post('/forgetPassword', forgetPassword)
router.patch('/resetPassword/:token', resetPassword)




router.use(isAuth)

router.patch('/updatePassword', updatePassword)
router.get('/me', getMe, getUser)
router.delete('/deleteMe', deleteMe)
router.patch('/updateMe', updateMe)


router.use(restrictTo('admin'))



router.route('/').post(createUser).get(getAllUsers)
router.route('/:id').get(getUser)


module.exports = router