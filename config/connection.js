const mongoose = require("mongoose");
// DATABASE
// connect the database
mongoose.connect(process.env.MONGO_URI);

// DATABASE CONNECTION
// callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

module.exports = mongoose.connection;