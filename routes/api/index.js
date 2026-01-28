// Hub for all /api routes
const router = require('express').Router();
const userRoutes = require('./userRoutes.js');
const tripRoutes = require("./tripRoutes.js");

// prefix all userRoutes with /users - it's /api/users
router.use("/users", userRoutes);

// prefix all tripRoutes with /trips
router.use("/trips", tripRoutes);

module.exports = router;