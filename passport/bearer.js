'use strict';
const BearerStrategy = require('passport-http-bearer').Strategy;
const database = {};
const User = require('../models/user');

const bearerStrategy =(new BearerStrategy(
  function (token, done) {
    User.findOne({ accessToken: token },
      function (err, users) {
        if (err) {
          return done(err);
        }
        if (!users) {
          return done(null, false);
        }
        return done(null, users, { scope: 'read' });
      }
    );
  }
));

module.exports = bearerStrategy;