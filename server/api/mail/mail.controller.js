'use strict';

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'collegebowlinginfo@gmail.com',
        pass: 'dlwozgndttsjaifw'
    }
});

exports.contact = function(req, res) {
    var mailConfig = {
        from: process.env.GMAIL_USER,
        to: 'douglass.kiser@gmail.com',
        subject: 'Contact Form',
        text: req.body.message,
        html: '<p>' + req.body.message + '</p>'
    };
    transporter.sendMail(mailConfig, function(err, info) {
        if (err) return res.send(500);
        console.log('Message Send: ' + info.response);
        return res.send(200);
    });
};
