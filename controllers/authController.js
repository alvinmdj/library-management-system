const User = require('../models/User')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
  let errors = { email: '', password: '' }

  if(err.message === 'Incorrect email') {
    errors.email = 'This email is not registered'
  }
  
  if(err.message === 'Incorrect password') {
    errors.password = 'This password is incorrect'
  }

  if(err.code === 11000) {
    errors.email = 'This email is already registered.'
    return errors
  }

  if(err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }

  return errors
}

const maxAge = 7 * 24 * 60 * 60 // equal to 7 days in seconds
const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: maxAge
  })
}

exports.register_get = (req, res) => {
  res.render('auth/register')
}

exports.login_get = (req, res) => {
  res.render('auth/login')
}

exports.register_post = (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if(password !== confirmPassword) {
    return res.status(400).json({
      errors: {
        password: `Password doesn't match!`,
        confirmPassword: `Password doesn't match!`,
      }
    })
  }

  User.create({ name, email, password })
    .then(user => {
      const token = createJWT(user._id)
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
      res.status(201).json({ user: user._id })
    })
    .catch(err => {
      const errors = handleErrors(err)
      res.status(400).json({ errors })
    })
}

exports.login_post = (req, res) => {
  const { email, password } = req.body

  User.login(email, password)
    .then(user => {
      const token = createJWT(user._id)
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
      res.status(201).json({ user: user._id, role: user.role })
    })
    .catch(err => {
      const errors = handleErrors(err)
      res.status(400).json({ errors })
    })
}

exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
}