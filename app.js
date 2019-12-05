// Setup
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const morgan = require('morgan')
const path = require('path')
require('dotenv').config()

require('./config/passport')(passport)

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// express session *****
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// gloabl flash messages
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})
// const DB = require('./config/database')

mongoose.Promise = global.Promise
mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })

// Html config ****
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('tiny'))

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// Ejs config ****
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout')



// Routes *****
app.get('/', (req, res) => {
  res.render('pages/index')
})

// routes *****
const postsRoutes = require('./routes/postsRoutes')
const usersRoutes = require('./routes/usersRoutes')
app.use('/posts', postsRoutes)
app.use('/user', usersRoutes)



const PORT = process.env.PORT || 3000
// listen port 3333
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`)
})