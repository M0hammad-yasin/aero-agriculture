const mongoose = require("mongoose");
const Blog = require("./Blog");
const User = require("./User");
const LED = require("./LED");
const TemperatureData = require("./TemperatureData");
const HumidityData = require("./HumidityData");
const PHData = require("./PHData");
const ECData = require("./ECData");
const CO2Data = require("./CO2Data");
const SolLevelData = require("./SolLevelData");
const WeeklyYieldData = require("./WeeklyYieldData");
const Status = require("./Status");

async function connectToDatabase() {
  await mongoose.connect("mongodb://127.0.0.1:27017/VertiBlockX");
}

module.exports = {
  connectToDatabase,
  mongoose,
  Blog,
  User,
  LED,
  TemperatureData,
  HumidityData,
  PHData,
  ECData,
  CO2Data,
  SolLevelData,
  WeeklyYieldData,
  Status,
};