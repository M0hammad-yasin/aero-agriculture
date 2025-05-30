const mongoose = require("mongoose");

const ledSchema = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      required: true,
      default: false, // Default to 'off'
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically set to the current timestamp
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Create the LED model
const LED = mongoose.model("LED", ledSchema);

module.exports = LED;