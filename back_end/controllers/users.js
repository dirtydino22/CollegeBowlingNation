'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    History = mongoose.model('History'),
    passport = require('passport');
/**
 * Get list of users.
 */
exports.list = function(req, res) {
  User.find(function(err, users) {
    if (err) {return res.json(400, err);}
    // don't show hashedPassword or salt
    users.forEach(function(user) {
      user.hashedPassword = false;
      user.salt = false;
    });
    return res.json(200, users);
  });
};

exports.updateSocket = function(io, socket) {
  User.find(function(err, users) {
    if (err) {return socket.emit('error:nodata');}
    // don't show hashedPassword or salt
    users.forEach(function(user) {
      user.hashedPassword = false;
      user.salt = false;
    });
    return io.emit('users:update', users);
  });
};
/**
 * Handles user's forgot password.
 */
exports.forgotPassword = function(req, res) {
  var email = req.body.email;
  User.find({email: email}, function(err, user) {
    console.log(user);
    if (err || user.length === 0) {return res.json(400, email + ' is not a registered email.');}
    // send email reset link
    return res.json(200);
  });
};

/**
 * Create user's bowler
 */
exports.addBowler = function(req, res) {
  var id = req.params.id;
  User.findById(id, function(err, user) {
    if (err) {return res.json(400, err);}
    user.roster.push(req.body);
    user.save(function(err) {
      if (err) {return res.json(400, err);}
      return res.json(200);
    });
  });
};

exports.editBowler = function(req, res) {
  var id = req.params.id;
  var bowlerId = req.params.bowlerId;
  User.findById(id, function(err, user) {
    
    if (err) {return res.json(400, err);}

    for (var i = 0; i < user.roster.length; i++) {
      if (user.roster[i]._id == bowlerId) {
        user.roster[i].name = req.body.name;
      }
    }

    user.save(function(err) {
      if (err) {return res.json(400, err);}
      return res.json(200);
    });
  });
};
/**
 * Delete user's bowler
 */
exports.removeBowler = function(req, res) {
  var id = req.params.id;
  var bowlerId = req.params.bowlerId;

  User.findById(id, function(err, user) {
    if (err) {return res.json(400, err);}

    for (var i = 0; i < user.roster.length; i++) {
      if (user.roster[i]._id == bowlerId) {
        user.roster.splice(i, 1);
      }
    }

    user.save(function(err) {
      if (err) {return res.json(400, err);}
      return res.json(200);
    });
  });
};

exports.newGame = function(req, res) {
  var bowlerId = req.params.bowlerId,
      id = req.params.id,
      i;

  User.findById(id,
    function(err, user) {
      if (err) {return res.json(400, err);}
      for (i = 0; i < user.roster.length; i++) {
        if (user.roster[i]._id == bowlerId) {
          user.roster[i].games.push(req.body);
        }
      }
      user.save(function(err) {
        if (err) {return res.json(400, err);}
        return res.json(200);
      });
    });
};
/**
 * Get user roster
 */
exports.roster = function(req, res) {
  var id = req.params.id;
  User.findById(id, function(err, user) {
    if (err) {return res.json(400, err);}
    return res.json(200, user.roster);
  });
};

/**
 * Create new season. Old season is stored in historical model.
 */
exports.newSeason = function(req, res) {
  var id = req.params.id;
  var thisYear = new Date().getFullYear();

  User.findById(id, function(err, user) {
    if (err) {return res.json(400, err);}
      var model = new History({
        name: user.name,
        university: user.university,
        season: thisYear - 1 + '-' + thisYear,
        roster: user.roster
      });
      model.save(function(err) {
        if (err) {return res.json(400, err);}
        user.roster = [];
        user.save(function(err) {
          if (err) {return res.json(400, err);}
          return res.json(200);
        });
      });
  });
};

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);

    req.logIn(newUser, function(err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.params.id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);
  
  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
  
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

exports.remove = function(req, res) {
  var id = req.params.id;
  User.findById(id, function(err, user) {
    if (err) {return res.send(400);}
    user.remove(function(err) {
      if (err) {return res.send(400);}
      return res.send(200);
    });
  });
};

exports.updateAccount = function(req, res) {
  var id = req.params.id;
  var info = req.body;
  User.findById(id, function(err, user) {
    if (err) { return res.send(400); }
      user.name = info.name;
      user.email = info.email;
      user.university = info.university;
      user.save(function(err) {
        if (err) { return res.send(400); }
        return res.send(200);
      });
  });
};
