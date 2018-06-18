var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
var localAuth = passport.authenticate('local');
var _ = require('lodash');

var referee = {

   getReferees: function (req, res, next) {

      models.Referee.findAll({
         include: [{model: models.Court},
            {
               model: models.Worker,
               where: {TournamentId: 2},
               include: [{
                  model: models.User
               }]
            }]
      })
         .then(function (referees) {
            return res.status(200).json(referees);
         }, function (err) {
            return res.status(500).json({error: err});
         });

   },

   addCourt: function (req, res, next) {

      var refereeId = req.params.id;
      var courtId = req.body.courtId;

      if (!refereeId || !courtId) {
         return res.status(409).json({error: 'Invalid parameters'});
      }

      models.Referee.findOne({where: {id: refereeId}})
         .then(function (referee) {

            if (!referee) {
               return res.status(404).json({error: 'RefereeNotFound'});
            }
            return referee;
         }).then(function (referee) {

         return models.Court.findOne({where: {id: courtId}}).then(function (court) {

            if (!court) {
               return undefined;
            }
            return referee;
         })

      })
         .then(function (referee) {

            if (!referee) {
               return res.status(404).json({error: 'CourtNotFound'});
            }

            referee.update({CourtId: courtId}, {fields: ["CourtId"]})
               .then(function () {
                  return res.status(200).json(referee);
               })
         })
         .catch(function (err) {
            return res.status(500).json(err);
         });
   },

   removeCourt: function (req, res, next) {

      refereeAndCourt(req.params.id, req.body.courtId)
         .then(function (refereeAndCourt) {

            if (!refereeAndCourt || (refereeAndCourt && !refereeAndCourt.referee)) {
               return res.status(404).json({error: 'RefereeNotFound'});
            }

            refereeAndCourt.referee.update({CourtId: null}, {fields: ["CourtId"]})
               .then(function () {
                  return res.status(200).json(refereeAndCourt.court);
               })
               .catch(function (err) {
                  return res.status(500).json(err);
               });
         })
         .catch(function (err) {
            return res.status(500).json(err);
         });
   },

   setStatus: function (req, res, next) {

      var refereeId = req.params.id;
      var status = req.body.status;

      if (!refereeId || !status) {
         return res.status(409).json({error: 'Invalid parameters'});
      }

      models.Referee.findOne({where: {id: refereeId}})
         .then(function (referee) {
            if (!referee) {
               return res.status(404).json({error: 'RefereeNotFound'});
            }
            return referee;
         })
         .then(function (referee) {
            referee.update({status: status}, {fields: ["status"]})
               .then(function () {
                  return res.status(200).json(referee);
               });
         })
         .catch(function (err) {
            return res.status(500).json(err);
         });
   },

   setPowerbank: function (req, res, next) {

      var refereeId = req.params.id;
      var status = req.body.status;

      if (!refereeId || !status) {
         return res.status(409).json({error: 'Invalid parameters'});
      }

      models.Referee.findOne({where: {id: refereeId}})
         .then(function (referee) {

            if (!referee) {
               return res.status(404).json({error: 'RefereeNotFound'});
            }
            return referee;
         })
         .then(function (referee) {

            referee.update({powerbank: status}, {fields: ["powerbank"]})
               .then(function () {
                  return res.status(200).json(referee);
               });
            //.catch(function(err){
            //   return res.status(500).json(err);
            //});
         })
         .catch(function (err) {
            return res.status(500).json(err);
         });

   },

   setPawn: function (req, res, next) {

      var refereeId = req.params.id;
      var status = req.body.status;

      if (!refereeId || !status) {
         return res.status(409).json({error: 'Invalid parameters'});
      }

      models.Referee.findOne({where: {id: refereeId}})
         .then(function (referee) {

            if (!referee) {
               return res.status(404).json({error: 'RefereeNotFound'});
            }
            return referee;
         })
         .then(function (referee) {

            referee.update({pawn: status}, {fields: ["pawn"]})
               .then(function () {
                  return res.status(200).json(referee);
               });
         })
         .catch(function (err) {
            return res.status(500).json(err);
         });
   },

   makeReferee: function (req, res, next) {

      var userId = req.body.userId;
      //user hard coded tournament id
      //there is no need to select the tournament in the UI
      //at least no in this year
      var tournamentId = 2;

      if (!userId) {
         return res.status(400).json({error: 'Invalid parameters'});
      }

      models.User.findOne({where: {id: userId}})
         .then(function (user) {

            if (!user) {
               return res.status(404).json({error: 'UserNotFound'});
            }

            //check that the user isn't already a referee
            models.Worker.findOne({where: {UserId: user.id, TournamentId: tournamentId}}).then(function (worker) {

               if (worker) {
                  return models.Referee.findOne({where: {WorkerId: worker.id}}).then(function (referee) {
                     if (referee) {
                        return res.status(409).json("AlreadyReferee");
                     } else {
                        //user might be worker with different role (such ass helper),
                        //so we mustn't prevent adding him as referee too
                        models.Referee.create({WorkerId: worker.id}).then(function (referee) {
                           return res.status(200).json(referee);
                        });
                     }
                  })
               }

               //need to create worker this way because instance method user.addWorkerTournament(tournamentId)
               //does not return the id of added worker in promise and the id is required for adding a referee.
               return models.Worker.create({UserId: user.id, TournamentId: tournamentId}).then(function (worker) {
                  models.Referee.create({WorkerId: worker.id}).then(function (referee) {
                     return res.status(200).json(referee);
                  })
               })
                  .catch(function (err) {
                     return res.status(500).json(err);
                  });
            })
         })
         .catch(function (err) {
            if (err.statusCode) {
               res.status(err.statusCode);
            } else {
               res.status(500);
            }
            res.json({'error': err.message});
         });
   },

   removeReferee: function (req, res, next) {

      var refereeId = req.params.id;

      if (!refereeId) {
         return res.status(409).json({error: 'Invalid parameters'});
      }

      models.Referee.findOne({where: {id: refereeId}})
         .then(function (referee) {

            if (!referee) {
               return res.status(404).json({error: 'RefereeNotFound'});
            }
            return referee.getWorker();
         })
         .then(function (worker) {
            return worker.destroy();
         })
         .then(function () {
            return res.status(200).json();
         })
         .catch(function (err) {
            return res.status(500).json({error: err});
         });

   },

   untrainedReferees: function (req, res, next) {

      //todo: better algorithm
      models.Referee.findAll({
         include: [{
            model: models.Worker
         }]
      })
         .then(function (referees) {
            models.User.findAll()
               .then(function (users) {
                  var untrained = [];
                  _.forEach(users, function (user) {
                     var indx = _.findIndex(referees, function (referee) {
                        return referee.Worker.UserId === user.id;
                     });
                     if (indx == -1) {
                        untrained.push(user.email)
                     }
                  });
                  return res.status(200).json(untrained);
               });
         })
   },

   trainedReferees: function (req, res, next) {

      //todo: better algorithm
      models.Referee.findAll({
         include: [{
            model: models.Worker,
            include: [{
               model: models.User
            }]
         }]
      })
         .then(function (referees) {
            var trained = _.map(referees, _.property('Worker.User.email'));
            return res.status(200).json(trained);
         })

   },

   apiReferees:  function(req, res, next) {

      models.Referee.findAll({
         include: [{model:models.Court},
            {
               model: models.Worker,
               where: {TournamentId:2},
               include: [{
                  model: models.User
               }]
            }]
      })
         .then(function (referees) {
            return res.status(200).json(referees);
         }, function(err){
            return res.status(500).json({error: err});
         });
   }
};

var refereeAndCourt = function (refereeId, courtId) {

   if (!refereeId || !courtId) {
      return res.status(409).json({error: 'Invalid parameters'});
   }

   return models.Referee.findOne({where: {id: refereeId}})
      .then(function (referee) {

         if (!referee) {
            return res.status(404).json({error: 'RefereeNotFound'});
         }
         return referee;
      })
      .then(function (referee) {

         return models.Court.findOne({where: {id: courtId}})
            .then(function (court) {

               if (!court) {
                  return undefined;
               }
               return {court: court, referee: referee};
            })

      });
};

module.exports = referee;