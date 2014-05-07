'use strict';
/**
 * Module Dependecies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
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
var HistoricalRoster = new Schema({
	university: {type: String},
	coach: {type: String},
	season: {type: String},
	roster: [BowlerSchema],
	createdOn: {type: Date, default: Date.now}
});

// export model
module.exports = mongoose.model('HistoricalRoster', HistoricalRoster);