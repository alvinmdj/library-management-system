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

exports.userProfile = (req, res) => {
  res.render('customer/profile')
  // res.send('SOON! this is where user profile appear (user can edit their own profile!)')
}

exports.borrowedBooks = (req, res) => {
  res.send('this is where borrowed books appear')
}
