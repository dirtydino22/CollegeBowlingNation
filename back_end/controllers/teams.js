'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.getTeam = function(req, res) {
	university = req.params.university;
	User.find({university: university}, function(err, team) {
		if (err) { return res.send(403); }
		console.log(team);
		res.json(200, team);
	});
};

exports.getTeams = function(req, res) {
	var teams = [];

	User.find(function(err, users) {
		if (err) { return res.send(403); }

		for (var i = 0; i < users.length; i++) {
			teams.push({
				university: users[i].university,
				roster: users[i].roster
			});
		}

		return res.json(200, teams);
	});
};

exports.getPlayers = function(req, res) {
	var teams = [], players;

	User.find(function(err, users) {
		if (err) { return res.send(403); }

		for (var i = 0; i < users.length; i++) {
			teams.push({
				university: users[i].university,
				roster: users[i].roster
			});
		}
		players = getPlayersFromTeams(teams);
		return res.json(200, players);
	});
};

exports.getTeamPlayers = function(req, res) {
  var teams = [], players;
  var teamName = req.params.teamName;

  User.find(function(err, users) {
    if (err) { return res.send(403); }

    for (var i = 0; i < users.length; i++) {
      teams.push({
        university: users[i].university,
        roster: users[i].roster
      });
    }
    players = getPlayersFromTeams(teams);
    return res.json(200, players[teamName]);
  });
};

exports.getGames = function(req, res) {
	var teams = [], players, games;

	User.find(function(err, users) {
		if (err) { return res.send(403); }

		for (var i = 0; i < users.length; i++) {
			teams.push({
				university: users[i].university,
				roster: users[i].roster
			});
		}
		players = getPlayersFromTeams(teams);
		games = getGamesFromPlayers(players);
		return res.json(200, analyzeGames(games));
	});
};

exports.updateSocket = function(io, socket) {
  var teams = [], players, games, analyzed;

  User.find(function(err, users) {
    if (err) { return socket.emit('error:nodata'); }

    for (var i = 0; i < users.length; i++) {
      teams.push({
        university: users[i].university,
        roster: users[i].roster
      });
    }
    players = getPlayersFromTeams(teams);
    games = getGamesFromPlayers(players);
    analyzed = analyzeGames(games);

    return io.emit('games:update', analyzed);
  });
};

function getPlayersFromTeams(data) {
  var players = {};
  for (var i = 0; i < data.length; i++) {
    for (var o = 0; o < data[i].roster.length; o++) {
      if (!players.hasOwnProperty(data[i].university)) {
        players[data[i].university] = {
          name: data[i].university,
          players: [data[i].roster[o]]
        };
      } else {
        players[data[i].university].players.push(data[i].roster[o]);
      }
    }
  }
  return players;
}

function getGamesFromPlayers(data) {
  var games = {};
  for (var university in data) {
    for (var i = 0; i < data[university].players.length; i++) {
      if (!games.hasOwnProperty(university)) {
        games[university] = {
          name: university,
          games: data[university].players[i].games
        };
      } else {
        for (var o = 0; o < data[university].players[i].games.length; o++) {
          games[university].games.push(data[university].players[i].games[o]);
        }
      }
    }
  }
  return games;
}

function analyzeGames(data) {
  var scores = {}, returnArr = [], model;
  for (var key in data) {
    model = {
      pinCount: 0,
      rollCount: 0,
      gutterBalls: 0,
      strikes: 0,
      spares: 0,
      strikePercentage: 0,
      sparePercentage: 0,
      name: undefined,
      gamesPlayed: 0,
      nineMade: 0,
      nineCount: 0
    };

    if (data[key].games.length > 1) {
    	for (var i = 0; i < data[key].games.length; i++) {
    		model.pinCount += data[key].games[i].pinCount;
    		model.rollCount += data[key].games[i].rollCount;
    		model.gutterBalls += data[key].games[i].gutterBalls;
    		model.strikes += data[key].games[i].strikes;
    		model.spares += data[key].games[i].spares;
    		model.sparePercentage += data[key].games[i].sparePercentage;
    		model.strikePercentage += data[key].games[i].strikePercentage;
    		model.nineCount += data[key].games[i].nineCount;
    		model.nineMade += data[key].games[i].nineMade;
    		model.gamesPlayed += data[key].games[i].worth;
    		model.name = data[key].name;
    	}
    	model.strikePercentage = Math.round(model.strikePercentage / model.gamesPlayed) / 100;
    	model.sparePercentage = Math.round(model.sparePercentage / model.gamesPlayed) / 100;

    	scores[key] = model;
    }
    else {
    	model.pinCount += data[key].games[0].pinCount;
    		model.rollCount += data[key].games[0].rollCount;
    		model.gutterBalls += data[key].games[0].gutterBalls;
    		model.strikes += data[key].games[0].strikes;
    		model.spares += data[key].games[0].spares;
    		model.sparePercentage += Math.round(data[key].games[0].sparePercentage) / 100;
    		model.strikePercentage += Math.round(data[key].games[0].strikePercentage) / 100;
    		model.nineCount += data[key].games[0].nineCount;
    		model.nineMade += data[key].games[0].nineMade;
    		model.name = data[key].name;
    		model.gamesPlayed = 1;

    		scores[key] = model;
    }
  }
  
  for (var key in scores) {
  	returnArr.push(scores[key]);
  }

  return returnArr;
}