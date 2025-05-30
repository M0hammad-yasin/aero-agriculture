const mongoose = require("mongoose");

const solLevelDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
solLevelDataSchema.index({ timestamp: 1 });

const SolLevelData = mongoose.model("SolLevelData", solLevelDataSchema);

module.exports = SolLevelData;