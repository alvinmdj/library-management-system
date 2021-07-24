const { body } = require('express-validator')
const User = require('../models/User')

const editProfileValidator = [
  body('email').custom(async (value, { req }) => {
    const isDuplicate = await User.findOne({ email: value })
    if(value !== req.body.oldEmail && isDuplicate) {
        throw new Error('This email is already registered')
    }
    return true
  })
]

const borrowValidator = [
  body('returnDate').custom((value, { req }) => {
    const { borrowDate } = req.body
    // console.log((new Date(value) - new Date(borrowDate)) / (3600000 * 24)) // return different in days
    const dateDifference = (new Date(value) - new Date(borrowDate)) / (3600000 * 24)
    // console.log(dateDifference)
    if(dateDifference < 1) {
        throw new Error('Return date must be higher than borrow date.')
    }
    if(dateDifference > 30) {
      throw new Error("Return date cannot exceeds more than 30 days after borrow date.")
    }
    return true
  })
]

const genreList = (req, res, next) => {
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
  res.locals.genres = genres
  next()
}

module.exports = {
  editProfileValidator,
  borrowValidator,
  genreList
}