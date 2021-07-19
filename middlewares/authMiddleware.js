const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Cart = require('../models/Cart')

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt
  
  if(token) {
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decodedToken) => {
      if(err) {
        console.log(err.message)
        res.redirect('/login')
      } else {
        next()
      }
    })
  } else {
    res.redirect('/login')
  }
}

const adminArea = async (req, res, next) => {
  const token = req.cookies.jwt

  if(token) {
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decodedToken) => {
      if(err) {
        console.log(err.message)
        res.redirect('/')
      } else {
        let user = await User.findById(decodedToken.id)
        if(user.role === 0) {
          next()
        } else {
          res.redirect('/')
        }
      }
    })
  } else {
    res.redirect('/')
  }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt

  if(token) {
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decodedToken) => {
      if(err) {
        console.log(err.message)
        res.locals.user = null
        next()
      } else {
        let user = await User.findById(decodedToken.id)
        let itemCount = await Cart.find({ user: user.id }).countDocuments()
        res.locals.user = user
        res.locals.itemCount = itemCount
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
}

const checkLogin = (req, res, next) => {
  const token = req.cookies.jwt

  if(token) {
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decodedToken) => {
      if(err) {
        console.log(err.message)
        next()
      } else {
        res.redirect('/')
      }
    })
  } else {
    next()
  }
}

module.exports = { requireAuth, adminArea, checkUser, checkLogin }