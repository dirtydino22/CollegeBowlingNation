(function() {
    'use strict';
    var nodemailer = require('nodemailer');
    var TempUser = require('../models/tempUser');
    var User = require('../models/user');
    /**
     * list
     * returns a list of tempUsers
     */
    exports.list = function(req, res) {
        TempUser.find(function(err, users) {
            if (!err) {
                return res.json(users);
            } else {
                return res.json('Error retrieving temp users.');
            }
        });
    };
    /**
     * register
     * creates a temp user then sends
     * verification email.
     */
    exports.register = function(req, res) {
        var reqObj = req.body;
        var tempUser = new TempUser({
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
            password: reqObj.password
        });
        tempUser.save(function(err, user) {
            if (err) {
                res.json(false);
            }
            if (user) {
                var id = user._id;

                /**
                 * Use for initial admin setup
                 */
                /*
					var smtpTransport = nodemailer.createTransport('SMTP', {
						service: 'Gmail',
						auth: {
							user: 'douglass.kiser@gmail.com',
							pass: 'enjgsdmfyicqkoqp'
						}
					});
					var mailOptions = {
						from: "College Bowling Nation ✔ <douglass.kiser@gmail.com>", // sender address
					    to: "douglass.kiser@gmail.com, dlkiser@moreheadstate.edu", // list of receivers
					    subject: "Registration Request ✔", // Subject line
					    html: '<b>I would like to register' + id + ' ✔</b><br><a href="http://192.168.0.100:3000/api/tempusers/' + id + '/accept/user">Accept User</a><br><a href="http://192.168.0.100:3000/api/tempusers/' + id + '/accept/admin">Accept Admin</a>><br><a href="http://192.168.0.100:3000/api/tempusers/' + id + '/decline">Decline User</a>' // html body
					};
					smtpTransport.sendMail(mailOptions, function(err, res) {
						if (err) {
							console.log(err);
						}
						else {
							console.log('Message Sent.');
						}
						smtpTransport.close();
					});
					
				}
				});
			*/

                /**
                 * Use After initial admin is added
                 */

                User.find({
                    access: 'admin'
                }, function(err, users) {
                    if (!err) {
                        var admins = [];
                        for (var i = 0; i < users.length; i++) {
                            admins.push(users[i].email);
                        }

                        var smtpTransport = nodemailer.createTransport('SMTP', {
                            service: 'Gmail',
                            auth: {
                                user: 'douglass.kiser@gmail.com',
                                pass: 'enjgsdmfyicqkoqp'
                            }
                        });
                        var mailOptions = {
                            from: "College Bowling Nation ✔ <douglass.kiser@gmail.com>", // sender address
                            to: admins.toString(),
                            subject: "Registration Request ✔", // Subject line
                            html: '<b>I would like to register' + id + ' ✔</b><br><a href="http://192.168.0.100:3000/api/tempusers/' + id + '/accept/user">Accept User</a><br><a href="http://192.168.0.100:3000/api/tempusers/' + id + '/accept/admin">Accept Admin</a>><br><a href="http://192.168.0.100:3000/api/tempusers/' + id + '/decline">Decline User</a>' // html body
                        };
                        smtpTransport.sendMail(mailOptions, function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Message Sent.');
                            }
                            smtpTransport.close();
                        });

                    }

                });

            }
        });

    };
    /**
     * accept
     * accepts a user and sets user access
     */
    exports.accept = function(req, res) {
        var id = req.params.id;
        var access = req.params.access;

        TempUser.findById(id, function(err, user) {
            if (!err) {
                User.register(new User({
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        address: user.address,
                        address2: user.address2,
                        city: user.city,
                        state: user.state,
                        zipcode: user.zipcode,
                        phone: user.phone,
                        university: user.university,
                        email: user.email,
                        access: access
                    }),
                    user.password,
                    function(err) {
                        if (err) {
                            console.log('Registration Error:', err);
                            return res.redirect('/');
                        } else {
                            user.remove(function(err) {
                                var smtpTransport = nodemailer.createTransport('SMTP', {
                                    service: 'Gmail',
                                    auth: {
                                        user: 'douglass.kiser@gmail.com',
                                        pass: 'enjgsdmfyicqkoqp'
                                    }
                                });
                                var mailOptions = {
                                    from: "College Bowling Nation ✔ <douglass.kiser@gmail.com>", // sender address
                                    to: user.email, // list of receivers
                                    subject: "Registration Accepted ✔", // Subject line
                                    html: '<b>Your registration was accepted!!!</b>' // html body
                                };
                                smtpTransport.sendMail(mailOptions, function(err, res) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('Message Sent to user.');
                                    }
                                    smtpTransport.close();
                                });
                                res.json('User Accepted.');
                            });
                        }
                    });

            } else {
                res.json('Error finding user.');
            }

        });

    };
    /**
     * accept
     * declines a user and deletes tempUser
     */
    exports.decline = function(req, res) {
        var id = req.params.id;
        if (id) {
            TempUser.findById(id, function(err, user) {
                if (!err) {
                    user.remove(function(err) {
                        if (!err) {
                            return res.json(true);
                        } else {
                            return res.json(false);
                        }
                    });
                } else {
                    res.json('Error finding user.');
                }
            });
        } else {
            res.json('TempUser ID is required to decline.');
        }
    };
}());