var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var tissi = require('./routes/tissi');
//var bcrypt = require('bcrypt');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var json = require('express-json');
var methodOverride = require('method-override');
var errorHandler = require('express-error-handler');

var app = express();

var models = require('./models');
var User = models.User;

var passport = require('passport')
   , LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());

passport.use(new LocalStrategy(
   function(username, password, done) {

      models.User.findOne({where: {username: username}})
         .then(function (user) {
            if (user) {

               user.getLogin().then(function(login){
                  if(!login) {
                     return done(null, false, {message: "No login matching the user found. This shouldn't happend..."});
                  }
                  login.validPassword(password, function(err, success){
                     if(success) {
                        return done(null, user);
                     } else {
                        return done(null, false, {message: "Invalid password!"});
                     }
                  });
               });

            } else {
               return done(null, false, {message: "The user does not exist"});
            }
         });
   }
));

passport.serializeUser(function(user, done) {
   var obj = {
      id : user.id,
      username : user.username,
      role : user.role,
      interested: user.interestedThisYear

   }
   done(null, obj);
});

// used to deserialize the user
passport.deserializeUser(function(obj, done) {
   done(null, obj);
});

var session = require('express-session');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use(require('express-session')({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var apiUser = require('./routes/api_user');
var apiAdmin = require('./routes/api_admin');

app.use('/api/user', apiUser);
app.use('/api/admin', apiAdmin);
app.use('/tissi*', tissi);
app.use('/*', routes);

if (app.get('env') === 'development') {
   app.use(function(err, req, res, next) {
      console.log(err);
      console.log("dev virhe");
      res.status(err.status || 500);
      if(err.status == 404) {
         res.redirect('/#/notfound');
      } else if (err.status == 401) {
         res.redirect('/#/denied')
      } else {
         res.redirect('/#/error');
      }

   });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
   console.log(err);
   res.status(err.status || 500);
   res.redirect('/#/error');
});

module.exports = app;

