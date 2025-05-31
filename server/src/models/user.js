const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    profileImg: String,
    refreshTokens: [{
      token: { type: String, required: true },
      expiresAt: { type: Date, required: true },
      device: { type: String }
    }]
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;