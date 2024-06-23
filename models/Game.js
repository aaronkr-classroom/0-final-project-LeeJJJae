//models/Game.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  genre: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Game", gameSchema);