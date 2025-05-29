// server/index.js

const connectDb = require("./src/config/db");
const config = require("./src/config/config");
const PORT = config.port;
const app = require("./src/app");
// Connect to the database
connectDb();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
