'use strict';

var User = require('../user/user.model');
var Setup = require('./setup.model');

function isSetup() {
    Setup.findOne(function(err, res) {
        if (res.isSetup === true) return true;
    });
}

exports.index = function(req, res) {
    Setup.findOne(function(err, obj) {
        if (!!obj && obj.isSetup === true) return res.json('Not Found');
        return res.render('./setup.html');
    });  
};

exports.setup = function(req, res) {
    var newUser = new User(req.body);
    var setup = new Setup({
        isSetup: true
    });

    newUser.provider = 'local';
    newUser.role = 'admin';
    newUser.save(function(err) {
        if (!!err) return res.json(401, 'error saving new user');
    });
    setup.save(function(err) {
        if (!!err) return res.json(400, 'error saving setup');
        return res.json(200, 'Admin Setup Complete.');
    });
};
