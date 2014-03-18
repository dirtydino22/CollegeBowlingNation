(function() {
    'use strict';
    var User = require('../models/user');

    exports.list = function(req, res) {
        User.find(function(err, users) {
            if (!err) {
                return res.json(users);
            } else {
                return res.json('Error retrieving users.');
            }
        });
    };
    exports.updatePassword = function(req, res) {
        var id = req.params.userId;
        var password = req.body.password;
        if (id) {
            User.findById(id, function(err, user) {
                user.setPassword(password, function() {
                    user.save(function(err) {
                        if (!err) {
                            console.log('Password Updated.');
                        } else {
                            console.log('Error updating password.');
                        }
                    });

                });
            });
        } else {
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
                if (err) {
                    return res.json(err);
                } else {
                    return res.json('User removed.');
                }
            });
        });
    };
}());