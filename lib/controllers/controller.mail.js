(function() {
    'use strict';
    var nodemailer = require('nodemailer');
    var User = require('../models/user');
    /**
     * Mail Controller
     */
    // route to Dr. Brown
    exports.send = function(req, res) {
        function returnResponse() {
            res.json(true);
        }
        var smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'Gmail',
            auth: {
                user: 'collegebowlinginfo@gmail.com',
                pass: 'dlwozgndttsjaifw'
            }
        });
        var mailOptions = {
            from: "College Bowling Nation ✔ <collegebowlinginfo@gmail.com>", // sender address
            to: "collegebowlinginfo@gmail.com", // list of receivers
            subject: "Contact Form - " + req.body.name + " " + req.body.email + "✔", // Subject line
            html: '<p>' + req.body.message + '</p>' // html body
        };
        smtpTransport.sendMail(mailOptions, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log('Message Sent.');
                returnResponse();
            }
            smtpTransport.close();
        });
    };

    exports.sendToCoach = function(req, res) {
        function returnResponse() {
            res.json(true);
        }

        User.find({email: req.body.coachToContact}, function(err, user) {
            if (!err) {
                var smtpTransport = nodemailer.createTransport('SMTP', {
                    service: 'Gmail',
                    auth: {
                        user: 'collegebowlinginfo@gmail.com',
                        pass: 'dlwozgndttsjaifw'
                    }
                });
                var mailOptions = {
                    from: "College Bowling Nation ✔ <collegebowlinginfo@gmail.com>", // sender address
                    to: req.body.coachToContact, // list of receivers
                    subject: "Prospect Form ✔ ", // Subject line
                    html: '<p>' + req.body.message + '</p>' // html body
                };
                smtpTransport.sendMail(mailOptions, function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Message Sent.');
                        returnResponse();
                    }
                    smtpTransport.close();
                });
            }
            else {
                console.log('Cant find user');
            }
        });
    };
}).call(this);