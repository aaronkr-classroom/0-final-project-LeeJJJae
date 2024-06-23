const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true, // Ensure the game title is unique
  },
  description: {
    type: String,
    required: true,
  },
  maxPlayers: {
    type: Number,
    default: 0,
    min: [0, "Game cannot have a negative number of players"], // Updated to maxPlayers for consistency
  },
  cost: {
    type: Number,
    default: 0,
    min: [0, "Game cannot have a negative cost"],
  },
}, {
  timestamps: true, // Record creation and update timestamps
});

module.exports = mongoose.model("Game", gameSchema);
