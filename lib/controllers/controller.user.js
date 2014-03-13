'use strict';
var User = require('../models/user');

exports.list = function(req, res) {
	User.find(function(err, users) {
		(!err) ? res.json(users) : res.json('Error retrieving users.');
	});
};
exports.updatePassword = function(req, res) {
	console.log('trying to update password.');

	var id = req.params.userId;
	console.log('ID: ' + id);
	var password = req.body.password;
	console.log('Password: ' + id);
	if (id) {
		console.log('have id');
		User.findById(id, function(err, user) {
			console.log('found user for update.');
			user.setPassword(password, function() {
				//res.json('Password Updated.');
				user.save(function(err) {
					(!err) ? console.log('Password Updated.') : console.log('Error updating password.');
				});
				
			});
		});
	}
	else {
		res.json('ID required.');
	}
};

exports.register = function(req, res) {
	var reqObj = req.body;
	User.register(new User({
		username: reqObj.username,
		firstName: reqObj.firstName,
		lastName: reqObj.lastName,
		address: reqObj.address,
		address2: reqObj.address2,
		city: reqObj.city,
		state: reqObj.state,
		zipcode: reqObj.zipcode,
		phone: reqObj.phone,
		university: reqObj.university,
		email: reqObj.email,
		access: reqObj.access
	}),
	reqObj.password,
	function(err) {
		if (err) {
            console.log('Registration Error:', err);
            return res.redirect('/');
        }
        return res.redirect('/');
	});
};

exports.remove = function(req, res) {
	var id = req.params.userId;
	User.findById(id, function(err, user) {
		user.remove(function(err) {
			(err) ? res.json(err) : res.json('User removed.');
		});
	});
};