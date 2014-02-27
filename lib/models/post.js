'use strict';
/**
 * Module Dependecies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Reply Schema
 */
var ReplySchema = new Schema({
	author: {type: String},
	body: {type: String},
	createdOn: {
		type: Date,
		default: Date.now
	}
});
/**
 * Post Schema
 */
var PostSchema = new Schema({
	title: {type: String},
	author: {type: String},
	body: {type: String},
	createdOn: {
		type: Date,
		default: Date.now
	},
	replies: [ReplySchema]
});
// export module
module.exports = mongoose.model('Post', PostSchema);