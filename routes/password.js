var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
var localAuth = passport.authenticate('local');
var emailService = require('./email.js');
var crypto = require('crypto');
var moment = require('moment');

var passwordService = {


   //creates a reset password token, saves it in db, and sends an email to the user
   //containing the link to reset password
   forgot: function (req, res, next) {

      var credential = req.params.credential;
      if (!credential || credential == undefined || credential == "undefined") {
         return res.status(400).json({error: 'InvalidCredential'});
      }

      var userFound = false;

      models.User.findOne({where: {$or: [{username: credential}, {email: credential}]}})
         .then(function (user) {

            if (user) {
               userFound = true;
               var token = crypto.randomBytes(20).toString('hex');
               //crypto.randomBytes(20, function(err, buf) {
               //   var token = buf.toString('hex');
               //   done(err, token);
               //});

               //for safety, expire the token after one hour
               var expires = moment().add(1, "hours").format();

               models.ResetPw.create({
                  token: token,
                  expires: expires,
                  UserId: user.id
               })
                  .then(function (reset) {
                        emailService.sendPasswordResetMail({recipient: user.email, token: token, username: user.username})
                           .then(function (info) {
                              return res.status(200).json({msg: "succeeded"})
                           }).catch(function (error) {
                           return res.status(500).json({msg: "EmailFailed"})
                        });
                     },
                     function (err) {
                        return res.status(500).json({error: err});
                     });
            } else {
               return res.status(400).json({error: 'InvalidCredential'});
            }
         })
         .catch(function (e) {
            return res.status(500).json({error: e});
         })
   },

   token: function (req, res, next) {
      var token = req.params.token;
      if (!token) {
         return res.status(400).json({error: 'InvalidToken'});
      }

      //search the given token from db
      models.ResetPw.findOne({where: {token: token}})
         .then(function (reset) {
            if (!reset) {
               return res.status(200).json({error: 'TokenNotFound'});
            }

            var now = moment();
            var expires = moment(reset.expires);

            if (now.isAfter(expires)) {
               return res.status(200).json({error: 'TokenExpired'});
            }

            return res.status(200).json({token: reset.token});
         })
         .catch(function (e) {
            return res.status(500).json({error: e});
         });
   },

   change: function (req, res, next) {
      var pass = req.body.password;
      var pass2 = req.body.password2;
      var token = req.body.token;

      if (!token) {
         return res.status(400).json({error: 'InvalidToken'});
      }

      if (pass != pass2) {
         return res.status(409).json({error: 'PasswordMissmatch'});
      }

      //search the given token from db
      models.ResetPw.findOne({where: {token: token}})

         .then(updateToken)
         .then(updateLogin, pass)
         .catch(function (err) {
            return res.status(500).json({error: 'ServerError', msg: err});
         });


      function updateToken(reset) {

         if (!reset) {
            return undefined;
         }

         var now = moment();
         var expires = moment(reset.expires);

         if (now.isAfter(expires)) {
            return undefined;
         }

         var userId = reset.UserId;

         return reset.destroy()
            .then(function () {
               return {userId: userId, password: pass};
            });
      }

      function updateLogin(data) {
         if (!data) {
            return res.status(404).json({error: 'TokenNotFound'});
         }

         models.Login.findOne({where: {UserId: data.userId}})
            .then(function (login) {

               if (!login) {
                  return res.status(404).json({error: 'LoginNotFound'});
               }

               login.update({password: data.password}, {fields: ["password"]}).then(function () {
                  return res.status(200).json({msg: "Password reseted"});
               });
            });
      }
   }
};

module.exports = passwordService;