const express = require('express')
const indexController = require('../controllers/indexController')
const { requireAuth } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', indexController.home)

router.get('/books', indexController.allBooks)

router.get('/profile', requireAuth, indexController.userProfile)

router.get('/cart', requireAuth, indexController.cart)

router.get('/inventory', indexController.borrowedBooks)


module.exports = router