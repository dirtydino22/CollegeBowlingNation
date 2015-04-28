'use strict';

var controller = require('./news.controller');

exports.register = function(socket) {
	socket.on('news:update', function() {
		controller.updateSocket(socket);
	});
};