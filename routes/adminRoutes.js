const express = require('express')
const { body, validationResult, check } = require('express-validator')
const adminController = require('../controllers/adminController')

const router = express.Router()

router.get('/', adminController.admin_dashboard)

router.get('/book', adminController.books)

router.get('/book/add', adminController.add_book_view)

router.post('/book', adminController.add_book)

router.get('/book/update/:id', adminController.update_book)

router.put('/book', adminController.update_book)

router.delete('/book', adminController.delete_book)

module.exports = router