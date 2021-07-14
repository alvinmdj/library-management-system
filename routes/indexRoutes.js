const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/books', (req, res) => {
  res.render('customer/books')
})

module.exports = router