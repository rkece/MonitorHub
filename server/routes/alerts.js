const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Alert = mongoose.model("Alert", new mongoose.Schema({
  title: String,
  message: String,
  severity: String,
  deviceName: String,
  timestamp: String,
  acknowledged: Boolean,
  resolvedAt: String
}));

// Get alerts
router.get("/", async (req, res) => {
  const alerts = await Alert.find().sort({ timestamp: -1 });
  res.json(alerts);
});

// Create alert
router.post("/", async (req, res) => {
  const alert = await Alert.create(req.body);
  res.json(alert);
});

module.exports = router;
