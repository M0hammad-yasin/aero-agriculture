const mongoose = require("mongoose");

const ECDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
ECDataSchema.index({ timestamp: 1 });

const ECData = mongoose.model("ECData", ECDataSchema);

module.exports = ECData;