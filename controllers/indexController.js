const Book = require('../models/Book')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const path = require('path')
const fs = require('fs')

const removeImage = (filePath) => {
  filePath = path.join(__dirname, '../', filePath)
  fs.unlink(filePath, err => {
    if(err) throw err
  })
}

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
}

exports.editProfile = (req, res) => {
  res.render('customer/profile-edit')
}

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body

  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    try {
      if(req.file) removeImage(req.file.path)
      const user = await User.findById(req.body.id)
      res.render('customer/profile-edit', {
        errors: errors.array(),
        user,
      })
    } catch(err) {
      console.log(err)
    }
  } else {
    res.send('success')
    // cek lagi jika profile_pic yg lama === default_user.svg, jangan dihapus karena bakal dipake terus
  }
}

exports.cart = (req, res) => {
  res.send('this is cart')
}

exports.borrowedBooks = (req, res) => {
  res.send('this is where borrowed books appear')
}
