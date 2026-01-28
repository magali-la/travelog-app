const express = require("express");
const router = express.Router();
const Trip = require("../../models/Trip.js");

// MIDDLEWARE
const { authMiddleware } = require("../../utils/auth.js");
router.use(authMiddleware);

// ROUTES - induces
// Index - get all trips from the user
router.get('/', async (req, res) => {
    try {
        // find by the user retrieved from the middleware's response
        const trips = await Trip.find({ user: req.user._id });
        // respond with their trips
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Index - get one by id
router.get('/:id', async (req, res) => {
    const tripId = req.params.id;

    try {
        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({ message: 'No trip found with this id' });
        }

        // Check user id
        if (trip.user.toString() !== req.user._id) {
            return res.status(403).json({ message: 'User is not authorized to view this trip' });
        }

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete - delete trip
router.delete('/:id', async (req, res) => {
	const tripId = req.params.id

    try {
        const trip = await Trip.findById(tripId);

        if (!trip) {
          return res.status(404).json({ message: 'No trip found with this id' });
        }

		// check if the bookmark doesn't belong to the user:
		if (trip.user.toString() !== req.user._id) {
			return res.status(403).json({ message: 'User is not authorized to delete this trip' });
		}
		
		// after authorization delete it
		await trip.deleteOne();

        res.json({ message: 'Trip deleted', deletedTrip: trip });
    } catch (error) {
      	res.status(500).json({ message: error.message });
    }
}); 

// Update - update a trip
router.put('/:id', async (req, res) => {
	const tripId = req.params.id
	try {
		// find the trip first then run authorization
		const trip = await Trip.findById(tripId);
		// error if no bookmark found
		if (!trip) {
			return res.status(404).json({ message: 'No trip found with this id'});
		}

		// check if the trip doesn't belong to the user:
		if (trip.user.toString() !== req.user._id) {
			return res.status(403).json({ message: 'User is not authorized to update this trip' });
		}

		// otherwise continue with the update - use object.assign to overwrite anything from the request body that has changed from the originl
		Object.assign(trip, req.body);
		// then save the trip
		await trip.save();

		// respond with the new trip
		res.json(trip);
	} catch (error) {
      	res.status(500).json({ message: error.message });
	}
});

// Create - post a new trip
router.post("/", async (req, res) => {
    try {
        // spread operator to take all the fields from the req body without writing each one, then add the user so it's attached to the trip, the middleware will respond with the req.user
        const trip = await Trip.create({...req.body, user: req.user._id });
        // success message with created trip
        res.status(201).json(trip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;