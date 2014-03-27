'use strict';
/**
 * Module Dependecies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Team Schema
 */
var NewsSchema = new Schema({
	author: {type: String},
	title: {type: String},
	body: {type: String},
	createdOn: {type: Date, default: Date.now}
});
// export model
module.exports = mongoose.model('News', NewsSchema);