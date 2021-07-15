const Book = require('../models/Book')

exports.home = (req, res) => {
  Book.find().sort({ createdAt: 'desc'}).limit(12)
    .then(books => {
      res.render('index', { books })
    })
    .catch(err => console.log(err))
}

exports.allBooks = (req, res) => {
  res.render('customer/books')
}