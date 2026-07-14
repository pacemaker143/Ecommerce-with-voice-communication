const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddlware");
const router = express.Router();

// @route   GET /api/orders/my-orders
// @desc    Get logged in user's orders
// @access  Private
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error("GET /api/orders/my-orders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID (only if it belongs to the user)
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // After populate, order.user is an object with _id
    const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
    if (orderUserId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(order);
  } catch (error) {
    console.error("GET /api/orders/:id error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
