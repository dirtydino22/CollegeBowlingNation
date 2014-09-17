'use strict';
var news = require('../controllers/news'),
	teams = require('../controllers/teams'),
	tempusers = require('../controllers/tempuser'),
	users = require('../controllers/users'),
	blog = require('../controllers/blog');

module.exports = function(app) {
	var http = require('http').Server(app),
		io = require('socket.io')(http);

	io.on('connection', function(socket) {
		socket.on('news:update', function() {
			news.updateSocket(io, socket);
		});

		socket.on('games:update', function() {
			teams.updateSocket(io, socket);
		});

		socket.on('users:update', function() {
			users.updateSocket(io, socket);
		});

		socket.on('tempusers:update', function() {
			tempusers.updateSocket(io, socket);
		});

		socket.on('posts:update', function() {
			blog.updateSocket(io, socket);
		});

		socket.on('offline:update', function() {
			news.updateSocket(io, socket);
			teams.updateSocket(io, socket);
			users.updateSocket(io, socket);
			tempusers.updateSocket(io, socket);
			blog.updateSocket(io, socket);
		});
	});

	return http;
};