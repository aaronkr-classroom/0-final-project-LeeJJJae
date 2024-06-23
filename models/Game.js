// models/Game.js
const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true, // 유일성을 보장할 필요가 있는 경우에만 설정
  },
  description: {
    type: String,
    required: true,
  },
  maxStudents: {
    type: Number,
    default: 0,
    min: [0, "Game cannot have a negative number of students"],
  },
  cost: {
    type: Number,
    default: 0,
    min: [0, "Game cannot have a negative cost"],
  },
}, {
  timestamps: true, // 생성 및 수정 시간 기록
});

module.exports = mongoose.model("Game", gameSchema);
