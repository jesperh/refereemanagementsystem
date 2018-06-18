var router = require('express').Router();
var models = require('../models');
var passport = require('passport');
var localAuth = passport.authenticate('local');
var users = require('./users.js');
var passwordService = require('./password.js');
var auth = require('./auth.js');


//Creates a new user and corresponding login
router.post('/', users.addUser);

router.post('/login', localAuth, auth.login);
router.post('/logout', auth.logout);
router.post('/forgot/:credential', passwordService.forgot);
router.get('/resetpw/:token', passwordService.token);
router.put('/resetpw/', passwordService.change);
router.get('/identity', checkLogin, auth.identity);
router.get('/:id', apiAuth, users.getUser);
router.put('/:id', apiAuth, users.updateUser);
router.put('/interested/:id', apiAuth, users.willRefereeThisYear);

// Define a middleware function to be used for every secured routes
var isLoggedIn = function(req, res, next){
   if (!req.isAuthenticated())
      res.send(401);
   else
      next();
};

function checkLogin(req, res, next) {
   //check that the user is in session
   if (req.user) {
      next();
   }
   else {
      next();
   }
}

function apiAuth(req, res, next) {
   //check that the user is in session
   if (req.user) {
      next();
   }
   else {
      res.redirect('/#/denied');
   }
}

module.exports = router;
