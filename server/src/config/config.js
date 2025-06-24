const dotenv = require("dotenv");
dotenv.config();
const config = {
  dbUri: process.env.MONGODBURL || "mongodb://127.0.0.1:27017/VertiBlockX",
  port: process.env.PORT,
  isProduction: process.env.NODE_ENV === "production",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_key",
  refreshSecret: process.env.REFRESH_SECRET || "your_refresh_secret_key",
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  apiBaseUrl: "/api",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  }
};
module.exports = config;
