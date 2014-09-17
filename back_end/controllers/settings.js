'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Settings = mongoose.model('Settings'),
	flag = isSetup();

exports.init = function(req, res) {
  if (isSetup()) { return res.json(400, 'Not Found'); }
  return res.render('./setup/setup.html');
};

exports.setup = function(req, res) {
  var newUser = new User(req.body);
  console.log(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);

    var setup = new Settings({
    	isSetup: true
    });
    setup.save(function(err) {
    	if (err) return res.json(400, err);
    	return res.json(200);
    });
  });
};

function isSetup() {
	Settings.findOne(function(err, res) {
		if (err || !res) { return flag = false; }
		if (res && res.isSetup !== true) { return flag = false; }
		else {
			return flag = true;
		}
	});
	return flag;
}