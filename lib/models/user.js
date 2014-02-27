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
	firstName: {type: String},
	lastName: {type: String},
	address: {type: String},
	address2: {type: String},
	city: {type: String},
	state: {type: String},
	zipcode: {type: String},
	phone: {type: String},
	university: {type: String},
	email: {type: String},
	access: {type: String}
});
// use plugin to handle username and password
UserSchema.plugin(passportLocalMongoose);
// export model
module.exports = mongoose.model('User', UserSchema);