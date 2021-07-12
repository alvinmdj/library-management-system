const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publish_year: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 4
  },
  page_count: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
  },
  cover_image: {
    type: String,
    required: true,
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('book', bookSchema)