var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
var localAuth = passport.authenticate('local');

var tournament = {

   getTournaments: function(req, res, next) {

      models.Tournament.findAll()
         .then(function (tournaments) {
            return res.status(200).json(tournaments);
         })
         .catch(function(err){
            return res.status(500).json({error: err});
         });
   },

   addTournament: function(req, res, next) {
      var title = req.body.title;
      var year = req.body.year;

      if (!title || !year) {
         return res.status(400).json({error: 'Invalid parameters'});
      }

      models.Tournament.create({
         title: title,
         year: year
      }).then(function(tournament){
         return res.status(200).json("added tournament");
      })
         .catch(function (err) {
            if (err.statusCode) {
               res.status(err.statusCode);
            } else {
               res.status(500);
            }
            res.json({'error': err.message});
         });
   }
};

module.exports = tournament;