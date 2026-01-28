const express = require("express");
const router = express.Router();
const Activity = require("../../models/Activity.js");
const Trip = require("../../models/Trip.js");

// MIDDLEWARE
const { authMiddleware } = require("../../utils/auth.js");
router.use(authMiddleware);

// ROUTES
// Index - get all activites for a trip
router.get("/:tripId/activities", async (req, res) => {
    const tripId = req.params.tripId;
    try {
        const trip = await Trip.findById(tripId);

        // if no trip run 404
        if (!trip) {
            return res.status(404).json({ message: "No trip found" });
        }

        // verify trip belongs to user
        if (trip.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized to view this trip" });
        }

        // find the activites from this trip
        const activites = await Activity.find({ trip: trip._id });

        // respond with the activities
        res.json(activites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete - delete a specific activity from the list
router.delete("/activities/:activityId", async (req, res) => {
    const activityId = req.params.activityId;

    try {
        const activity = await Activity.findById(activityId);
        // check if there is one
        if (!activity) {
            return res.status(404).json({ message: "No activity found" });
        }

        // check for the associated trip and if the user is authorized
        const trip = await Trip.findById(activity.trip);

        if (trip.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized to view this trip" });
        }

        // if authorized, then delete it and send to client for undos
        await activity.deleteOne();

        res.json({ message: "Activity deleted", deletedActivity: activity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update - update the contents of an activity
router.put("/activities/:activityId", async (req, res) => {
    const activityId = req.params.activityId;
    
    try {
        const activity = await Activity.findById(activityId);

        // if activity isn't found run error
        if (!activity) {
            return res.status(404).json({ message: "No activity found" });
        }

        // check if the trip exists and if the user is authorized
        const trip = await Trip.findById(activity.trip);

        // if no trip run 404
        if (!trip) {
            return res.status(404).json({ message: "No trip found" });
        }

        if (trip.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized to view this trip" });
        }

        // update with the request body
        Object.assign(activity, req.body);
        await activity.save();

        // respond with the updaated activity
        res.json(activity);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create - add a new activity to a trip
router.post("/:tripId/activities", async (req, res) => {
    const tripId = req.params.tripId;
    try {
        const trip = await Trip.findById(tripId);

        // if no trip run 404
        if (!trip) {
            return res.status(404).json({ message: "No trip found" });
        }

        // verify trip belongs to user
        if (trip.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized to view this trip" });
        }

        // use spread to take all from the req.body and add the tripId for the trip in question to add a new activity
        const activity = await Activity.create({ ...req.body, trip: trip._id});

        // success message
        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;