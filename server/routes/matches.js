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
    const { winners, matchName } = req.body;
    
    // Create new match
    const match = new Match({
      matchName: matchName || `Match ${(await Match.countDocuments()) + 1}`,
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

// Add multiple matches
router.post('/bulk', async (req, res) => {
  const session = await Match.startSession();
  session.startTransaction();

  try {
    const { matches } = req.body;
    const results = [];
    const baseMatchNumber = await Match.countDocuments();

    // First, validate all matches data
    if (!Array.isArray(matches)) {
      throw new Error('Matches must be an array');
    }

    // Create a map to batch player updates
    const playerUpdates = new Map();

    for (const [index, matchData] of matches.entries()) {
      const { winners, matchName } = matchData;

      if (!Array.isArray(winners)) {
        throw new Error(`Invalid winners array in match ${index + 1}`);
      }

      // Create new match
      const match = new Match({
        matchName: matchName || `Match ${baseMatchNumber + index + 1}`,
        winners: winners.map(winner => ({
          playerId: winner.playerId,
          earnings: Number(winner.earnings) // Ensure earnings is a number
        })),
        matchNumber: baseMatchNumber + index + 1
      });

      await match.save({ session });
      results.push(match);

      // Collect player updates
      for (const winner of winners) {
        const playerId = winner.playerId;
        const earnings = Number(winner.earnings);

        if (!playerUpdates.has(playerId)) {
          playerUpdates.set(playerId, {
            totalEarningsChange: 0,
            winsChange: 0,
            topThreeFinishesChange: 0,
            lastPlaceFinishesChange: 0,
            matchHistoryAdditions: []
          });
        }

        const playerUpdate = playerUpdates.get(playerId);
        playerUpdate.totalEarningsChange += earnings;
        
        // Update wins (if earnings > 0)
        if (earnings >= 50) {
          playerUpdate.winsChange += 1;
        }

        // Update top 3 finishes (if earnings > 0)
        if (earnings > 0) {
          playerUpdate.topThreeFinishesChange += 1;
        }

        // Update last place finishes (if earnings < -20)
        if (earnings < -20) {
          playerUpdate.lastPlaceFinishesChange += 1;
        }

        playerUpdate.matchHistoryAdditions.push({
          matchId: match._id,
          earnings: earnings,
          position: earnings > 0 ? 1 : (earnings < -20 ? -1 : 0)
        });
      }
    }

    // Apply all player updates in batch
    for (const [playerId, updates] of playerUpdates) {
      const player = await Player.findById(playerId).session(session);
      if (!player) {
        throw new Error(`Player not found with ID: ${playerId}`);
      }

      player.totalEarnings += updates.totalEarningsChange;
      player.wins += updates.winsChange;
      player.topThreeFinishes += updates.topThreeFinishesChange;
      player.lastPlaceFinishes += updates.lastPlaceFinishesChange;
      player.matchHistory.push(...updates.matchHistoryAdditions);

      // Recalculate average earnings
      const totalMatches = player.matchHistory.length;
      player.averageEarning = player.totalEarnings / totalMatches;

      await player.save({ session });
    }

    await session.commitTransaction();
    res.status(201).json({
      message: 'Bulk update successful',
      matchesCreated: results.length,
      playersUpdated: playerUpdates.size,
      matches: results
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ 
      message: 'Bulk update failed',
      error: err.message 
    });
  } finally {
    session.endSession();
  }
});

// Reset all matches and player stats
router.delete('/reset', async (req, res) => {
  const session = await Match.startSession();
  session.startTransaction();

  try {
    // Delete all matches
    await Match.deleteMany({}, { session });

    // Reset all player stats
    const players = await Player.find();
    for (const player of players) {
      player.totalEarnings = 0;
      player.wins = 0;
      player.topThreeFinishes = 0;
      player.lastPlaceFinishes = 0;
      player.averageEarning = 0;
      player.matchHistory = [];
      await player.save({ session });
    }

    await session.commitTransaction();
    res.json({ message: 'All matches and player stats have been reset successfully' });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

// Delete match by name and update player stats
router.delete('/name/:matchName', async (req, res) => {
    try {
        const { matchName } = req.params;
        
        // Find the match
        const match = await Match.findOne({ matchName: matchName });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Update player stats for each winner
        for (const winner of match.winners) {
            const player = await Player.findById(winner.playerId._id);
            if (player) {
                // Remove the match from player's match history
                player.matchHistory = player.matchHistory.filter(
                    m => m.matchId.toString() !== match._id.toString()
                );

                // Recalculate player stats
                player.wins = player.matchHistory.filter(m => m.position === 1).length;
                player.topThreeFinishes = player.matchHistory.filter(m => m.position === 2 || m.position === 3).length;
                player.lastPlaceFinishes = player.matchHistory.filter(m => m.position === -1).length;
                
                // Recalculate total earnings and average
                const totalEarnings = player.matchHistory.reduce((sum, m) => sum + m.earnings, 0);
                player.totalEarnings = totalEarnings;
                player.averageEarning = player.matchHistory.length > 0 
                    ? totalEarnings / player.matchHistory.length 
                    : 0;

                await player.save();
            }
        }

        // Delete the match
        await Match.deleteOne({ _id: match._id });

        res.json({ message: 'Match deleted successfully and player stats updated' });
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({ message: 'Error deleting match', error: error.message });
    }
});

module.exports = router; 