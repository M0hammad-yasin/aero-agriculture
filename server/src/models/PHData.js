const mongoose = require("mongoose");

const pHDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
pHDataSchema.index({ timestamp: 1 });

const PHData = mongoose.model("PHData", pHDataSchema);

module.exports = PHData;