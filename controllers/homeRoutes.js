const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const isAuth = require('../utils/auth');

// route for login
router.get('/login', (req, res) => {
  console.log(req.session.logged_in);
  
  if (req.session.logged_in) {
    res.redirect('/dashboard', { logged_in: req.session.logged_in });
    return;
  }

  res.render('login');
});

// route for register
router.get('/register', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard', { logged_in: req.session.logged_in });
    return;
  }

  res.render('register');
});

// router for logout
router.get('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      // res.status(204).end();
      res.redirect('/');
    });
  } else {
    res.status(404).end();
  }
});

// route to get all post
router.get('/', async (req, res) => {
  const data = await Post.findAll({
    attributes: ['id', 'title', 'description', 'date_created'],
    include: [
      {
        model: User,
        attributes: ['name'],
      },
    ],
  }).catch((err) => {
    res.json(err);
  });

  const posts = data.map((e) => e.get({ plain: true }));

  res.render('all', { posts, logged_in: req.session.logged_in });
});

// route to get all post by user
router.get('/dashboard', isAuth, async (req, res) => {
  const data = await User.findByPk(req.session.user_id, {
    attributes: ['id', 'name', 'email'],
  }).catch((err) => {
    res.json(err);
  });

  const user = data.get({ plain: true })

  const postsTmp = await Post.findAll({
    attributes: ['id', 'title', 'description', 'date_created'],
    include: [
      {
        model: User,
        attributes: ['name'],
      },
    ],
    where: {
      'user_id': req.session.user_id,
    }
  }).catch((err) => {
    res.json(err);
  });

  const posts = postsTmp.map((e) => e.get({ plain: true }));

  console.log(user);

  res.render('dashboard', { user, posts, logged_in: req.session.logged_in });
});

// route to get one Post
router.get('/post/:id', isAuth, async (req, res) => {
  const data = await User.findByPk(req.session.user_id, {
    attributes: ['id', 'name', 'email'],
  }).catch((err) => {
    res.json(err);
  });

  const user = data.get({ plain: true })

  const postTmp = await Post.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['name'],
      },
    ],
  });

  if (!postTmp) {
    res.status(404).json({ message: 'No post with this id!' });
    return;
  }
  const post = postTmp.get({ plain: true });

  const commentsTmp = await Comment.findAll({
    include: [
      {
        model: User,
        attributes: ['name'],
      },
    ],
    where: {
      'post_id': post.id,
    }
  }).catch((err) => {
    res.json(err);
  });

  const comments = commentsTmp.map((e) => e.get({ plain: true }));

  res.render('post', { user, post, comments, logged_in: req.session.logged_in });
});

module.exports = router;
