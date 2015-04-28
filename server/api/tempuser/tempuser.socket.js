'use strict';

var controller = require('./tempuser.controller');

exports.register = function(socket) {
	socket.on('tempuser:update', function() {
		controller.updateSocket(socket);
	});
};