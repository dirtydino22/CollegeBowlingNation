'use strict';

var User = require('../user/user.model');

exports.index = function(req, res) {
    var teams = [];

    User.find(function(err, users) {
       if (!!err) return res.send(403);

       for (var i = 0; i < users.length; i++) {
           teams.push({
                university: users[i].university,
                roster: users[i].roster,
                teamStats: users[i].teamStats
           });
       }

       return res.json(teams);
    });
};

exports.getUniversity = function(req, res) {
    User.find({university: req.params.university}, function(err, user) {
         if (!!err) return res.send(403);
         return res.json(200, user);
    });
};

exports.updateSocket = function(socket) {
  var teams = [];

    User.find(function(err, users) {
       if (!!err) return res.send(403);

       for (var i = 0; i < users.length; i++) {
           teams.push({
                university: users[i].university,
                roster: users[i].roster,
                teamStats: users[i].teamStats
           });
       }
       socket.broadcast.emit('team:update', teams);
       socket.emit('team:update', teams);   
    });
};
