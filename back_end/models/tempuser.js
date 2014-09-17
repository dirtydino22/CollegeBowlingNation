'use strict';

 var mongoose = require('mongoose'),
 	 Schema = mongoose.Schema,
 	 crypto = require('crypto');

var authTypes = ['github', 'twitter', 'facebook', 'google'];

/**
 * TempUser Schema
 */
 var TempUserSchema = new Schema({
 	name: String,
  	email: { type: String, lowercase: true },
  	hashedPassword: String,
  	salt: String,
    university: String
 });
 /**
  * Virtuals
  */
TempUserSchema
	.virtual('password')
	.set(function(password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function() {
		return this._password;
	});

TempUserSchema
	.virtual('userInfo')
	.get(function() {
		return {
			'name': this.name,
			'provider': this.provider
		};
	});
TempUserSchema
	.virtual('profile')
	.get(function() {
		return {
			'name': this.name
		};
	});
/**
 * Validations
 */
 // Validate empty email
TempUserSchema
	.path('email')
	.validate(function(email) {
		// if you are authenticating by any of the oauth strategies, don't validate
    	if (authTypes.indexOf(this.provider) !== -1) return true;
    	return email.length;
	});
// Validate empty password
TempUserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
TempUserSchema
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
TempUserSchema
  .pre('save', function(next) {
    if (!this.isNew) {return next()};

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1) {
      next(new Error('Invalid password'));
    }
    else {
      console.log('Send Mail Here');
      next();
    }
  });

 TempUserSchema.methods = {
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

 module.exports = mongoose.model('TempUser', TempUserSchema);