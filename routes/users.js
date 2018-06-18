var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
var localAuth = passport.authenticate('local');
var emailService = require('./email.js');
var crypto = require('crypto');
var moment = require('moment');

var users = {

   addUser: function (req, res, next) {

      var username = req.body.username;
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var password = req.body.password;
      var email = req.body.email;
      var phonenumber = req.body.phonenumber;
      var experience = req.body.experience;
      var greetings = req.body.greetings;
      var interestedReferee = req.body.interestedReferee;
      var interestedMisc = req.body.interestedMisc;

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
               experience: experience,
               greetings: greetings,
               interestedReferee: interestedReferee,
               interestedMisc: interestedMisc,
               interestedThisYear: true
            })
               .then(function (user) {
                     models.Login.create({
                        password: password,
                        UserId: user.id
                     })
                        .then(function (login) {
                              login.save();
                              user.save();
                           },
                           function (err) {
                              return res.status(500).json({error: 'ServerError'});
                           });

                     req.logIn(user, function (err) {
                        if (err) {
                           console.log(err);
                           return next(err);
                        }

                        emailService.sendWelcomeMail({recipient: email, username: username});
                        return res.status(201).json(user);
                     });

                  },
                  function (err) {
                     return res.status(500).json({error: err});
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
      if (id != req.user.id) {
         return res.status(401).json({error: 'Not authorised'});
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
                  interestedThisYear: user.interestedThisYear,
                  experience: user.experience
               });
            } else {
               return res.status(404).json({error: 'User not found'});
            }
         });
   },

   //updates the properties of an existing user with the given new values
   willRefereeThisYear: function (req, res, next) {

      var id = req.params.id;

      if (!id) {
         return res.status(400).json({error: 'Invalid id'});
      }
      if (id != req.user.id) {
         return res.status(401).json({error: 'Not authorised'});
      }

      function throwError(msg, code) {
         var e = new Error(msg);
         e.statusCode = code;
         throw e;
      }

      var foundUser;

      models.User.findOne({where: {id: id}})
         .then(function (user) {
            if (!user) {
               console.log("user not found");
               throwError('user not found', 404);
            } else {
               foundUser = user;
               return user;
            }
         })
         .then(function (user) {
            console.log(user);
            user.update({
               interestedThisYear: true
            })
               .then(function (user) {
                     return res.status(200).json({msg: "OK"});
                  },
                  function (err) {
                     console.log(err);
                     return res.status(500).json({error: 'ServerError', msg: err});
                  });
         })
         .catch(function (err) {
            console.log(err);
            if (err.statusCode) {
               res.status(err.statusCode);
            } else {
               res.status(500);
            }
            res.json({'error': err.message});
         });


   },

   //updates the properties of an existing user with the given new values
   updateUser: function (req, res, next) {

      var id = req.params.id;

      if (!id) {
         return res.status(400).json({error: 'Invalid id'});
      }
      if (id != req.user.id) {
         return res.status(401).json({error: 'Not authorised'});
      }

      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var password = req.body.password;
      var newPassword = req.body.newPassword;
      var email = req.body.email;
      var phonenumber = req.body.phonenumber;
      var experience = req.body.experience;
      var greetings = req.body.greetings;
      var interestedReferee = req.body.interestedReferee;
      var interestedMisc = req.body.interestedMisc;


      if (newPassword && newPassword.length > 0 && !password) {
         return res.status(409).json({error: 'OldPasswordInvalid'});
      }

      if (!firstname || !email || !lastname || !phonenumber) {
         return res.status(400).json({error: 'Invalid parameters'});
      }

      function throwError(msg, code) {
         var e = new Error(msg);
         e.statusCode = code;
         throw e;
      }

      var foundUser;

      models.User.findOne({where: {id: id}})
         .then(function (user) {
            if (!user) {
               console.log("user not found");
               throwError('user not found', 404);
            } else {
               foundUser = user;
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

            foundUser.update({
               firstname: firstname,
               lastname: lastname,
               email: email,
               phonenumber: phonenumber,
               experience: experience,
               greetings: greetings,
               interestedReferee: interestedReferee,
               interestedMisc: interestedMisc

            })
               .then(function (user) {
                     if (!newPassword || newPassword.length == 0) {
                        return res.status(200).json({msg: "OK"});
                     }

                     user.getLogin()
                        .then(function (login) {
                           if (!login) {
                              return res.status(404).json({error: 'NoLoginFound', msg: err});
                           }

                           login.validPassword(password, function (err, success) {
                              if (!success) {
                                 return res.status(409).json({error: 'OldPasswordInvalid', msg: err});

                              }
                              login.update({
                                 password: newPassword
                              }, {fields: ["password"]})
                                 .then(function () {
                                       return res.status(200).json({msg: "OK"});
                                    },
                                    function (err) {
                                       console.log(err);
                                       return res.status(500).json({error: 'ServerError', msg: err});
                                    });
                           });
                        });

                  },
                  function (err) {
                     console.log(err);
                     return res.status(500).json({error: 'ServerError', msg: err});
                  });
         })
         .catch(function (err) {
            console.log(err);
            if (err.statusCode) {
               res.status(err.statusCode);
            } else {
               res.status(500);
            }
            res.json({'error': err.message});
         });
   }



   //this isn't fully functional and isn't used anywhere yet
   //saving for upcoming years when we want to see which tournaments user has participated
   //getTournaments: function(req, res, next) {
   //
   //models.User.findAll({
   //   //where: {TournamentId: 1},
   //
   //   include: [{model: models.Tournament, as: 'WorkerTournaments'}]
   //})
   //.then(function (users) {
   //   var user = users[0];
   //   ////var user = worker.getUser();
   //   //console.log(user)
   //
   //   return res.status(200).json(user);
   //   //return res.status(200).json("asdasdsa");
   //}).catch( function(err){
   //   console.log("feil");
   //   return res.status(500).json({error: err});
   //});
   //
   //}

};

module.exports = users;