const express = require("express");
const app = express();
const initializeRoutes = require("./routes");
initializeRoutes(app);
module.exports = app;
