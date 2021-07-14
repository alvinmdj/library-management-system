const express = require('express')
const adminController = require('../controllers/adminController')
const { bookValidator } = require('../middlewares/bookMiddleware')
const { checkUser } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', adminController.admin_dashboard)

router.get('/book', adminController.books)

router.get('/book/add', adminController.add_book_view)

router.get('/book/detail/:id', adminController.detail_book)

router.post('/book', checkUser, bookValidator, adminController.add_book)

router.get('/book/update/:id', adminController.update_book_view)

router.put('/book', checkUser, bookValidator, adminController.update_book)

router.delete('/book', adminController.delete_book)

module.exports = router