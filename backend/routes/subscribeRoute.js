const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

// @route   POST /api/subscribe
// @desc    handle newsletter subscription
// @access  Public
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    // Check if email already exists
    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      return res.status(400).json({ message: "Email is already subscribed" });
    }
    // Create new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(201).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("POST /api/subscribe error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
