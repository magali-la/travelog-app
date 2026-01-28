const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema ({ 
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // associate activity with parent trip
    trip: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Trip',
        required: true
    }
});

const Activity = mongoose.model('Activity', activitySchema);


module.exports = Activity