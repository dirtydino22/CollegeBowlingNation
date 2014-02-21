'use strict';
/**
 * Module Dependecies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Stats Schema
 */
var StatsSchema = new Schema({});
/**
 * Bowler Schema
 */
var BowlerSchema = new Schema({
	name: {type: String}
});
// export model
module.exports = mongoose.model('Team', BowlerSchema);