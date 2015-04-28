'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var authTypes = ['github', 'twitter', 'facebook', 'google'];

var GameSchema = new Schema({
  createdOn: {
    type: Date,
    default: Date.now
  },
  firstBallCount: {type: Number, default: 0},
  averageFirstBallCount: {type: Number, default: 0},
  rollCount: {type: Number, default: 0},
  strikes: {type: Number, default: 0},
  spares: {type: Number, default: 0},
  sparePercentage: {type: Number, default: 0},
  strikePercentage: {type: Number, default: 0},
  score: {type: Number, default: 0},
  nineCount: {type: Number, default: 0},
  nineMade: {type: Number, default: 0},
  worth: {type: Number, default: 0},
  pinTotal: { type: Number, default: 0 }
});

var BowlerSchema = new Schema({
  name: { type: String },
  games: [GameSchema],
  stats: {
    firstBallCount: {type: Number, default: 0},
    averageFirstBallCount: {type: Number, default: 0},
    gamesPlayed: {type: Number, default: 0},
    tenpinGamesPlayed: {type: Number, default: 0},
    bakerGamesPlayed: {type: Number, default: 0},
    average: { type: Number, default: 0},
    tenpinAverage: {type: Number, default: 0 },
    strikes: { type: Number, default: 0},
    strikePercentage: { type: Number, default: 0},
    spares: { type: Number, default: 0},
    sparePercentage: { type: Number, default: 0},
    pinTotal: { type: Number, default: 0 },
    rollCount: { type: Number, default: 0},
    score: { type: Number, default: 0}
  }
});

var UserSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  roster: [BowlerSchema],
  university: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  teamStats: {
    gamesPlayed: {type: Number, default: 0 },
    firstBallCount: {type: Number, default: 0 },
    averageFirstBallCount: {type: Number, default: 0},
    tenpinGamesPlayed: {type: Number, default: 0},
    bakerGamesPlayed: {type: Number, default: 0},
    average: {type: Number, default: 0 },
    tenpinAverage: {type: Number, default: 0 },
    bakerAverage: {type: Number, default: 0 },
    strikePercentage: { type: Number, default: 0},
    sparePercentage: { type: Number, default: 0},
    pinTotal: { type: Number, default: 0 },
    strikes: {type: Number, default: 0},
    spares: {type: Number, default: 0},
    score: {type: Number, default: 0}
  }
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role,
      'university': this.university
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
