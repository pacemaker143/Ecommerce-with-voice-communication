const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddlware");
const router = express.Router();
// @route   GET /api/admin/orders
// @desc    get all orders (admin only)
// @access  Private/Admin

router.get("/orders", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/admin/orders/:id
// @desc    update order status (admin only)
// @access  Private/Admin
router.put("/orders/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = req.body.status || order.status;
    order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
    order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("PUT /api/admin/orders/:id error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/admin/orders/:id
// @desc    delete an order (admin only)
// @access  Private/Admin
router.delete("/orders/:id", protect, admin, async (req, res) => {
    try {   
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        await order.deleteOne();
        res.json({ message: "Order removed" });
    } catch (error) {
        console.error("DELETE /api/admin/orders/:id error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
