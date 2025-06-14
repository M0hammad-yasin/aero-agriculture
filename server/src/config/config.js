const dotenv = require("dotenv");
dotenv.config();
const config = {
  dbUri: process.env.MONGODBURL || "mongodb://127.0.0.1:27017/VertiBlockX",
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_key",
  refreshSecret: process.env.REFRESH_SECRET || "your_refresh_secret_key",
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "1m",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "2m",
  apiBaseUrl: "/api",
};
module.exports = config;
