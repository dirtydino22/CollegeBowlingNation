'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var NewsSchema = new Schema({
	title: {
		type: String
	},
	createdOn: {
		type: Date,
		default: Date.now
	},
	author: {
		type: String
	},
	body: {
		type: String
	},
	lastUpdate: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('News', NewsSchema);