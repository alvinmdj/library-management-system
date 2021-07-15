const express = require('express')
const indexController = require('../controllers/indexController')

const router = express.Router()

router.get('/', indexController.home)

router.get('/books', indexController.allBooks)

router.get('/inventory', indexController.borrowedBooks)

router.get('/profile', indexController.userProfile)

module.exports = router