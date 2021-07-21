const Book = require('../models/Book')
const User = require('../models/User')
const Cart = require('../models/Cart')
const BorrowHistory = require('../models/BorrowHistory')
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

exports.postToCart = async (req, res) => {
  const { user_id, book_id, prev_url } = req.body

  try {
    let date = new Date()
    date.setDate(date.getDate() - 1)
    const inInventory = await BorrowHistory.find({
      borrowed_by: user_id,
      borrowed_book: book_id,
      return_date: { $gte: date }
    })
    Cart.find({ user: user_id, book: book_id })
      .then(result => {
        if(inInventory.length !== 0) {
          req.flash('msg', 'That book is already in your inventory...')
          res.redirect(prev_url)
        } else if(result.length !== 0) {
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
  } catch(err) {
    console.log(err)
  }
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

exports.getBorrow = (req, res) => {
  Cart.find().populate('user').populate('book')
    .then(result => {
      res.render('customer/borrow', { cartItems: result })
    })
    .catch(err => console.log(err))
}

exports.postBorrow = async (req, res) => {
  const { user_id, borrowDate, returnDate } = req.body
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    try {
      const user = await User.findById(user_id)
      const cart = await Cart.find().populate('user').populate('book')
      console.log(cart)
      res.render('customer/borrow', {
        errors: errors.array(),
        user,
        cartItems: cart
      })
    } catch(err) {
      console.log(err)
    }
  } else {
    try {
      const cartItems = await Cart.find({ user: user_id })
      cartItems.forEach(async (item) => {
        const borrow = await BorrowHistory.create({
          borrowed_by: user_id,
          borrowed_book: item.book,
          borrow_date: new Date(borrowDate),
          return_date: new Date(returnDate)
        })
        const book = await Book.updateMany(
          { _id: item.book },
          { $inc: { stock: -1 } }
        )
        const cart = await Cart.find({ user: user_id }).deleteMany()
        req.flash('msg', "Book successfully borrowed!")
        res.redirect('/')
      })
    } catch(err) {
      console.log(err)
    }
  }
}

exports.borrowedBooks = async (req, res) => {
  try {
    let date = new Date()
    date.setDate(date.getDate() - 1)  // decrement by 1 day so the borrowed books still appear at the return date.

    // const updateStatus = await BorrowHistory.updateMany(
    //   { return_date: { $lte: date } },
    //   { $set: { status: "Returned" } }
    // )

    // const returnedBook = await BorrowHistory.find({ status: "Returned" })

    // returnedBook.forEach(async book => {
    //   // console.log(book.borrowed_book)
    //   await Book.updateMany(
    //     { _id: book.borrowed_book },
    //     { $inc: { stock: 1 } }
    //   )
    // })

    const borrowedBook = await BorrowHistory.find({ borrowed_by: req.params.id, status: "In Progress" }).populate('borrowed_book')
    res.render('customer/inventory', { borrowedBook, msg: req.flash('msg') })
  } catch(err) {
    console.log(err)
  }
}

exports.readBook = (req, res) => {
  res.send('read book')
}

exports.returnBook = async (req, res) => {
  const { user_id, book_id, history_id } = req.body

  try {
    await BorrowHistory.updateOne(
      { _id: history_id },
      { $set: { status: "Returned", book_returned: true, return_date: new Date() } }
    )

    await Book.updateMany(
      { _id: book_id },
      { $inc: { stock: 1 } }
    )

    const test = await BorrowHistory.findById(history_id)
    console.log('user', user_id)
    console.log('book', book_id)
    console.log('history', history_id)
    console.log(test)

    req.flash('msg', "You just returned a book! Thank you and happy reading!")
    res.redirect(`/inventory/${user_id}`)
    
  } catch(err) {
    console.log(err)
  }
}