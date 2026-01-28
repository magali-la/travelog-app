const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // the length of the itinerary in days
    duration: {
        type: Number,
        required: true
    },
    // set default to an empty array
    activities: {
        type: Array,
        default: []
    },
    // add user to each trip
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    }
})

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;