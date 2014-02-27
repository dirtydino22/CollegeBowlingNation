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
// Create express app
var app = express();

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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('localhost', 'CBN');

/**
 * Routes
 */
var routes = require('../routes')(app);

/**
 * Start Server
 */
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;