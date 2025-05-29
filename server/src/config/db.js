const mongoose = require("mongoose");
const config = require("./config");
const connectDb = () => {
  mongoose
    .connect(config.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
};
// Export the connectDb function for use in other modules
module.exports = connectDb;
