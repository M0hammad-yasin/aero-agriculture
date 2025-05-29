// server/index.js

const express = require("express");
const connectDb = require("./src/config/db");
const app = express();
const config = require("./src/config/config");
const PORT = config.PORT || 3000;
// Connect to the database
connectDb();

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello from the Node.js server!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
