'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SetupSchema = new Schema({
    isSetup: {type: Boolean}
});

module.exports = mongoose.model('Setup', SetupSchema);