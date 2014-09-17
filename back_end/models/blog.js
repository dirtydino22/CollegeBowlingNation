'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	createdOn: {
		type: Date,
		default: Date.now
	},
	author: {
		type: String
	},
	body: {
		type: String
	}
});
/**
 * News Schema
 */
var BlogSchema = new Schema({
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
	},
	comments: [CommentSchema]
});

module.exports = mongoose.model('Blog', BlogSchema);