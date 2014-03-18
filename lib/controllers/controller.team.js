(function() {
    'use strict';
    var Team = require('../models/team');
    /**
     * Team Controller
     */
    exports.teams = function(req, res) {
        Team.find(function(err, teams) {
            if (!err) {
                return res.json(teams);
            } else {
                return res.json('Error retrieving teams.');
            }
        });
    };

    exports.team = function(req, res) {
        var id = req.params.teamId;
        if (id) {
            Team.findById(id, function(err, team) {
                if (!err) {
                    return res.json(team);
                } else {
                    return res.json('Error retrieving team.');
                }
            });
        } else {
            return res.json('Team ID is required to retrieve team.');
        }
    };

    exports.createTeam = function(req, res) {
        var reqObj = req.body;
        var team = new Team({
            name: reqObj.name
            // add games
        });
        team.save(function(err) {
            if (!err) {
                return res.json(true);
            } else {
                return res.json(false);
            }
        });
        return res.jsonp(reqObj);
    };

    exports.updateTeam = function(req, res) {
        var id = req.params.teamId;
        if (id) {
            Team.findById(id, function(err, team) {
                if (!err) {
                    team.name = req.body.name;
                    team.save(function(err) {
                        if (!err) {
                            return res.json(true);
                        } else {
                            return res.json(false);
                        }
                    });
                } else {
                    res.json('Error updating team.');
                }
                return res.send(team);
            });
        } else {
            res.json('Team ID is required to retrieve team.');
        }
    };

    exports.deleteTeam = function(req, res) {
        var id = req.params.teamId;
        if (id) {
            Team.findById(id, function(err, team) {
                if (!err) {
                    team.remove(function(err) {
                        if (!err) {
                            return res.json(true);
                        } else {
                            return res.json(false);
                        }
                    });
                } else {
                    res.json('Error removing team.');
                }
            });
        } else {
            res.json('Team ID is required to remove team.');
        }
    };

}());