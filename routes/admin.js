var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
var localAuth = passport.authenticate('local');

var admin = {

   getUsers: function (req, res, next) {

      models.User.findAll({
         include: [{
            model: models.Tournament,
            as: "WorkerTournaments",
            where: {id:2},
            required: false
         }]
      })
         .then(function (users) {
            return res.status(200).json(users);
         }, function (err) {
            return res.status(500).json({error: err});
         });
   },

   addUser: function (req, res, next) {

      var username = req.body.username;
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var password = req.body.password;
      var email = req.body.email;
      var phonenumber = req.body.phonenumber;
      var timesReferee = req.body.timesReferee;
      var greetings = req.body.greetings;
      var interestReferee = req.body.interestReferee;
      var interestSecurity = req.body.interestSecurity;
      var interestMisc = req.body.interestMisc;

      if (!username || !firstname || !password || !email || !lastname) {
         return res.status(400).json({error: 'Invalid parameters'});
      }

      function throwError(msg, code) {
         var e = new Error(msg);
         e.statusCode = code;
         throw e;
      }

      models.User.findOne({where: {username: username}})
         .then(function (user) {
            if (user) {
               console.log("username already taken");
               throwError('username already taken', 409)
            }
         })

         .then(function () {
            return models.User.findOne({where: {email: email}})
         })
         .then(function (user) {
            if (user) {
               console.log("email already taken");
               throwError('email already taken', 409)
            }
         })
         .then(function () {
            models.User.create({
               username: username,
               firstname: firstname,
               lastname: lastname,
               email: email,
               phonenumber: phonenumber,
               timesReferee: timesReferee,
               greetings: greetings,
               interestReferee: interestReferee,
               interestSecurity: interestSecurity,
               interestMisc: interestMisc
            })
               .then(function (user) {
                     models.Login.create({
                        password: password,
                        UserId: user.id
                     })
                        .then(function (login) {
                              user.save();
                              login.save();
                           },
                           function (err) {
                              return res.status(500).json({error: 'ServerError'});
                           });

                     return res.status(201).json(user);
                  },
                  function (err) {
                     return res.status(500).json({error: 'ServerError'});
                  });
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

   getUser: function (req, res, next) {
      var id = req.params['id'];
      if (!id) {
         return res.status(400).json({error: 'Invalid id'});
      }
      models.User.findOne({where: {id: id}})
         .then(function (user) {
            if (user) {
               return res.status(200).json({
                  firstname: user.firstname,
                  lastname: user.lastname,
                  email: user.email,
                  phonenumber: user.phonenumber,
                  interestedMisc: user.interestedMisc,
                  interestedReferee: user.interestedReferee,
                  experience: user.experience
               });
            } else {
               return res.status(404).json({error: 'User not found'});
            }
         });
   },

   updateUser: function (req, res, next) {
      var id = req.params.id;

      if (!id) {
         return res.status(400).json({error: 'Invalid id'});
      }

      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var email = req.body.email;
      var phonenumber = req.body.phonenumber;
      var experience = req.body.experience;
      var greetings = req.body.greetings;
      var interestedReferee = req.body.interestedReferee;
      var interestedMisc = req.body.interestedMisc;

      if (!firstname || !email || !lastname || !phonenumber) {
         return res.status(400).json({error: 'Invalid parameters'});
      }

      function throwError(msg, code) {
         var e = new Error(msg);
         e.statusCode = code;
         throw e;
      }

      models.User.findOne({where: {id: id}})
         .then(function (user) {
            if (!user) {
               console.log("user not found");
               throwError('user not found', 404);
            }
         })
         .then(function () {
            return models.User.findOne({where: {email: email}})
         })
         .then(function (user) {
            if (user && user.id != id) {
               console.log("email already taken");
               throwError('email already taken', 409)
            }
            user.update({
               firstname: firstname,
               lastname: lastname,
               email: email,
               phonenumber: phonenumber,
               experience: experience,
               greetings: greetings,
               interestedReferee: interestedReferee,
               interestedMisc: interestedMisc
            })
               .then(function () {
                     return res.status(200).json({msg: "OK"});
                  },
                  function (err) {
                     return res.status(500).json({error: 'ServerError', msg: err});
                  });
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

module.exports = admin;