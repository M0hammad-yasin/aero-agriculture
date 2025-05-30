const mongoose = require("mongoose");

const co2DataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
co2DataSchema.index({ timestamp: 1 });

const CO2Data = mongoose.model("CO2Data", co2DataSchema);

module.exports = CO2Data;