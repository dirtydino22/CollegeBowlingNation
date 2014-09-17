'use strict';

var express = require('express'),
    favicon = require('static-favicon'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    path = require('path'),
    config = require('./config'),
    passport = require('passport'),
    mongoStore = require('connect-mongo')(session);
/**
 * Express Config
 */
module.exports = function(app) {
  app.use(express.static(path.join(config.root, 'front_end')));
  app.set('views', config.root + '/front_end/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(cookieParser());

  app.use(session({
    secret: 'my-cbn secret',
    store: new mongoStore({
      url: config.mongo.uri,
      collection: 'sessions'
    }, function() {
      console.log('db connection open');
    })
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  if ('development' === app.get('env')) {
    app.use(errorHandler());
  }
};