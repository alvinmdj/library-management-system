const { body } = require('express-validator')

const bookValidator = [
  body('publish_year', 'The minimum length is 3 and the maximum length is 4').isLength({min: 3, max: 4}),
  body('publish_year', 'This field must be a number').isNumeric()
]

module.exports = {
  bookValidator,
}