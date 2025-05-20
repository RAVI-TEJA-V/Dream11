"use strict";

var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
require('dotenv').config();
var app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI).then(function () {
  return console.log('Connected to MongoDB');
})["catch"](function (err) {
  return console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/players', require('./routes/players'));
app.use('/api/matches', require('./routes/matches'));
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});