const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'book'
  },
  borrow_date: {
    required: Date,
    required: tru
  },
  return_date: {
    required: Date,
    required: tru
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('Cart', cartSchema)

/*
  // CART CONTROLLER USE REQUIREAUTH MIDDLEWARE
  user_id
  book_id
  borrow_date
  return_date
  timestamps
  // if book removed from cart, also remove the cart
*/