const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
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
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Match', matchSchema); 