let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let flash = require('connect-flash');
let passport = require('passport');
require('./config/passport')(passport);
let session = require('express-session');
let mongoose = require('mongoose');
let mongodbStore = require('connect-mongo')(session);
let dbConfig = require('./config/database');
mongoose.connect(dbConfig.url, {useNewUrlParser: true});

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new mongodbStore({
    mongooseConnection: mongoose.connection
  }),
  resave:false,
  saveUninitialized: false,
  secret: 'mySecretKey'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let registerRouter = require('./routes/register')(passport);
let loginRouter = require('./routes/login')(passport);

app.use('/', indexRouter);
app.use('/users', ensureAuthenticated, usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else res.redirect('/');
  // Return error content: res.jsonp(...) or redirect: res.redirect('/login')
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;