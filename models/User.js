const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'This field is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'This field is required'],
    validate: [isEmail, 'This field must be a valid email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [6, 'The minimum password length is 6 characters'],
    trim: true,
  },
  role: {
    type: Number,
    default: 1  // customer
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })
  if(user) {
    const auth = await bcrypt.compare(password, user.password)
    if(auth) {
      return user
    }
    throw Error('Incorrect password')
  }
  throw Error('Incorrect email')
}

module.exports = mongoose.model('user', userSchema)