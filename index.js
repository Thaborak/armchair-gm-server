'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PORT, CLIENT_ORIGIN, API_BASE_URL, GOOGLE_SECRET } = require('./config');
const { dbConnect } = require('./db-mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');
const BearerStrategy = require('passport-http-bearer').Strategy;
const rankings = require('./db/seed/2018nfl');
const AnonymousStrategy = require('passport-anonymous');

// Create an Express application
const app = express();

app.use(passport.initialize());
// app.use('/', express.static('build'));
app.use(bodyParser.json());


app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// Google OAuth Strategy

// Utilize the given `strategy`
passport.use(new GoogleStrategy({
  clientID: '19941803289-tact0somebrktc2kaeumoo7httk7scl6.apps.googleusercontent.com',
  clientSecret: GOOGLE_SECRET,
  callbackURL: `${API_BASE_URL}/auth/google/callback`
},
function (accessToken, refreshToken, profile, done) {
  User.findOne({ googleID: profile.id }, function (err, user) {
    if (!user) {
      User.create({
        googleID: profile.id,
        accessToken: accessToken,
        team: [],
        fullName: profile.displayName
      }, function (err, users) {
        return done(err, users);
      });
    } else {
      return done(err, user);
    }
  });
}));

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile']
  }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }),
  function (req, res) {
    res.cookie('accessToken', req.user.accessToken, { expires: 0 });
    res.redirect(`${CLIENT_ORIGIN}/dashboard`);
  }
);

// Bearer Strategy
passport.use(new BearerStrategy(
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

// Anonymous Strategy
passport.use(new AnonymousStrategy());


// GET: Logs user out, ends their session and redirects then to the login endpoint
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// GET: Retrieves entire user object
app.get('/user', passport.authenticate(['bearer'], { session: false }), function (req, res) {
  var googleID = req.user.googleID;
  User.findOne({ googleID: googleID }, function (err, user) {
    if (err) {
      res.json({ anonymous: true });
    } else {
      res.json(user);
    }
  });
});

// PUT: Add to userTeam (avoids duplicates)
app.put('/user/:googleID', passport.authenticate(['bearer', 'anonymous'], { session: false }),
  function (req, res) {
    User.findOneAndUpdate({ 'googleID': req.params.googleID },
      {
        $addToSet: {'team':req.body.team}      
      },
      { new: true },
      function (err, user) {
        if (err) {
          return res.send(err);
        }
        return res.json(user);
      });
  });

// PUT: Remove from userTeam
app.put('/user/team/:player', passport.authenticate(['bearer', 'anonymous'], { session: false }),
  function (req, res) {
    const playerName = parseInt(req.params.player);
    const googleID = req.body.googleID;
    User.findOneAndUpdate({ 'team.player': playerName, 'googleID': googleID },
      { $pull: { 'userTeam': { 'player': playerName } } },
      { new: true },
      function (err, user) {
        if (err) {
          return res.send(err);
        }
        return res.json(user);
      });
  });

app.get('/rankings', (req, res) => {
  res.json({ rankings });
});

// Catch-all 404
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = app;
