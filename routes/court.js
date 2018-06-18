var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
var localAuth = passport.authenticate('local');

var court = {
   getCourts: function (req, res, next) {
      models.Court.findAll({
         include: [
            {
               model: models.Referee,
               include: [{
                  model: models.Worker,
                  include: [{
                     model: models.User
                  }]
               }]
            }]
      })
         .then(function (courts) {
            return res.status(200).json(courts);
         })
         .catch(function (err) {
            return res.status(500).json({error: err});
         });
   },

   addCourt: function (req, res, next) {
      var number = req.body.number;
      var startTime = req.body.startTime;
      var endTime = req.body.endTime;

      if (!number || !startTime || !endTime) {
         return res.status(400).json({error: 'Invalid parameters'});
      }

      //in the UI only time is given, but the parameter is datetime
      //thus the date is 1970-01-01
      var startDateTime = new Date(startTime);
      startDateTime.setYear(2016);
      startDateTime.setMonth(1);
      startDateTime.setDate(13);

      var endDateTime = new Date(endTime);
      endDateTime.setYear(2016);
      endDateTime.setMonth(1);
      endDateTime.setDate(13);

      if (!endDateTime || !startDateTime) {
         return res.status(400).json({error: 'Invalid parameters'});
      }

      models.Court.create({
         number: number,
         startTime: startDateTime,
         endTime: endDateTime

      }).then(function (court) {
         return res.status(200).json("added court");
      }).catch(function (err) {
            if (err.statusCode) {
               res.status(err.statusCode);
            } else {
               res.status(500);
            }
            res.json({'error': err.message});
         });
   }
};

module.exports = court;