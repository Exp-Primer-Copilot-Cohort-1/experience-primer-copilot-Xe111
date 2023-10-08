//Create web server
var express = require('express');
var app = express();
//Create server
var server = require('http').createServer(app);
//Create socket
var io = require('socket.io')(server);
//Create port
var port = process.env.PORT || 3000;
//Create path
var path = require('path');
//Create fs
var fs = require('fs');
//Create body parser
var bodyParser = require('body-parser');
//Create cookie parser
var cookieParser = require('cookie-parser');
//Create session
var session = require('express-session');
//Create passport
var passport = require('passport');
//Create flash
var flash = require('connect-flash');
//Create validator
var validator = require('express-validator');
//Create MongoStore
var MongoStore = require('connect-mongo')(session);
//Create mongoose
var mongoose = require('mongoose');
//Connect to database
mongoose.connect('mongodb://localhost:27017/shopping');
//Create database
var db = mongoose.connection;
//Create routes
var routes = require('./routes/index');
//Create users
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//Set view engine
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//Set logger
app.use(logger('dev'));
//Set body parser
app.use(bodyParser.json());
//Set body parser
app.use(bodyParser.urlencoded({ extended: false }));
//Set validator
app.use(validator());
//Set cookie parser
app.use(cookieParser());
//Set session
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: db }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
//Set flash
app.use(flash());
//Set passport
app.use(passport.initialize());
//Set passport
app.use(passport.session());
//Set static path
app.use(express.static(path.join(__dirname, 'public')));
//Set global variable
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
//Set routes
app.use('/user', users);
//Set routes
app.use('/', routes);
//Set catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  //Next
  next(err);
});
//Set error handler
app.use(function(err, req, res, next) {
  //Set locals
  res.locals.message = err.message;
  //Set locals
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  //Render the error page
  res.status(err.status || 500);
  //Render error
  res.render('error');
});

//Create chat
var chat = io.on('connection', function(socket) {
  //Create chat
  var chat = require('./chat/chat')(socket);
});



