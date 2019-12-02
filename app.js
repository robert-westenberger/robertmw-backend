var createError = require('http-errors');
var express = require('express');
var pg = require('pg');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');

var { models } = require('./models');
var app = express();

//cors headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//authorization
passport.use(new Strategy(
  function(username, password, cb) {
    models.User.findOne({where: { username }}).then(user => {
      if (user) {
        user.verifyPassword(password).then(passwordIsCorrect => {
          if (passwordIsCorrect) { return cb(null, user);}
          else { return cb(null, false);}
        });
      }
      else {
        return cb(null, false);
      }
    });
  }));

passport.serializeUser(function(user, cb) {
  console.log("serializing user..", user.id);
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  models.User.findOne({where: { id }}).then(user => {
    cb(null, user);
  })
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

var pgPool = new pg.Pool({
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  host: 'localhost',
  port: 3002
});
app.use(session({
  store: new pgSession({
    pool : pgPool,                // Connection pool
  }),
  secret: 'keyboard cat',
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/javascripts', express.static(__dirname + '/node_modules/@wiris/mathtype-tinymce5/'));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
