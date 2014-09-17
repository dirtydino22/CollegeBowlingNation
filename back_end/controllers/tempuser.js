'use strict';

var mongoose = require('mongoose'),
    TempUser = mongoose.model('TempUser'),
    User = mongoose.model('User'),
    passport = require('passport');

/**
 * Create temp user
 */
exports.create = function (req, res, next) {
  var newUser = new TempUser(req.body);
  console.log(req.body.university);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);

    return res.json('temp user saved');
  });
};

exports.list = function (req, res) {
	TempUser.find(function(err, users) {
		if (!err) {
			users.forEach(function(user) {
				user.hashedPassword = false;
				user.salt = false;
			});
			return res.json(200, users);
		}
		else {
			return res.json(err);
		}
	});
};

exports.updateSocket = function(io, socket) {
	TempUser.find(function(err, users) {
		if (err) { return socket.emit('error:nodata'); }
		return io.emit('tempusers:update', users);
	});
};

exports.handle = function(req, res) {
	var handle = req.params.handle,
		id = req.params.id,
		newUser;
	if (handle === 'accept') {
		TempUser.findById(id, function(err, user) {
			if (err) {return res.json(400, { message: 'This is not a valid id' });};
			newUser = new User(user);
			newUser.save(function(err) {
				if (err) {return res.json(400, { message: 'Error accepting user' });};
				return;
			});
			user.remove(function(err) {
				if (err) {return res.json(400, { message: 'Error accepting user' });};
				return res.json(200, { message: 'User accepted' });
			});
		});
	}
	else if (handle === 'acceptadmin') {
		TempUser.findById(id, function(err, user) {
			if (err) {return res.json(400, { message: 'This is not a valid id' });};
			newUser = new User(user);
			newUser.role = 'admin';
			newUser.save(function(err) {
				if (err) {return res.json(400, { message: 'Error accepting admin' });};
				user.remove(function(err) {
					if (err) {return res.json(400, { message: 'Error removing temp user' });};
					return res.json(200, { message: 'Admin accepted' });
				});
			});
		});
	}
	else if (handle === 'decline') {
		TempUser.findById(id, function(err, user) {
			if (err) {return res.json(400, { message: 'This is not a valid id' });};
			user.remove(function(err) {
				if (err) {return res.json(400, { message: 'Error removing user' });};
				return res.json(200, { message: 'User declined' });
			});		
		});
	}
};