var router = require('express').Router();
var models = require('../models');
var passport = require('passport');

var worker = {

   getWorkers: function (req, res, next) {
      models.Tournament.findOne({
         where: {Id: 2},

         include: [
            {
               model: models.User,
               as: 'TournamentWorkers'
            }]
      })
         .then(function (tournament) {
            return res.status(200).json(tournament.TournamentWorkers);
         }).catch(function (err) {
         return res.status(500).json({error: err});
      });

   }

};

module.exports = worker;