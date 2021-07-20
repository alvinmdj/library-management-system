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
  },
  status: {
    type: String,
    default: 'In Progress'
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('BorrowHistory', borrowHistorySchema)