'use strict';

var TempUser = require('./tempuser.model');
var User = require('../user/user.model');

exports.index = function(req, res) {
    TempUser.find(function(err, users) {
        if (!!err) return res.send(403);
        users.forEach(function(user) {
            user.hashedPassword = false;
            user.salt = false;
        });
        return res.json(200, users);
    });
};

exports.create = function(req, res) {
    var newUser = new TempUser(req.body);
    newUser.provider = 'local';
    newUser.save(function(err) {
        if (!!err) return res.send(400);
        return res.json(200);
    });
};

exports.handle = function(req, res) {
	var handle = req.params.handle,
		id = req.params.id,
		newUser;
	if (handle === 'accept') {
		TempUser.findById(id, function(err, user) {
			if (!!err) return res.json(400, { message: 'This is not a valid id' });
			newUser = new User(user);
			newUser.save(function(err) {
				if (!!err) return res.json(400, { message: 'Error accepting user' });
				return;
			});
			user.remove(function(err) {
				if (!!err) return res.json(400, { message: 'Error accepting user' });
				return res.json(200, { message: 'User accepted' });
			});
		});
	}
	else if (handle === 'acceptadmin') {
		TempUser.findById(id, function(err, user) {
			if (!!err) return res.json(400, { message: 'This is not a valid id' });
			newUser = new User(user);
			newUser.role = 'admin';
			newUser.save(function(err) {
				if (!!err) return res.json(400, { message: 'Error accepting admin' });
				user.remove(function(err) {
					if (!!err) return res.json(400, { message: 'Error removing temp user' });
					return res.json(200, { message: 'Admin accepted' });
				});
			});
		});
	}
	else if (handle === 'decline') {
		TempUser.findById(id, function(err, user) {
			if (!!err) return res.send(403, { message: 'This is not a valid id' });
			user.remove(function(err) {
				if (!!err) return res.json(400, { message: 'Error removing user' });
				return res.json(200, { message: 'User declined' });
			});		
		});
	}
};

exports.updateSocket = function(socket) {
	TempUser.find(function(err, users) {
		if (!!err) return socket.emit('error:nodata');
		return socket.emit('tempuser:update', users);
	});
};