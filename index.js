'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

/**
 * Server Application File
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./back_end/config/config');
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'back_end/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});
// authentication
var passport = require('./back_end/config/passport');
// server
var app = express();
// server config
require('./back_end/config/express')(app);
// routes config
require('./back_end/config/routes')(app);
// sockets config
var http = require('./back_end/config/socket')(app);


http.listen(config.port, config.ip, function() {
  console.log('Express server listening on %s:%d in %s mode', config.ip, config.port, app.get('env'));
});

exports = module.exports = app;
