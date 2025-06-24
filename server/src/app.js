const express = require("express");
const cors = require("cors"); // Import the cors package
const cookieParser = require("cookie-parser"); // Import cookie-parser
const app = express();
const path = require("path");
const models = require("./models"); 
const error=require('./middleware/error')
const initializeRoutes = require("./routes");

// Enable CORS for all routes and origins (for development)
// For production, you should configure specific origins
app.use(cors({
  origin: 'http://localhost:8000', // Allow requests from this origin
  credentials: true // Allow cookies to be sent with requests
}));

// Attach models to app instance
app.set('models', models);

app.use(cookieParser()); // Parse cookies in requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

initializeRoutes(app);
app.use(error);
module.exports = app;
