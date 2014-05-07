'use strict';
/**
 * Module Dependecies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');
/**
 * Game Schema 
 */
var GameSchema = new Schema({
	date: {type: Date, default: Date.now},
	pinCount: {type: Number},
	rollCount: {type: Number},
	gutterBalls: {type: Number},
	strikes: {type: Number},
	spares: {type: Number},
	sparePercentage: {type: Number},
	strikePercentage: {type: Number},
	score: {type: Number},
	nineCount: {type: Number},
	nineMade: {type: Number}
});
/**
 * Bowler Schema
 */
var BowlerSchema = new Schema({
	name: {type: String},
	university: {type: String},
	games: [GameSchema]
});
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
	access: {type: String},
	roster: [BowlerSchema]
});
// use plugin to handle username and password
UserSchema.plugin(passportLocalMongoose);
// export model
module.exports = mongoose.model('User', UserSchema);