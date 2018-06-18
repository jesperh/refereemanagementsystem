var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
var localAuth = passport.authenticate('local');

var emailUser = process.env.EMAIL_USER;
var emailPass = process.env.EMAIL_PASS;

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: emailUser,
      pass: emailPass
   }
}, {
   from: 'Päätuomari',
   headers: {
   }
});

var email = {

   sendWelcomeMail: function(data) {

      if(!emailUser || !emailPass) {
         return({error:"true", msg:"Invalid credentials."})
      }

      if(!data) {
         return({error:"true", msg:"No data given!"})
      }

      var recipient = data.recipient;
      var username = data.username;

      if(!recipient || !username) {
         return {error : "false", msg:"Invalid params!"};
      }

      //make an email model and store messages in db... some day...
      var msg = "Kyykkä moro " + username + " ! \n\n" +
         "Lorem ipsum jne....";

      transporter.sendMail({
         to: recipient,
         subject: 'Subject!',
         text: msg,
         replyTo: 'noreply@example.com'
      }, function(error, info){
         if(error){
            return {error : "false", msg : "Email send failed"};
         }
         console.log('Message sent: ' + info.response);
         return {error: "false", msg:info};
      });
   },

   sendPasswordResetMail: function(data) {

      if(!emailUser || !emailPass) {
         return({error:"true", msg:"Invalid credentials."})
      }
      if(!data) {
         return({error:"true", msg:"No data given!"})
      }

      var recipient = data.recipient;
      var token = data.token;
      var username = data.username;

      if(!recipient || !token) {
         return {error : "true", msg:"Invalid params!"};
      }

      var msg = "Hei " + username + " ! \n\n" +
         "Olet pyytänyt salasanasi resetointia tuomarienhallintaohjelmassa";

      return transporter.sendMail({
         to: recipient,
         subject: 'Salasanasi resetointi',
         text: msg,
         replyTo: 'noreply@example.com'
      });
   }
};

module.exports = email;