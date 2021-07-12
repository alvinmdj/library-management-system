if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const methodOverride = require('method-override')

const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const adminRoutes = require('./routes/adminRoutes')
const { checkUser } = require('./middlewares/authMiddleware')

const app = express()

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.set('view engine', 'ejs')
app.set('layout', 'layouts/base-layout')

app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(multer({ storage: fileStorage, fileFilter }).single('image'))
app.use(methodOverride('_method'))

app.get('*', checkUser)
app.get('/', (req, res) => res.render('index'))
app.use('/', authRoutes)
app.use('/book', bookRoutes)
app.use('/admin', adminRoutes)

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Alvin's Library | Listening at http://localhost:${process.env.PORT}`)
    })
  })
  .catch((err) => console.log(err))

