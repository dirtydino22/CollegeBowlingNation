'use strict';

var controller = require('./blog.controller');

exports.register = function(socket) {
	socket.on('blog:update', function() {
		controller.updateSocket(socket);
	});
};