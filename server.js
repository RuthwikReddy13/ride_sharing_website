const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Rider = require('./models/Rider');
//const Driver = require('./models/Driver');
const findNearestDriver = require("./utils/matchRider");
const Driver = require("./models/driverModel"); // ✅ Ensure correct import

const app = express();
const PORT = 3000;
const riders=[];
// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/rideshare', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// POST route to add a new rider
app.post('/riders', (req, res) => {
  console.log("Received request body:", req.body); // ✅ Debugging

  const { name, pickupLocation, dropoffLocation } = req.body;

  if (!name || !pickupLocation || !dropoffLocation) {
      return res.status(400).json({ error: "Missing required fields" });
  }

  try {
      const newRider = { name, pickupLocation, dropoffLocation };
      riders.push(newRider);
      res.status(201).json({ message: "Ride request received", rider: newRider });
  } catch (error) {
      console.error("Error adding rider:", error); // ✅ Print full error
      res.status(500).json({ message: "Error adding rider", error: error.message });
  }
});

// GET route to fetch all riders
app.get('/riders', async (req, res) => {
    try {
        const riders = await Rider.find();
        res.json({ riders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching riders", error });
    }
});

// POST route to add a new driver
app.post('/drivers', async (req, res) => {
    try {
        const { name, phone, vehicle, location } = req.body;
        if (!name || !phone || !vehicle || !location) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newDriver = new Driver({ name, phone, vehicle, location, available: true });
        await newDriver.save();

        res.status(201).json({ message: "Driver added successfully!", driver: newDriver });
    } catch (error) {
        res.status(500).json({ message: "Error adding driver", error });
    }
});

// POST route to match a rider with the nearest driver
app.post("/match", async (req, res) => {
    try {
        const { pickupLocation } = req.body;
        const driver = await findNearestDriver(pickupLocation);

        if (!driver) {
            return res.status(404).json({ message: "No drivers available nearby!" });
        }

        // Mark driver as unavailable
        driver.available = false;
        await driver.save();

        res.json({ message: "Driver found!", driver });
    } catch (error) {
        res.status(500).json({ message: "Error matching rider", error });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
