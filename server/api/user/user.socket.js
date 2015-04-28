'use strict';

var controller = require('./user.controller');

exports.register = function(socket) {
	socket.on('user:update', function() {
		controller.updateSocket(socket);
	});
	socket.on('roster:update', function(id) {
		console.log('Roster Socket');
		controller.updateRoster(socket, id);
	});
};