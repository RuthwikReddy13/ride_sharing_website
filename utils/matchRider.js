const Driver = require("../models/driverModel");

async function findNearestDriver(pickupCoordinates) {
  const nearestDriver = await Driver.findOne({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: pickupCoordinates },
        $maxDistance: 5000, // 5km radius
      },
    },
    available: true,
  });

  return nearestDriver;
}

module.exports = findNearestDriver;
