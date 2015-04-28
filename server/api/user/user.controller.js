'use strict';

var crypto = require('crypto');
var async = require('async');
var User = require('./user.model');
var History = require('../history/history.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

var validationError = function(res, err) {
    return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
    User.find({}, '-salt -hashedPassword', function(err, users) {
        if (err) return res.send(500, err);
        res.json(200, users);
    });
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save(function(err, user) {
        if (err) return validationError(res, err);
        var token = jwt.sign({
            _id: user._id
        }, config.secrets.session, {
            expiresInMinutes: 60 * 5
        });
        res.json({
            token: token
        });
    });
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
    var userId = req.params.id;

    User.findById(userId, function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        res.json(user.profile);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err, user) {
        if (err) return res.send(500, err);
        return res.send(204);
    });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    User.findById(userId, function(err, user) {
        if (user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function(err) {
                if (err) return validationError(res, err);
                res.send(200);
            });
        } else {
            res.send(403);
        }
    });
};

/**
 * Handles user's forgot password.
 */
exports.forgotPassword = function(req, res) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({email: req.body.email}, function(err, user) {
                if (!user) return res.send(404);

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; //1hr

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var mailConfig = {
                    from: process.env.GMAIL_USER,
                    to: 'douglass.kiser@gmail.com',
                    subject: 'Reset Password',
                    text: 'http://' + req.headers.host + '/api/reset/' + token,
                    html: '<a href="http://' + req.headers.host + '/api/reset/' + token + '">Link to reset</a>'
                };

                transporter.sendMail(mailConfig, function(err, info) {
                    if (err) return res.send(500);
                    done(err, 'done');
                });
        }
    ],
    function(err) {
        if (err) return next(err);
        res.send(200);
    });
};

exports.updateAccount = function(req, res) {
    var updates = req.body;
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return res.send(400);
        }
        user.name = updates.name;
        user.email = updates.email;
        user.university = updates.university;
        user.save(function(err) {
            if (err) {
                return res.send(400);
            }
            return res.send(200);
        });
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
        if (err) return next(err);
        if (!user) return res.json(401);
        res.json(user);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

exports.updateSocket = function(socket) {
    User.find(function(err, users) {
        if (!!err) return socket.emit('error:nodata');
        return socket.emit('user:update', users);
    });
};

exports.updateRoster = function(socket, id) {
    User.findById(id, function(err, user) {
        if (!!err) return socket.emit('error:nodata');
        return socket.emit('roster:update', user.roster);
    });
};

exports.createBowler = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) return res.json(400);
        user.roster.push(req.body);
        user.save(function(err) {
            if (err) return res.json(400);
            return res.json(200);
        });
    });
};

exports.updateBowler = function(req, res) {
    User.findById(req.params.id, function(err, user) {

        if (err) return res.json(400);

        for (var i = 0; i < user.roster.length; i++) {
            if (user.roster[i]._id == req.params.bowlerId) {
                user.roster[i].name = req.body.name;
            }
        }

        user.save(function(err) {
            if (err) return res.json(400);
            return res.json(200);
        });
    });
};

exports.removeBowler = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) return res.json(400);

        for (var i = 0; i < user.roster.length; i++) {
            if (user.roster[i]._id == req.params.bowlerId) {
                user.roster.splice(i, 1);
            }
        }

        user.save(function(err) {
            if (err) return res.json(400);
            return res.json(200);
        });
    });
};

exports.addBowlerTenpinGame = function(req, res) {
    var bowler;
    User.findById(req.params.id, function(err, user) {
        if (err) return res.json(400);
        
        for (var i = 0; i < user.roster.length; i++) {
            if (user.roster[i]._id == req.params.bowlerId) {
                bowler = user.roster[i];
            }
        }
        // handle bowler's stats
        bowler.games.push(req.body);
        bowler.stats.gamesPlayed++;
        bowler.stats.score += req.body.score;
        bowler.stats.rollCount += req.body.rollCount;
        bowler.stats.tenpinGamesPlayed++;
        bowler.stats.firstBallCount += req.body.firstBallCount;
        bowler.stats.averageFirstBallCount = (bowler.stats.firstBallCount /(bowler.stats.gamesPlayed * 10));
        bowler.stats.spares += req.body.spares; 
        
        //if number of strikes is more than 10, return 10
        //req.body.strikes = (req.body.strikes === 10) ? (req.body.strikes - bowler.stats.spares) : req.body.strikes;
        //req.body.strikes = (req.body.strikes > 10) ? 10 : req.body.strikes;
        bowler.stats.strikes += (req.body.strikes - req.body.strikesToRemoveFromPercentage);
        
        //if no spares made, return 0
        bowler.stats.sparePercentage = (bowler.stats.spares === 0 || (10 - bowler.stats.strikes === 0)) ? 0 : ((bowler.stats.spares / ((bowler.stats.gamesPlayed * 10) - bowler.stats.strikes)) * 100); 
        bowler.stats.strikePercentage = (bowler.stats.strikes / (bowler.stats.gamesPlayed * 10)) * 100;
        bowler.stats.pinTotal += req.body.pinTotal;
        bowler.stats.average = (bowler.stats.score === 0 || bowler.stats.gamesPlayed === 0) ? 0 : bowler.stats.score / bowler.stats.gamesPlayed;
        
        //console.log('Bowler Average', bowler.stats.average)
        //console.log('Bowler Strikes', bowler.stats.strikes);
        //console.log('Bowler Spares', bowler.stats.spares);
        //console.log('Bowler SparePercentage', bowler.stats.sparePercentage);
        //console.log('Bowler StrikePercentage', bowler.stats.strikePercentage);
        //console.log('Bowler FirstBallAverage', bowler.stats.averageFirstBallCount);
        //***************************************************************************************************************************
        // handle team's stats
        user.teamStats.gamesPlayed++;
        user.teamStats.score += req.body.score;
        user.teamStats.rollCount += req.body.rollCount;
        user.teamStats.tenpinGamesPlayed++;
        user.teamStats.strikes += (req.body.strikes - req.body.strikesToRemoveFromPercentage);
        user.teamStats.spares += req.body.spares;
        user.teamStats.firstBallCount += req.body.firstBallCount;
        user.teamStats.averageFirstBallCount = (user.teamStats.firstBallCount / (user.teamStats.gamesPlayed * 10));
        user.teamStats.tenpinAverage = user.teamStats.score / user.teamStats.gamesPlayed;
        user.teamStats.pinTotal += req.body.pinTotal;
        user.teamStats.average = (user.teamStats.score === 0 || user.teamStats.gamesPlayed === 0) ? 0 : user.teamStats.score / user.teamStats.gamesPlayed;
        console.log('Score', user.teamStats.score);
        console.log('Games Played', user.teamStats.gamesPlayed);
        console.log('Team Average', user.teamStats.average);
        //user.teamStats.strikePercentage = user.teamStats.strikes / user.teamStats.rollCount;
        
        user.teamStats.strikePercentage = (user.teamStats.strikes / (user.teamStats.gamesPlayed * 10)) * 100;
        console.log("Team StrikePercentage", user.teamStats.strikePercentage)
        //user.teamStats.sparePercentage = user.teamStats.spares / (user.teamStats.rollCount - user.teamStats.strikes)
        
         user.teamStats.sparePercentage = (user.teamStats.spares === 0) ? 0 : user.teamStats.spares / (((user.teamStats.gamesPlayed * 10) - user.teamStats.strikes)) * 100;
         console.log('Team Strikes', user.teamStats.strikes);
         console.log('Team Spares', user.teamStats.spares);
         console.log('Team SparePercentage', user.teamStats.sparePercentage);
        
        user.teamStats.sparePercentage = 0;
        user.save(function(err) {
            
            if (err) return res.json(400);
            return res.json(user);
        });
    });
};

