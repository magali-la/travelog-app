// DEPENDENCIES
require("dotenv").config();
const express = require("express");
const app = express();

// DATABASE CONNECTION
const db = require("./config/connection.js");

// LISTENER - PORT
// add a fallback to avoid undefined error in case .env doesn't specify a port for cloned repos
const PORT = process.env.PORT || 5001;

// wait for mongodb connection to open before starting the server
db.once("open", () => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
});