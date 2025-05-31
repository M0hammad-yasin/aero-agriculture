const dotenv = require("dotenv");
dotenv.config();
const config = {
  dbUri: process.env.MONGODBURL || "mongodb://127.0.0.1:27017/VertiBlockX",
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_key",
  apiBaseUrl: "/api",
};
module.exports = config;