exports.addBakerGame = function(req, res) {
    
    User.findById(req.params.id, function(err, user) {
        if (err) return res.json(400);

        // handle bowlers' stats
        for (var i = 0; i < req.body.bowlers.length; i++) {
            for (var o = 0; o < user.roster.length; o++) {
                if (user.roster[o]._id === req.body.bowlers[i].id) {
                    user.roster[o].games.push(req.body.bowlers[i]);
                    user.roster[o].stats.gamesPlayed++;
                    user.roster[o].stats.bakerGamesPlayed++;
                    user.roster[o].stats.firstBallCount += req.body.bowlers[i].firstBallCount;
                    user.roster[o].stats.strikes += req.body.bowlers[i].strikes;
                    user.roster[o].stats.spares += req.body.bowlers[i].spares;
                    user.roster[o].stats.sparePercentage = (user.roster[o].stats.sparePercentage + req.body.bowlers[i].sparePercentage) / user.roster[o].stats.gamesPlayed;
                    user.roster[o].stats.strikePercentage = (user.roster[o].stats.strikePercentage + req.body.bowlers[i].strikePercentage) / user.roster[o].stats.gamesPlayed;
                    user.roster[o].stats.average = (user.roster[o].stats.average + req.body.bowlers[i].score) / 2;
                    user.roster[o].stats.averageFirstBallCount = (user.roster[o].stats.averageFirstBallCount + req.body.bowlers[i].firstBallCount) / 2;
                    user.roster[o].stats.bakerAverage = (user.roster[o].stats.tenpinAverage + req.body.bowlers[i].score) / 2;
                    user.roster[o].stats.pinTotal += req.body.bowlers[i].pinTotal;
                }
            }
        }

        // handle team stats
        user.teamStats.gamesPlayed++;
        user.teamStats.bakerGamesPlayed++;
        user.teamStats.average = (user.teamStats.average + req.body.score) / 2;
        user.teamStats.bakerAverage = (user.teamStats.bakerAverage + req.body.score) / 2;
        user.teamStats.pinTotal += req.body.pinTotal;
        user.teamStats.firstBallCount += req.body.firstBallCount;
        user.teamStats.averageFirstBallCount = (user.teamStats.averageFirstBallCount + req.body.firstBallCount) / 2;
        user.teamStats.strikePercentage = (user.teamStats.strikePercentage + req.body.strikePercentage) / user.teamStats.gamesPlayed;
        user.teamStats.sparePercentage = (user.teamStats.sparePercentage + req.body.sparePercentage) / user.teamStats.gamesPlayed;

        user.save(function(err) {
            if (err) return res.json(400);
            return res.json(user);
        });
    });
};

exports.roster = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) return res.json(400);
        return res.json(user.roster);
    });
};

exports.createNewSeason = function(req, res) {
    var thisYear = new Date().getFullYear();
    var bowlersToKeep = req.body;

    User.findById(req.params.id,
        function(err, user) {
            if (err) return res.json(400);
            var history = new History({
                name: user.name,
                university: user.university,
                season: (thisYear - 1) + '-' + thisYear,
                roster: user.roster
            });
            history.save(function(err) {
                if (err) return res.json(400);
                user.roster = bowlersToKeep;
                // remove bowlerstokeep stats
                user.teamStats = {
                    gamesPlayed: 0,
                    average: 0,
                    strikePercentage: 0,
                    sparePercentage: 0,
                    pinTotal: 0 
                };

                user.save(function(err) {
                    if (err) return res.json(400);
                    return res.json(200);
                });
            });
        });
};
