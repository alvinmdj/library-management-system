const express = require('express')

const router = express.Router()

router.get('/books', (req, res) => {
  res.send('books route')
})

module.exports = router