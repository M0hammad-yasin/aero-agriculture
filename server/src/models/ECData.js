const mongoose = require("mongoose");

const ECDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: { type: Number, required: true },
  deviceId: { type: String, default: 'default' },
});
ECDataSchema.index({ timestamp: 1 });

const ECData = mongoose.model("ECData", ECDataSchema);

module.exports = ECData;