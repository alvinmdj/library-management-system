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
  // borrow_date might not needed
  // return_date also not needed
  timestamps
  // if book removed from cart, also remove the cart
*/