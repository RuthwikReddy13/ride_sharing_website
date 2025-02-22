const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    name: String,
    phone: String,
    vehicle: String,
    location: String,
    available: { type: Boolean, default: true }
});

// Prevent model overwrite issue
module.exports = mongoose.models.Driver || mongoose.model('Driver', DriverSchema);
