const mongoose = require("mongoose");

const humidityDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: { type: Number, required: true },
  deviceId: { type: String, default: 'default' },
});
humidityDataSchema.index({ timestamp: 1 });

const HumidityData = mongoose.model("HumidityData", humidityDataSchema);

module.exports = HumidityData;