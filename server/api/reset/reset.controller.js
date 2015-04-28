'use strict';

var User = require('../user/user.model');

exports.index = function(req, res) {
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	},
	function(err, user) {
		if (!user) return res.redirect('/');
		return res.render('./reset.html');
	});
};

exports.reset = function(req, res) {
	User.findOne({
		resetPasswordToken: req.body.token
	},
	function(err, user) {
		if (!user) return res.send(403);
		user.password = req.body.password;
		user.save(function(err) {
			if (err) return res.send(500);
			return res.send(200);
		});
	});
};