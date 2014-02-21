'use strict';
/**
 * Module Dependecies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');
/**
 * User Schema
 */
var UserSchema = new Schema({
	email: {type: String},
	access: {type: String}
});
// use plugin to handle username and password
UserSchema.plugin(passportLocalMongoose);
// export model
module.exports = mongoose.model('User', UserSchema);