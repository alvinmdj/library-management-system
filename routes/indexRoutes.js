const express = require('express')
const indexController = require('../controllers/indexController')
const { requireAuth } = require('../middlewares/authMiddleware')
const { editProfileValidator } = require('../middlewares/userMiddleware')

const router = express.Router()

router.get('/', indexController.home)

router.get('/books', indexController.allBooks)

// User Profile
router.get('/profile', requireAuth, indexController.userProfile)
router.get('/profile/edit', requireAuth, indexController.editProfile)
router.put('/profile', requireAuth, editProfileValidator, indexController.updateProfile)

// Cart
router.get('/cart', requireAuth, indexController.cart)
router.post('/cart', requireAuth, indexController.postToCart)
router.delete('/cart', requireAuth, indexController.deleteCartItem)

// Borrow
router.get('/borrow', requireAuth, indexController.getBorrow)
router.post('/borrow', requireAuth, indexController.postBorrow)
router.get('/inventory/:id', requireAuth, indexController.borrowedBooks)

module.exports = router