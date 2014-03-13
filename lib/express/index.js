'use strict';
/**
 * Module Dependencies 
 */
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var namespace = require('express-namespace');
var config = require('../configuration');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var TempUser = require('../models/tempUser');
// Create express app
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

/**
 * Config
 */
// all environments

// set port from config
app.set('port', config.get('express:port'));

// set views path
app.set('views', path.join(__dirname, '../../app'));

// set html rendering engine
app.engine('html', require('ejs').renderFile);

// makes source code pretty
app.locals.pretty = true;

// use a favicon
//app.use(express.favicon());

// creates a log
app.use(express.logger({
    format: 'dev',
    stream: fs.createWriteStream('./lib/express/log/app.log', {'flags': 'w'})
}));

app.use(express.cookieParser());
// used to process forms
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.session({secret: 'mysecret'}));

app.use(passport.initialize());
app.use(passport.session());

// create a router
app.use(app.router);

// set the static public folder
app.use(express.static(path.join(__dirname, '../../app')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

/**
 * Passport
 */
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * DB
 */
mongoose.connect('localhost', 'CBN');

/**
 * Routes
 */
var routes = require('../routes')(app);

/***
 * Sockets
 */
 io.sockets.on('connection', function(socket) {
 	// on tempUser:update event
 	socket.on('tempUser:update', function() {
 		TempUser.find(function(err, users) {
 			if (!err) {
 				socket.emit('tempUser:update', users);
 				socket.broadcast.emit('tempUser:update', users); 
 			}
 			else {
 				console.log(err);
 			}
 		});
 	});
	// on user:update event
 	socket.on('user:update', function() {
 		User.find(function(err, users) {
 			if (!err) {
 				socket.emit('user:update', users);
 				socket.broadcast.emit('user:update', users); 
 			}
 			else {
 				console.log(err);
 			}
 		});
 	});
 	// on offline:update event
 	socket.on('offline:update', function() {
 		//update everything since we are not sure what was updated offline
 		TempUser.find(function(err, users) {
 			if (!err) {
 				socket.emit('tempUser:update', users);
 				socket.broadcast.emit('tempUser:update', users); 
 			}
 			else {
 				console.log(err);
 			}
 		});
 		User.find(function(err, users) {
 			if (!err) {
 				socket.emit('user:update', users);
 				socket.broadcast.emit('user:update', users); 
 			}
 			else {
 				console.log(err);
 			}
 		});
 	})
 });

/**
 * Start Server
 */
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;