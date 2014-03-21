'use strict';
/**
 * Module Dependecies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Stats Schema
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
	score: {type: Number}
});
/**
 * Bowler Schema
 */
var BowlerSchema = new Schema({
	name: {type: String},
	university: {type: String},
	games: [GameSchema]
});
// export model
module.exports = mongoose.model('Bowler', BowlerSchema);