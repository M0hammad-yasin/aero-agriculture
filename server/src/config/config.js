const dotenv = require("dotenv");
dotenv.config();
const config = {
  dbUri: process.env.MONGODBURL || "mongodb://localhost:27017/myapp",
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_key",
  apiBaseUrl: "/api",
};
module.exports = config;
