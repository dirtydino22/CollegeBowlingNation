'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * News Schema
 */
var SettingsSchema = new Schema({
	isSetup: {type: Boolean}
});

module.exports = mongoose.model('Settings', SettingsSchema);