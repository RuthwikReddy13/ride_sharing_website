const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [longitude, latitude]
  },
  available: { type: Boolean, default: true },
});

DriverSchema.index({ location: "2dsphere" }); // Enable geospatial queries

const Driver = mongoose.model("Driver", DriverSchema);
module.exports = Driver;
