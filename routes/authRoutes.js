const express = require('express')
const authController = require('../controllers/authController')

const router = express.Router()

router.get('/register', authController.register_get)

router.post('/register', authController.register_post)

router.get('/login', authController.login_get)

router.post('/login', authController.login_post)

router.get('/logout', authController.logout)

module.exports = router