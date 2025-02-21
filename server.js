const express = require('express');
const cors = require('cors'); // Allows cross-origin requests

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables CORS (optional, but useful)

// Dummy database (temporary storage)
const riders = [];

// POST route to add a new rider
app.post('/riders', (req, res) => {
    const { name, pickupLocation, dropoffLocation } = req.body;

    if (!name || !pickupLocation || !dropoffLocation) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newRider = { name, pickupLocation, dropoffLocation };
    riders.push(newRider);

    res.status(201).json({ message: "Ride request received", rider: newRider });
});

// GET route to fetch all riders
app.get('/riders', (req, res) => {
    res.json({ riders });
});
app.post('/drivers', (req, res) => {
  // Handle driver registration or creation
  res.send("Driver added successfully!");
});
app.use(express.json());  // Add this if missing

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
const findNearestDriver = require("./utils/matchRider");

app.post("/match", async (req, res) => {
  try {
    const { pickupLocation } = req.body;
    const driver = await findNearestDriver(pickupLocation.coordinates);

    if (!driver) {
      return res.status(404).send({ message: "No drivers available nearby!" });
    }

    // Mark driver as unavailable
    driver.available = false;
    await driver.save();

    res.send({ message: "Driver found!", driver });
  } catch (error) {
    res.status(500).send(error);
  }
});

