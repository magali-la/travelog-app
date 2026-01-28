// Hub for all /api routes
const router = require('express').Router();
const userRoutes = require('./userRoutes.js');

// prefix all userRoutes with /users - it's /api/users
router.use("/users", userRoutes);

module.exports = router;