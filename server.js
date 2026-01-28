// DEPENDENCIES
require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
require("./config/passport.js");

// DATABASE CONNECTION
const db = require("./config/connection.js");

// MIDDLEWARE
// parse all json data
app.use(express.json());
// initialize passport
app.use(passport.initialize());


// ROUTES - import routes from the central hub and use them in the app
const router = require("./routes/index.js");
app.use(router);

// LISTENER - PORT
// add a fallback to avoid undefined error in case .env doesn't specify a port for cloned repos
const PORT = process.env.PORT || 5001;

// wait for mongodb connection to open before starting the server
db.once("open", () => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
});