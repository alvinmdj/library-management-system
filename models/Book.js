const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'public/images'

const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
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
  },
  genre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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

bookSchema.virtual('coverImagePath').get(function() {
  if (this.cover_image !== null) {
    return path.join('/', coverImageBasePath, this.cover_image)
  }
})

module.exports = mongoose.model('book', bookSchema)