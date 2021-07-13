if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')

const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const adminRoutes = require('./routes/adminRoutes')
const { checkUser } = require('./middlewares/authMiddleware')

const app = express()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    // cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
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
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(multer({ storage, fileFilter }).single('cover_image'))
app.use(methodOverride('_method'))
app.use(cookieParser('secret'))
app.use(session({
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))
app.use(flash())

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

