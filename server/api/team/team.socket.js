'use strict';

var controller = require('./team.controller');

exports.register = function(socket) {
	socket.on('team:update', function() {
		controller.updateSocket(socket);
	});
};