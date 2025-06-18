const mongoose = require("mongoose");

const solLevelDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: { type: Number, required: true },
  deviceId: { type: String, default: 'default' },
});
solLevelDataSchema.index({ timestamp: 1 });

const SolLevelData = mongoose.model("SolLevelData", solLevelDataSchema);

module.exports = SolLevelData;