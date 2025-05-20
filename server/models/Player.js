const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  topThreeFinishes: {
    type: Number,
    default: 0
  },
  lastPlaceFinishes: {
    type: Number,
    default: 0
  },
  averageEarning: {
    type: Number,
    default: 0
  },
  matchHistory: [{
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match'
    },
    earnings: Number,
    position: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema); 