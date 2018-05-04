'use strict';

const express = require('express');

const User = require('../models/user');
const passport = require('passport');

const router = express.Router();



/* =========== Google OAuth2.0 ============ */
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile']
  }));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }),
  function (req, res) {
    res.cookie('accessToken', req.user.accessToken, { expires: 0 });
    res.redirect('http://localhost:3000/dashboard');
  }
);

// Anonymous Strategy
// passport.use(new AnonymousStrategy());


// GET: Logs user out, ends their session and redirects then to the login endpoint
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// GET: Retrieves entire user object
router.get('/user', passport.authenticate(['bearer'], { session: false }), function (req, res) {
  const googleID = req.user.googleID;
  User.findOne({ googleID: googleID }, function (err, user) {
    if (err) {
      res.json({ anonymous: true });
    } else {
      res.json(user);
    }
  });
});


module.exports = router;
