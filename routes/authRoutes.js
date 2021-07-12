const express = require('express')
const authController = require('../controllers/authController')
const { checkLogin } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/register', checkLogin, authController.register_get)

router.post('/register', checkLogin, authController.register_post)

router.get('/login', checkLogin, authController.login_get)

router.post('/login', checkLogin, authController.login_post)

router.get('/logout', authController.logout)

module.exports = router