const mongoose = require("mongoose");

const temperatureDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: { type: Number, required: true },
  deviceId: { type: String, default: 'default' },
});
temperatureDataSchema.index({ timestamp: 1 });

const TemperatureData = mongoose.model(
  "TemperatureData",
  temperatureDataSchema
);

module.exports = TemperatureData;