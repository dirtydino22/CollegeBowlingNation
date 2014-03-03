'use strict';
var Team = require('../models/team');
/**
 * Team Controller
 */
exports.teams = function(req, res) {
	Team.find(function(err, teams) {
		(!err) ? res.json(teams) : res.json('Error retrieving teams.');
	});
};

exports.team = function(req, res) {
	var id = req.params.teamId;
	if (id) {
		Team.findById(id, function(err, team) {
			(!err) ? res.json(team) : res.json('Error retrieving team.');
		});
	}
	else {
		res.json('Team ID is required to retrieve team.');
	}
};

exports.createTeam = function(req, res) {
	var reqObj = req.body;
	var team = new Team({
		name: reqObj.name
		// add games
	});
	team.save(function(err) {
		(!err) ? res.json(true) : res.json(false);
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
					(!err) ? res.json(true) : res.json(false);
				});
			}
			else {
				res.json('Error updating team.');
			}
			return res.send(team);
		});
	}
	else {
		res.json('Team ID is required to retrieve team.');
	}
};

exports.deleteTeam = function(req, res) {
	var id = req.params.teamId;
	if (id) {
		Team.findById(id, function(err, team) {
			if (!err) {
				team.remove(function(err) {
					(!err) ? res.json(true) : res.json(false);
				});
			}
			else {
				res.json('Error removing team.');
			}
		});
	}
	else {
		res.json('Team ID is required to remove team.');
	}
};
