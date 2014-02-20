var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var namespace = require('express-namespace');
var config = require('../configuration');

var app = express();

// all environments
app.set('port', config.get('express:port'));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(express.favicon());
app.use(express.logger({
    format: 'dev',
    stream: fs.createWriteStream('./lib/express/log/app.log', {'flags': 'w'})
}));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var routes = require('../routes')(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
module.exports = app;

