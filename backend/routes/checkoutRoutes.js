const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddlware");

const router = express.Router();

// @route   POST /api/checkout
// @desc    Create a new checkout session
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
      req.body || {};

    if (!checkoutItems || checkoutItems.length === 0) {
      return res.status(400).json({ message: "No items to checkout" });
    }
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }
    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Valid total price is required" });
    }

    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/checkout/:id/pay
// @desc    Mark checkout as paid (PayPal) or placed (COD) and create an order
// @access  Private
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const { paymentStatus, paymentDetails } = req.body || {};

    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }
    if (checkout.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this checkout" });
    }
    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout is already finalized" });
    }

    const isCOD = checkout.paymentMethod === "COD";

    // Update checkout payment status
    checkout.isPaid = isCOD ? false : true;
    checkout.paidAt = isCOD ? undefined : Date.now();
    checkout.paymentStatus = isCOD ? "Pending" : (paymentStatus || "Completed");
    checkout.paymentDetails = paymentDetails || {};
    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    await checkout.save();

    // Create order from checkout
    const newOrder = await Order.create({
      user: req.user._id,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: isCOD ? false : true,
      paidAt: isCOD ? undefined : checkout.paidAt,
      paymentStatus: isCOD ? "Pending" : (paymentStatus || "Completed"),
    });

    // Clear user's cart after successful order
    await Cart.findOneAndDelete({ user: req.user._id });

    res.json({ message: isCOD ? "Order placed (COD)" : "Payment successful, order created", order: newOrder });
  } catch (error) {
    console.error("PUT /api/checkout/:id/pay error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/checkout/:id/finalize
// @desc    Finalize checkout after payment confirmation
// @access  Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }
    if (checkout.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to finalize this checkout" });
    }
    if (!checkout.isPaid) {
      return res
        .status(400)
        .json({ message: "Checkout must be paid before finalizing" });
    }
    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout is already finalized" });
    }

    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    await checkout.save();

    res.json({ message: "Checkout finalized", checkout });
  } catch (error) {
    console.error("PUT /api/checkout/:id/finalize error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;