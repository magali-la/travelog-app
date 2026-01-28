// Central hub for all routes in the app
const router = require("express").Router();
// /auth routes
const authRoutes = require("./authRoutes.js");
const apiRoutes = require("./api/index.js");

// OAuth routes and redirects
router.use("/auth", authRoutes);
// API routes
router.use("/api", apiRoutes);
 
router.use((req, res) => {
    // error if the route is not correct
    res.status(404).json({ message: "Route not found. Check url" });
});
 
module.exports = router;