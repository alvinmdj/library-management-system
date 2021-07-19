const Book = require('../models/Book')
const User = require('../models/User')
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
  res.render('customer/cart')
}

exports.postToCart = (req, res) => {
  res.send('posted to cart')
}

exports.borrowedBooks = (req, res) => {
  res.render('customer/inventory')
}
