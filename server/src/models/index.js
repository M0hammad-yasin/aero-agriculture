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
const Growth = require("./Growth");
const config=require('../config/config');
async function connectToDatabase() {
  const MONGO_URI = config.dbUri;
  await mongoose.connect(MONGO_URI);
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
  Growth
};