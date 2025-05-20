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

module.exports = router; 