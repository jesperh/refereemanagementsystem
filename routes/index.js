module.exports = (function() {
  'use strict';

  function adminAuth(req, res, next) {
    //check that the user is in session
    if (req.user && req.user.role == "admin") {
      next();
    }
    else {
      res.redirect('/#/denied');
    }
  }

  var router = require('express').Router();

  router.get("/api/admin/*", adminAuth, function(req, res, next) {
    next(); // if the middleware allowed us to get here,
            // just move on to the next route handler
  });

  router.get('/', function(req, res) {
    res.render('index', {
      host: req.headers.host
    });
  });

  return router;
})();