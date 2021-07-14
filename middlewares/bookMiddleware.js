const { body } = require('express-validator')
const Book = require('../models/Book')

const bookValidator = [
  body('isbn').custom(async (value, { req }) => {
    const isDuplicate = await Book.findOne({ isbn: value })
    if(value !== req.body.oldISBN && isDuplicate) {
        throw new Error('This ISBN is already exists')
    }
    return true
  }),
  body('publish_year', 'The minimum length is 3 and the maximum length is 4').isLength({min: 3, max: 4}),
  body('publish_year', 'This field must be a number').isNumeric()
]

module.exports = {
  bookValidator,
}