"use strict";

var mongoose = require('mongoose');
var matchSchema = new mongoose.Schema({
  winners: [{
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    earnings: Number
  }],
  matchNumber: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    "default": Date.now
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Match', matchSchema);