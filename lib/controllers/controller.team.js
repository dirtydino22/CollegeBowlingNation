(function() {
    'use strict';
    var User = require('../models/user');
    var jwt = require('jwt-simple');
    var payload = { access: 'api' };
    var secret = 'cbn';
    var token = jwt.encode(payload, secret);
    /**
     * Team Controller
     */
    exports.teams = function(req, res) {
        var userArr = [];
        var teamArr = [];
        var t = [];
        if (req.params.token === token) {

            User.find(function(err, users) {
                if (!err) {
                    for (var i = 0; i < users.length; i++) {
                        userArr.push(users);
                    }
                    for (var o = 0; o < userArr.length; o++) {
                        teamArr.push(userArr[0][o]);
                    }
                    for (var z = 0; z < teamArr.length; z++) {
                        t.push({
                            university: teamArr[z].university,
                            roster: teamArr[z].roster
                        });
                    }
                    return res.json(t);
                }
            });
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };

    exports.team = function(req, res) {
        var university = req.params.university;
        var userArr = [];
        var teamArr = [];
        var t = [];
        if (req.params.token === token) {
            User.find(function(err, users) {
                if (!err) {
                    for (var i = 0; i < users.length; i++) {
                        userArr.push(users);
                    }
                    for (var o = 0; o < userArr.length; o++) {
                        teamArr.push(userArr[0][o]);
                    }
                    for (var z = 0; z < teamArr.length; z++) {
                        if (teamArr[z].university === university) {
                            t.push({
                                university: teamArr[z].university,
                                roster: teamArr[z].roster
                            });
                        }
                    }
                    return res.json(t);
                }
            });
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };
}).call(this);