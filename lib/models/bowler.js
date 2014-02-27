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
	shots: {type: Number},
	firstBallCount: {type: Number},
	strikes: {type: Number},
	spares: {type: Number},
	nineCounts: {type: Number},
	nineMade: {type: Number}
});
/**
 * Bowler Schema
 */
var BowlerSchema = new Schema({
	name: {type: String},
	games: [GameSchema]
});
// export model
module.exports = mongoose.model('Bowler', BowlerSchema);