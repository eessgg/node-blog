const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth')

require('../model/PostModel')
const Post = mongoose.model('posts')

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    Post.find({user: req.user.id})
      .then(posts => {
        res.render('posts/index', { posts: posts })
      })
  } catch (error) {
    res.render('posts/index', error)
  }
})

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('posts/add')
})

router.post('/add', ensureAuthenticated, (req, res) => {
  let errors = []

  if (!req.body.title) {
    errors.push({ text: 'Please add a title! &#x1F9D8;' })
  }
  if (!req.body.text) {
    errors.push({ text: 'Please add a text! &#x1F9D8;' })
  }
  if (errors.length > 0) {
    res.render('posts/add', {
      errors: errors,
      title: req.body.title,
      text: req.body.text
    })
  } else {
    var newPost = {
      title: req.body.title,
      text: req.body.text,
      user: req.user.id
    }
    console.log(newPost)
    new Post(newPost)
      .save()
      .then(posts => {
        req.flash('success_msg', 'Postagem nova adicionada.')
        res.redirect('/posts')
      })
  }
})

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  Post.findById({ _id: req.params.id })
    .then(post => {
      if(post.user != req.user.id) {
        req.flash('error_msg', 'Not auth')
        res.redirect('/posts')
      } else {
        res.render('posts/edit', {
          post: post
        })
      }
 
    })
})

router.put('/:id', ensureAuthenticated, (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
    .then(post => {
      post.title = req.body.title,
        post.text = req.body.text

      post.save()
        .then(post => {
          req.flash('success_msg', 'Postagem atualizada com sucesso!')
          res.redirect('/posts')
        })
    })
})

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Post.deleteOne({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Postagem deletado com sucesso!')
      res.redirect('/posts')
    })
})


module.exports = router