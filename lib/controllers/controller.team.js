(function() {
    'use strict';
    var Bowler = require('../models/bowler');
    /**
     * Team Controller
     */
    exports.teams = function(req, res) {
        Bowler.find(null, null, {sort: {university:1}}, function(err, bowlers) {
            if (!err) {
                return res.json(bowlers);
            } else {
                return res.json('Error retrieving teams.');
            }
        });
    };

    exports.team = function(req, res) {
        Bowler.find({university: req.params.university}, function(err, bowlers) {
            if (!err) {
                return res.json(bowlers);
            } else {
                return res.json('Error retrieving team.');
            }
        });
    };
}).call(this);