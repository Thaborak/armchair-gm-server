'use strict';

const express = require('express');

const User = require('../models/user');
const passport = require('passport');
const rankings = require('../db/seed/2018nfl');
const router = express.Router();



// GET: fetch userTeam
router.get('/user/:googleID', passport.authenticate(['bearer', 'anonymous'], { session: false }),
  function (req, res) {
    User.findOneAndUpdate({ 'googleID': req.params.googleID },
      { $addToSet: { 'team': req.body.team } },
      { new: true },
      function (err, user) {
        if (err) {
          return res.send(err);
        }
        return res.json(user);
      });
  });


// PUT: Add to userTeam (avoids duplicates)
router.put('/user/:googleID', passport.authenticate(['bearer', 'anonymous'], { session: false }),
  function (req, res) {
    User.findOneAndUpdate({ 'googleID': req.params.googleID },
      { $addToSet: { 'team': req.body.team } },
      { new: true },
      function (err, user) {
        if (err) {
          return res.send(err);
        }
        return res.json(user);
      });
  });

// PUT: Remove from userTeam
router.put('/user/team/:player', passport.authenticate(['bearer', 'anonymous'], { session: false }),
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

router.get('/rankings', (res) => {
  res.json({rankings});
});

module.exports = router;