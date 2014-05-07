(function() {
    'use strict';
    var User = require('../models/user');
    var jwt = require('jwt-simple');
    var payload = { access: 'api' };
    var secret = 'cbn';
    var token = jwt.encode(payload, secret);

    /**
     * Bowler Controller
     */
    exports.bowlers = function(req, res) {
        var id = req.params.id;
        if (req.params.token === token) {
            User.findById(id, function(err, user) {
                if (!err) {
                    if (user) {
                        return res.json(user.roster);
                    }
                    return res.json(false);
                }
                return res.json(false);
            });
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };

    /*
    exports.bowler = function(req, res) {
        var id = req.params.bowlerId;
        if (req.params.token === token) {
            if (id) {
                Bowler.findById(id, function(err, bowler) {
                    if (!err) {
                        return res.json(bowlers);
                    } else {
                        return res.json('Error retrieving bowlers.');
                    }
                });
            } else {
                res.json('Bowler ID is required to retrieve bowler.');
            }
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };
    */
    exports.createBowler = function(req, res) {
        var id = req.params.id;
        var reqObj = req.body;
        var bowler = {
            name: reqObj.name,
            university: reqObj.university
        };
        if (req.params.token === token) {
            User.findById(id, function(err, user) {
                console.log(user);
                user.roster.push(bowler);
                user.save(function(err) {
                    if (!err) {
                        return res.json(true);
                    }
                    else {
                        return res.json(false);
                    }
                });
            });
        }
        else {
            return res.json('Unauthorized Access.');
        }
        
    };
    /*
    exports.updateBowler = function(req, res) {
        var id = req.params.bowlerId;
        if (req.params.token === token) {
            if (id) {
                Bowler.findById(id, function(err, bowler) {
                    if (!err) {
                        bowler.name = req.body.name;
                        bowler.save(function(err) {
                            if (!err) {
                                res.json(true);
                            } else {
                                res.json(false);
                            }
                        });
                    } else {
                        res.json('Error updating bowler.');
                    }
                    return res.send(bowler);
                });
            } else {
                res.json('Bowler ID is required to retrieve bowler.');
            }
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };
    */
    exports.newGame = function(req, res) {
        var bowlerId = req.params.bowlerId;
        var id = req.params.id;
        if (req.params.token === token) {

            User.findById(id, function(err, user) {
                var roster = user.roster;
                if (roster) {
                    for (var i = 0; i < roster.length; i++) {
                        if (roster[i].id === bowlerId) {
                            roster[i].games.push(req.body.game);
                        }
                    }
                    user.save(function(err) {
                        if (!err) {
                            console.log('game added.');
                            return res.json(true);
                        }
                        return res.json(false);
                    });
                }
            });
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };

}());