'use strict';

const express = require('express');

const User = require('../models/user');
const passport = require('passport');

const googleStrategy = require('../passport/google');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const { API_BASE_URL } = require('../config.js');



const router = express.Router();

/* =========== Google OAuth2.0 ============ */
router.use(cookieParser());

router.use(cookieSession({
  name: 'session',
  keys: ['123'],
}));

router.post('/auth/google',
  passport.authenticate('google', {
    scope: ['profile']
  }));

router.post('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false } ),
  function (req, res) {
    req.session.token = req.user.token;  
    res.redirect(`${API_BASE_URL}/dashboard`);
  }
);

// GET: Logs user out, ends their session and redirects then to the login endpoint
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// GET: Retrieves entire user object
router.get('/user', function (req, res) {
  req.cookie('googleID', req.user.googleID, { expires: 0 });
  const googleID = req.user.googleID;
  User.findOne({ googleID: googleID }, function (err, user) {
    res.json({user});
  });
});




module.exports = router;
