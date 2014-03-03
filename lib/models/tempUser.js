'use strict';
/**
 * Module Dependecies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * TempUser Schema
 */
var TempUserSchema = new Schema({
	username: {type: String},
	password: {type: String},
	firstName: {type: String},
	lastName: {type: String},
	address: {type: String},
	address2: {type: String},
	city: {type: String},
	state: {type: String},
	zipcode: {type: String},
	phone: {type: String},
	university: {type: String},
	email: {type: String}
});
// export model
module.exports = mongoose.model('TempUser', TempUserSchema);