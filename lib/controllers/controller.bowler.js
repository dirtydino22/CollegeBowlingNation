(function() {
    'use strict';
    var Bowler = require('../models/bowler');
    /**
     * Bowler Controller
     */
    exports.bowlers = function(req, res) {
        Bowler.find(function(err, bowlers) {
            if (!err) {
                return res.json(bowlers);
            } else {
                return res.json('Error retrieving bowlers.');
            }
        });
    };

    exports.bowler = function(req, res) {
        var id = req.params.bowlerId;
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
    };

    exports.createBowler = function(req, res) {
        var reqObj = req.body;
        var bowler = new Bowler({
            name: reqObj.name
            // add games
        });
        bowler.save(function(err) {
            if (!err) {
                res.json(true);
            } else {
                res.json(false);
            }
        });
        return res.jsonp(reqObj);
    };

    exports.updateBowler = function(req, res) {
        var id = req.params.bowlerId;
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
    };

    exports.deleteBowler = function(req, res) {
        var id = req.params.bowlerId;
        if (id) {
            Bowler.findById(id, function(err, bowler) {
                if (!err) {
                    bowler.remove(function(err) {
                        if (!err) {
                            return res.json(true);
                        } else {
                            return res.json(false);
                        }
                    });
                } else {
                    res.json('Error removing bowler.');
                }
            });
        } else {
            res.json('Bowler ID is required to remove bowler.');
        }
    };

    exports.newGame = function(req, res) {
        var id = req.params.bowlerId;
        if (id) {
            Bowler.findById(id, function(err, bowler) {
                if (!err) {
                    bowler.games.push(req.body.game);
                    bowler.save(function(err) {
                        if (!err) {
                            res.json(true);
                        } else {
                            res.json(false);
                        }
                    });
                }
            });
        } else {
            res.json('Bowler ID is required to find bowler.');
        }
    };
}());