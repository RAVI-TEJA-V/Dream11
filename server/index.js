const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/players', require('./routes/players'));
app.use('/api/matches', require('./routes/matches'));

const PORT = process.env.PORT || 5132;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 