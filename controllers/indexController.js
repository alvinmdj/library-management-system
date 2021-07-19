const Book = require('../models/Book')
const User = require('../models/User')
const Cart = require('../models/Cart')
const { validationResult } = require('express-validator')
const path = require('path')
const fs = require('fs')

const removeImage = (filePath) => {
  try {
    filePath = path.join(__dirname, '../', filePath)
    fs.unlink(filePath, err => {
      if(err) throw err
    })
  } catch(err) {
    res.redirect('/profile')
    console.log(err)
  }
}

exports.home = (req, res) => {
  Book.find().sort({ created_at: -1 }).limit(12)
    .then(books => {
      res.render('index', { books, msg: req.flash('msg') })
    })
    .catch(err => console.log(err))
}

exports.allBooks = (req, res) => {
  Book.find().sort({ title: 1 })
    .then(books => {
      res.render('customer/books', { books, msg: req.flash('msg') })
    })
    .catch(err => console.log(err))
}

exports.userProfile = (req, res) => {
  res.render('customer/profile', { msg: req.flash('msg') })
}

exports.editProfile = (req, res) => {
  res.render('customer/profile-edit')
}

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body

  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    try {
      if(req.files.profile_picture) removeImage(req.files.profile_picture[0].path)
      const user = await User.findById(req.body.id)
      res.render('customer/profile-edit', {
        errors: errors.array(),
        user,
      })
    } catch(err) {
      console.log(err)
    }
  } else {
    let profile_picture
    if(req.files.profile_picture) {
      User.findById(req.body.id)
        .then(user => {
          if(user.profile_picture !== 'default_user.svg') {
            removeImage(user.profilePicturePath)
          }
        })
        .catch(err => console.log(err))
      profile_picture = req.files.profile_picture[0].filename
    } else {
      try {
        const user = await User.findById(req.body.id)
        profile_picture = user.profile_picture
      } catch (err) {
        console.log(err)
      }
    }
    User.updateOne(
      { _id: req.body.id },
      { $set: { name, email, profile_picture } }
    )
      .then(result => {
        req.flash('msg', `Profile has been updated!`)
        res.redirect(`/profile`)
      })
      .catch(err => console.log(err))
  }
}

exports.cart = (req, res) => {
  Cart.find().populate('user').populate('book')
    .then(result => {
      res.render('customer/cart', { cartItems: result, msg: req.flash('msg') })
    })
    .catch(err => console.log(err))
}

exports.postToCart = (req, res) => {
  const { user_id, book_id, prev_url } = req.body
  Cart.find({ book: book_id })
    .then(result => {
      if(result.length !== 0) {
        req.flash('msg', 'That book is already in your cart...')
        res.redirect(prev_url)
      } else {
        Cart.create({ user: user_id, book: book_id })
        .then(result => {
          req.flash('msg', 'Book has been added to your cart!'),
          res.redirect(prev_url)
        })
        .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
}

exports.deleteCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.body.item_id).populate({ path: 'book', select: 'title' })
    const bookTitle = cartItem.book.title
    await cartItem.remove()
    req.flash('msg', `Book '${bookTitle}' has been removed from your cart!`)
    res.redirect('/cart')
  } catch(err) {
    console.log(err)
  }
}

exports.borrowedBooks = (req, res) => {
  res.render('customer/inventory')
}
