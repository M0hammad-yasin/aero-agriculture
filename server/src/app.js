const express = require("express");
const cors = require("cors"); // Import the cors package
const app = express();
const initializeRoutes = require("./routes");

// Enable CORS for all routes and origins (for development)
// For production, you should configure specific origins
app.use(cors({
  origin: 'http://localhost:8000' // Allow requests from this origin
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initializeRoutes(app);
module.exports = app;
