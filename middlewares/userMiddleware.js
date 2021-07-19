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

// Create a date validator so return date must be bigger than borrow date

module.exports = {
  editProfileValidator
}