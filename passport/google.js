'use strict';
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const { GOOGLE_SECRET } = require('../config');
const database = {};
const User = require('../models/user');


const googleStrategy = new GoogleStrategy({
  clientID: '19941803289-tact0somebrktc2kaeumoo7httk7scl6.apps.googleusercontent.com',
  clientSecret: GOOGLE_SECRET,
  callbackURL: 'http://localhost:8080/api/auth/google/callback'
},
function (accessToken, refreshToken, profile, done) {
  User.findOne({ googleID: profile.id }, function (err, user) {
    if (!user) {
      User.create({
        googleID: profile.id,
        accessToken: accessToken,
        players: [],
        fullName: profile.displayName
      }, function (err, users) {
        return done(err, users);
      });
    } else {
      return done(err, user);
    }
  });
});

module.exports = googleStrategy;