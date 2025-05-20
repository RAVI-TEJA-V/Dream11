const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Player = require('../models/Player');

// Get all matches
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('winners.playerId', 'name')
      .sort({ matchNumber: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new match
router.post('/', async (req, res) => {
  const session = await Match.startSession();
  session.startTransaction();

  try {
    const { winners } = req.body;
    
    // Create new match
    const match = new Match({
      winners: winners.map(winner => ({
        playerId: winner.playerId,
        earnings: winner.earnings
      })),
      matchNumber: (await Match.countDocuments()) + 1
    });

    await match.save({ session });

    // Update player stats
    for (const winner of winners) {
      const player = await Player.findById(winner.playerId);
      if (player) {
        player.totalEarnings += winner.earnings;
        
        // Update wins (if earnings > 0)
        if (winner.earnings >= 50) {
          player.wins += 1;
        }

        // Update top 3 finishes (if earnings > 0)
        if (winner.earnings > 0) {
          player.topThreeFinishes += 1;
        }

        // Update last place finishes (if earnings < -20)
        if (winner.earnings < -20) {
          player.lastPlaceFinishes += 1;
        }

        player.matchHistory.push({
          matchId: match._id,
          earnings: winner.earnings,
          position: winner.earnings > 0 ? 1 : (winner.earnings < -20 ? -1 : 0)
        });
        
        // Calculate average earnings
        const totalMatches = player.matchHistory.length;
        player.averageEarning = player.totalEarnings / totalMatches;
        
        await player.save({ session });
      }
    }

    await session.commitTransaction();
    res.status(201).json(match);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router; 