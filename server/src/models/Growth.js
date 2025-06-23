const mongoose = require("mongoose");

const growthSchema = new mongoose.Schema({
  plantType: {
    type: String,
    required: true
  },
  currentStage: {
    type: String,
    enum: ['Seed', 'Sprout', 'Veg', 'Flower', 'Harvest'],
    default: 'Seed',
    required: true
  },
  health: {
    type: String,
    required: true
  },
  plantedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expectedHarvestDate: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Growth = mongoose.model('Growth', growthSchema);

module.exports = Growth; 