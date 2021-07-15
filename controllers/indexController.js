const Book = require('../models/Book')

exports.home = (req, res) => {
  Book.find().sort({ created_at: -1 }).limit(12)
    .then(books => {
      res.render('index', { books })
    })
    .catch(err => console.log(err))
}

exports.allBooks = (req, res) => {
  Book.find().sort({ title: 1 })
    .then(books => {
      res.render('customer/books', { books })
    })
    .catch(err => console.log(err))
}