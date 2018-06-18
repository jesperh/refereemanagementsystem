var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
var localAuth = passport.authenticate('local');

var auth = {

   login: function (req, res, next) {
      passport.authenticate('local', function (err, user, info) {
         if (err) {
            return res.status(400).json({error: err});
         }

         req.logIn(user, function (err) {
            return res.status(200).json({
               id: req.user.id,
               email: req.user.email,
               role: req.user.role,
               interested: req.user.interestedThisYear
            });
         });

      })(req, res, next);
   },

   logout: function (req, res, next) {
      req.logOut();
      return res.status(200).json({msg: "Logged out"});
   },

   identity: function (req, res, next) {
      return res.status(200).json(req.user);
   }
};

module.exports = auth;