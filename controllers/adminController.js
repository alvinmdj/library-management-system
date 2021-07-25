const Book = require('../models/Book')
const BorrowHistory = require('../models/BorrowHistory')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const path = require('path')
const fs = require('fs')

const genres = [
  'Art', 
  'Science Fiction', 
  'Fantasy',
  'Finance',
  'Biographies', 
  'Recipes', 
  'Romance', 
  'Children',
  'History',
  'Medicine',
  'Religion',
  'Mystery',
  'Music',
  'Science'
]

const removeImage = (filePath) => {
  try {
    filePath = path.join(__dirname, '../', filePath)
    fs.unlink(filePath, err => {
      if(err) throw err
    })
  } catch(err) {
    console.log(err)
    res.redirect('/admin')
  }
}

exports.admin_dashboard = (req, res) => {
  res.render('admin/index')
}

exports.books = (req, res) => {
  let currentPage = req.params.page || 1
  let perPage = req.query.perPage || 10
  let totalBook
  let query = Book.find()

  if(req.query.search) {
    // query = query.regex('title', new RegExp(req.query.search, 'i'))
    query = Book.find( { $or: [{ title: { $regex: req.query.search, $options: 'i' } }, { isbn: { $regex: req.query.search, $options: 'i' }}] } )
  }

  query
    .countDocuments()
    .then(count => {
      totalBook = count
      // return Book.find().regex('title', new RegExp(req.query.search, 'i'))
      return Book.find({ $or: [{ title: { $regex: req.query.search || '', $options: 'i' } }, { isbn: { $regex: req.query.search || '', $options: 'i' }}] })
        .skip(parseInt(currentPage - 1) * parseInt(perPage))
        .limit(parseInt(perPage))
        .sort({ title: 1 })
    })
    .then(books => {
      res.render('admin/books', {
        books,
        searchOption: req.query,
        currentPage: parseInt(currentPage),
        perPage: parseInt(perPage),
        totalBook: parseInt(totalBook),
        totalPage: Math.ceil(parseInt(totalBook) / parseInt(perPage)),
        msg: req.flash('msg')
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/admin')
    })
}

exports.add_book_view = (req, res) => {
  res.render('admin/book-add', { genres })
}

exports.add_book = (req, res) => {
  const { isbn, title, author, publish_year, page_count, genre, description, stock } = req.body
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    removeImage(req.files.cover_image[0].path)
    res.render('admin/book-add', { 
      genres,
      errors: errors.array(),
      isbn: isbn || '',
      title: title || '',
      author: author || '',
      publish_year: publish_year || '',
      page_count: page_count || '',
      description: description || '',
      stock: stock || ''
    })
  } else {
    const cover_image = req.files.cover_image[0].filename
    Book.create({ isbn, title, author, publish_year, page_count, genre, description, stock, cover_image })
      .then(result => {
        req.flash('msg', 'New book has been added!')
        res.redirect('/admin/book')
      })
      .catch(err => {
        console.log(err)
        res.redirect('/admin')
      })
  }
}

exports.detail_book = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    res.render('admin/book-detail', { book, msg: req.flash('msg') })
  } catch (err) {
    console.log(err)
    res.redirect('/admin')
  }
}

exports.update_book_view = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    res.render('admin/book-update', { book, genres })
  } catch(err) {
    console.log(err)
    res.redirect('/admin')
  }
}

exports.update_book = async (req, res) => {
  const { isbn, title, author, publish_year, page_count, genre, description, stock } = req.body
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    try {
      if(req.files.cover_image) removeImage(req.files.cover_image[0].path)
      const book = await Book.findById(req.body.id)
      res.render('admin/book-update', {
        genres,
        errors: errors.array(),
        book,
      })
    } catch(err) {
      console.log(err)
      res.redirect('/admin')
    }
  } else {
    let cover_image
    if(req.files.cover_image) {
      Book.findById(req.body.id)
        .then(book => {
          removeImage(book.coverImagePath)
        })
        .catch(err => {
          console.log(err)
          res.redirect('/admin')
        })
      cover_image = req.files.cover_image[0].filename
    } else {
      try {
        const book = await Book.findById(req.body.id)
        cover_image = book.cover_image
      } catch (err) {
        console.log(err)
        res.redirect('/admin')
      }
    }
    Book.updateOne(
      { _id: req.body.id },
      { $set: {
          isbn, title, author, publish_year, page_count, genre, description, stock, cover_image
        }
      })
      .then(result => {
        req.flash('msg', `Book has been updated!`)
        res.redirect(`/admin/book/detail/${req.body.id}`)
      })
      .catch(err => {
        console.log(err)
        res.redirect('/admin')
      })
  }
}

exports.delete_book = async (req, res) => {
  try {
    const book = await Book.findById(req.body.book_id)
    const bookTitle = book.title
    removeImage(book.coverImagePath)
    await book.remove()
    req.flash('msg', `Book '${bookTitle}' has been deleted!`)
    res.redirect(`/admin/book`)
  } catch(err) {
    console.log(err)
    res.redirect('/admin')
  }
}

exports.view_orders = async (req, res) => {
  try {
    let date = new Date()
    date.setDate(date.getDate() - 1)

    const updateStatus = await BorrowHistory.updateMany(
      { return_date: { $lte: date } },
      { $set: { status: "Returned" } }
    )

    BorrowHistory.find({ status: "Returned", book_returned: false })
      .then(returnedBook => {
        // console.log("returnedBook", returnedBook)
        returnedBook.forEach(async book => {
          // console.log("Book", book)
          await Book.updateMany(
            { _id: book.borrowed_book },
            { $inc: { stock: 1 } }
          )
        })
        return BorrowHistory.updateMany(
          { status: "Returned", book_returned: false }, 
          { $set: { book_returned: true } }
        )
      })
      .then(result => {
        return BorrowHistory.find()
          .populate({ path: 'borrowed_by', select: 'name' })
          .populate({ path: 'borrowed_book', select: 'title' })
          .sort({ created_at: -1 })
      })
      .then(borrowHistory => {
        res.render('admin/orders', { borrowHistory })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/admin')
      })
  } catch(err) {
    console.log(err)
    res.redirect('/admin')
  }
}

exports.view_users = async (req, res) => {
  try {
    const users = await User.find()
    res.render('admin/view-users', { users })
  } catch(err) {
    console.log(err)
    res.redirect('/admin')
  }
}