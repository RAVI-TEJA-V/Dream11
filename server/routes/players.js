const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().sort({ totalEarnings: -1 });
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get player stats
router.get('/stats', async (req, res) => {
  try {
    const players = await Player.find().select('name wins topThreeFinishes lastPlaceFinishes averageEarning');
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get top three players
router.get('/top-three', async (req, res) => {
  try {
    const topThree = await Player.find()
      .sort({ totalEarnings: -1 })
      .limit(3)
      .select('name totalEarnings');
    res.json(topThree);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new player
router.post('/', async (req, res) => {
  const player = new Player({
    name: req.body.name
  });

  try {
    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Bulk create players
router.post('/bulk', async (req, res) => {
  const session = await Player.startSession();
  session.startTransaction();

  try {
    const { players } = req.body;
    
    if (!Array.isArray(players)) {
      throw new Error('Players must be an array of names');
    }

    // Check for duplicate names in the request
    const uniqueNames = new Set(players);
    if (uniqueNames.size !== players.length) {
      throw new Error('Duplicate player names are not allowed');
    }

    // Check for existing players
    const existingPlayers = await Player.find({
      name: { $in: players }
    }).select('name');

    const existingNames = new Set(existingPlayers.map(p => p.name));
    const newPlayers = players.filter(name => !existingNames.has(name));

    if (newPlayers.length === 0) {
      throw new Error('All players already exist');
    }

    // Create new players
    const createdPlayers = await Player.create(
      newPlayers.map(name => ({ name })),
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: `Successfully created ${createdPlayers.length} players`,
      skipped: players.length - createdPlayers.length,
      created: createdPlayers,
      existing: Array.from(existingNames)
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ 
      message: err.message,
      error: err.toString()
    });
  } finally {
    session.endSession();
  }
});

module.exports = router; 