const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router();

require('../model/UserModel')
const User = mongoose.model('user')




// Login Route ****
router.get('/login', (req, res) => {
  res.render('user/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next)
})






// Register Route ****
router.get('/register', (req, res) => {
  console.log(req.body)
  res.render('user/register')
})

router.post('/register', (req, res) => {
  let errors = []

  if(req.body.password != req.body.password2) {
    errors.push({text: 'Not Match'})
  }
  if (req.body.password.length < 4) {
    errors.push({ text: 'At Least 4 chars.' })
  } 
  if(errors.length > 0){
    res.render('user/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })
  } else {
    User.findOne({email:req.body.email})
      .then(user => {
        if(user) {
          req.flash('error_msg', 'Email already registered!')
          res.redirect('/user/register')
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err
              newUser.password = hash
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Pronto, está registrado!')
                  res.redirect('/user/login')
                })
                .catch(err => {
                  console.log(err)
                  return
                })
            })
          })
        }
      })
  }
})

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out!')
  res.redirect('/user/login')
})


module.exports = router