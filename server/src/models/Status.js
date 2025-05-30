const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  timerComplete: {
    type: Number,
    default: 0,
  },
  sprinklerRun: {
    type: Number,
    default: 0,
  },
});

const Status = mongoose.model("Status", statusSchema);

module.exports = Status;