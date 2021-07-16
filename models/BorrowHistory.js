const mongoose = require('mongoose')

const borrowHistorySchema = new mongoose.Schema({
  borrowed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  borrowed_book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'book'
  },
  borrow_date: {
    type: Date,
    required: true
  },
  return_date: {
    type: Date,
    required: true
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('BorrowHistory', borrowHistorySchema)

/*
  user_id
  book_id
  borrow_date
  return_date // depends of cart return date or when user returned earlier
  timestamps
*/