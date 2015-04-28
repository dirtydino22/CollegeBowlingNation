'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
  createdOn: {
    type: Date,
    default: Date.now
  },
  pinCount: { type: Number },
  rollCount: { type: Number },
  gutterBalls: { type: Number },
  strikes: { type: Number },
  spares: { type: Number },
  sparePercentage: { type: Number },
  strikePercentage: { type: Number },
  score: { type: Number },
  nineCount: { type: Number },
  nineMade: { type: Number },
  worth: { type: Number }
});
/**
 * Bowler Schema
 */
var BowlerSchema = new Schema({
  name: { type: String },
  games: [GameSchema]
});
/**
 * User Schema
 */
var HistorySchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  university: String,
  season: String,
  roster: [BowlerSchema]
});

module.exports = mongoose.model('History', HistorySchema);