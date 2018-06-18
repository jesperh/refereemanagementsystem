var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
var localAuth = passport.authenticate('local');
var users = require('./users.js');
var admin = require('./admin.js');
var tournament = require('./tournament.js');
var court = require('./court.js');
var referee = require('./referee.js');
var auth = require('./auth.js');
var email = require('./email.js');
var worker = require('./worker.js');
var express = require('express');

var basicAuth = require('basic-auth');

router.get('/users',  adminAuth, admin.getUsers);

router.post('/referees',  adminAuth, referee.makeReferee);
router.get('/referees',  adminAuth, referee.getReferees);

router.put('/referees/:id/addcourt', adminAuth, referee.addCourt);
router.put('/referees/:id/removecourt', adminAuth, referee.removeCourt);
router.put('/referees/:id/setstatus', adminAuth, referee.setStatus);
router.put('/referees/:id/setpowerbank', adminAuth, referee.setPowerbank);
router.put('/referees/:id/setpawn', adminAuth, referee.setPawn);

router.get('/referees/untrained', adminAuth, referee.untrainedReferees);
router.get('/referees/trained', adminAuth, referee.trainedReferees);

router.delete('/referees/:id', adminAuth, referee.removeReferee);

router.get('/workers',  adminAuth, worker.getWorkers);

router.post('/tournaments', adminAuth,  tournament.addTournament);
router.get('/tournaments',  adminAuth, tournament.getTournaments);

router.post('/courts', adminAuth,  court.addCourt);
router.get('/courts',  adminAuth, court.getCourts);

//router.get('/ext/referees', bauth, referee.apiReferees);

function adminAuth(req, res, next) {
   //check that the user is in session
   if (req.user && req.user.role == "admin") {
      next();
   }
   else {
      return res.status(500);
   }
}

function bauth(req, res, next) {
   var username = process.env.APIUSER;
   var password = process.env.APIPASS;

   function unauthorized(res) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.send(401);
   };

   var user = basicAuth(req);

   if (!user || !user.name || !user.pass) {
      return unauthorized(res);
   };

   if (user.name === username && user.pass === password) {
      return next();
   } else {
      return unauthorized(res);
   };
};
module.exports = router;
