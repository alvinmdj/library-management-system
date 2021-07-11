if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')

const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')

const app = express()

app.set('view engine', 'ejs')
app.set('layout', 'layouts/base-layout')

app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.render('index'))
app.use('/', authRoutes)
app.use('/', bookRoutes)

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

