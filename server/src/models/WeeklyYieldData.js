const mongoose = require("mongoose");

const plantYieldSchema = new mongoose.Schema({
  plant: String,
  yieldValues: {
    type: [Number],
    default: [],
  },
});

const weeklyYieldSchema = new mongoose.Schema({
  weekStartDate: Date,
  weekEndDate: Date,
  plantYields: [plantYieldSchema],
});

const WeeklyYieldData = mongoose.model("WeeklyYieldData", weeklyYieldSchema);

module.exports = WeeklyYieldData;