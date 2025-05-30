const mongoose = require("mongoose");

const temperatureDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
temperatureDataSchema.index({ timestamp: 1 });

const TemperatureData = mongoose.model(
  "TemperatureData",
  temperatureDataSchema
);

module.exports = TemperatureData;