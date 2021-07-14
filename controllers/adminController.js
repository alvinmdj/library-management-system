const Book = require('../models/Book')
const { validationResult } = require('express-validator')
const path = require('path')
const fs = require('fs')

const removeImage = (filePath) => {
  filePath = path.join(__dirname, '../', filePath)
  fs.unlink(filePath, err => {
    if(err) throw err
  })
}

exports.admin_dashboard = (req, res) => {
  res.render('admin/index')
}

exports.books = async (req, res) => {
  try {
    const books = await Book.find()
    res.render('admin/books', { books, msg: req.flash('msg') })
  } catch(err) {
    console.log(err)
  }
}

exports.add_book_view = (req, res) => {
  res.render('admin/book-add')
}

exports.add_book = (req, res) => {
  const { title, author, publish_year, page_count, description, stock } = req.body
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    removeImage(req.file.path)
    res.render('admin/book-add', { 
      errors: errors.array(),
      title: title || '',
      author: author || '',
      publish_year: publish_year || '',
      page_count: page_count || '',
      description: description || '',
      stock: stock || ''
    })
  } else {
    const cover_image = req.file.filename
    Book.create({ title, author, publish_year, page_count, description, stock, cover_image })
      .then(result => {
        req.flash('msg', 'New book has been added!')
        res.redirect('/admin/book')
      })
      .catch(err => console.log(err))
  }
}

exports.detail_book = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    res.render('admin/book-detail', { book, msg: req.flash('msg') })
  } catch (err) {
    console.log(err)
  }
}

exports.update_book_view = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    res.render('admin/book-update', { book })
  } catch(err) {
    console.log(err)
  }
}

exports.update_book = async (req, res) => {
  const { title, author, publish_year, page_count, description, stock } = req.body
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    try {
      if(req.file) removeImage(req.file.path)
      const book = await Book.findById(req.body.id)
      res.render('admin/book-update', { 
        errors: errors.array(),
        book,
      })
    } catch(err) {
      console.log(err)
    }
  } else {
    let cover_image
    if(req.file) {
      Book.findById(req.body.id)
        .then(book => {
          removeImage(book.coverImagePath)
        })
        .catch(err => console.log(err))
      cover_image = req.file.filename
    } else {
      try {
        const book = await Book.findById(req.body.id)
        cover_image = book.cover_image
      } catch (err) {
        console.log(err)
      }
    }
    Book.updateOne(
      { _id: req.body.id },
      { $set: {
          title, author, publish_year, page_count, description, stock, cover_image
        }
      })
      .then(result => {
        req.flash('msg', `Book has been updated!`)
        res.redirect(`/admin/book/detail/${req.body.id}`)
      })
      .catch(err => console.log(err))
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
  }
  // Book.deleteOne({ _id: req.body.book_id })
  //   .then(result => {
  //     removeImage(req.bo)
  //   })
  //   .catch(err => console.log(err))
}

