const express = require("express");
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddlware");

const router = express.Router();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Optional auth — extracts user from Bearer token when present,
 * but never blocks the request if the token is missing or invalid.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id || decoded.user?._id || decoded.user?.id;
      if (userId) {
        req.user = await User.findById(userId).select("-password");
      }
    }
  } catch {
    // Token invalid / expired — continue as guest
  }
  next();
};

/** Resolve userId from token or body/query, and guestId from body/query. */
const resolveIdentity = (req, source = "body") => {
  const data = (source === "body" ? req.body : req.query) || {};
  const userId = req.user?._id || data.userId || null;
  const guestId = data.guestId || null;
  return { userId, guestId };
};

/** Find a cart by userId (priority) or guestId. */
const findCart = async (userId, guestId) => {
  if (userId) return Cart.findOne({ user: userId });
  if (guestId) return Cart.findOne({ guestId });
  return null;
};

/** Recalculate totalPrice with 2-decimal precision. */
const calcTotal = (products) =>
  parseFloat(
    products
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)
  );

/** Safely get the first image URL from a product document. */
const getImageUrl = (product) =>
  product.images?.length ? product.images[0].url : "";

/**
 * Find a product index in the cart. Tries exact match (productId + size + color)
 * first, then falls back to productId + size, then productId only.
 */
const findProductIndex = (products, productId, size, color) => {
  // 1. Exact match: productId + size + color
  let idx = products.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
  );
  if (idx > -1) return idx;

  // 2. Fallback: productId + size
  if (size) {
    idx = products.findIndex(
      (item) =>
        item.product.toString() === productId && item.size === size
    );
    if (idx > -1) return idx;
  }

  // 3. Fallback: productId only
  idx = products.findIndex(
    (item) => item.product.toString() === productId
  );
  return idx;
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * @route   POST /api/cart
 * @desc    Add a product to the cart (guest or authenticated)
 * @access  Public
 */
router.post("/", optionalAuth, async (req, res) => {
  try {
    const body = req.body || {};
    const productId = body.productId || body.product;
    const { quantity, size, color, guestId } = body;
    const { userId } = resolveIdentity(req, "body");

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "productId and quantity are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await findCart(userId, guestId);

    if (cart) {
      const idx = cart.products.findIndex(
        (item) =>
          item.product.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (idx > -1) {
        cart.products[idx].quantity += quantity;
      } else {
        cart.products.push({
          product: productId,
          name: product.name,
          image: getImageUrl(product),
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      cart.totalPrice = calcTotal(cart.products);
      await cart.save();
      return res.status(200).json(cart);
    }

    // Create a new cart
    const newCart = await Cart.create({
      user: userId || undefined,
      guestId: guestId || `guest_${Date.now()}`,
      products: [
        {
          product: productId,
          name: product.name,
          image: getImageUrl(product),
          price: product.price,
          size,
          color,
          quantity,
        },
      ],
      totalPrice: calcTotal([{ price: product.price, quantity }]),
    });

    return res.status(201).json(newCart);
  } catch (error) {
    console.error("POST /api/cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/cart
 * @desc    Get the cart for a logged-in user or guest
 * @access  Public
 */
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { userId, guestId } = resolveIdentity(req, "query");
    const cart = await findCart(userId, guestId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    console.error("GET /api/cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   PUT /api/cart
 * @desc    Update product quantity in the cart
 * @access  Public
 */
router.put("/", optionalAuth, async (req, res) => {
  try {
    const body = req.body || {};
    const productId = body.productId || body.product;
    const { quantity, size, color } = body;
    const { userId, guestId } = resolveIdentity(req, "body");

    if (!productId || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "productId and quantity are required" });
    }

    const cart = await findCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const idx = findProductIndex(cart.products, productId, size, color);

    if (idx === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Only update quantity — size/color are used for identification only
    if (quantity <= 0) {
      cart.products.splice(idx, 1);
    } else {
      cart.products[idx].quantity = quantity;
    }

    cart.totalPrice = calcTotal(cart.products);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("PUT /api/cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   DELETE /api/cart
 * @desc    Remove a product from the cart
 * @access  Public
 */
router.delete("/", optionalAuth, async (req, res) => {
  try {
    // Support both body and query params (some clients strip body on DELETE)
    const body = req.body || {};
    const query = req.query || {};
    const productId = body.productId || body.product || query.productId || query.product;
    const size = body.size || query.size;
    const color = body.color || query.color;
    const guestId = body.guestId || query.guestId;
    const userId = req.user?._id || body.userId || query.userId || null;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await findCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const idx = findProductIndex(cart.products, productId, size, color);

    if (idx === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products.splice(idx, 1);

    cart.totalPrice = calcTotal(cart.products);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("DELETE /api/cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   POST /api/cart/merge
 * @desc    Merge a guest cart into the authenticated user's cart
 * @access  Private
 */
router.post("/merge", protect, async (req, res) => {
  try {
    const { guestId } = req.body || {};

    if (!guestId) {
      return res.status(400).json({ message: "guestId is required" });
    }

    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    // Nothing to merge
    if (!guestCart) {
      return res.json(userCart || { products: [], totalPrice: 0 });
    }

    // No user cart yet — convert guest cart to user cart
    if (!userCart) {
      guestCart.user = req.user._id;
      guestCart.guestId = undefined;
      await guestCart.save();
      await Cart.updateOne(
        { _id: guestCart._id },
        { $unset: { guestId: "" } }
      );
      return res.json(guestCart);
    }

    // Merge items
    for (const guestItem of guestCart.products) {
      const idx = userCart.products.findIndex(
        (item) =>
          item.product.toString() === guestItem.product.toString() &&
          item.size === guestItem.size &&
          item.color === guestItem.color
      );

      if (idx > -1) {
        userCart.products[idx].quantity += guestItem.quantity;
      } else {
        userCart.products.push(guestItem);
      }
    }

    userCart.totalPrice = calcTotal(userCart.products);
    await userCart.save();

    // Clean up guest cart
    await Cart.deleteOne({ guestId });
    res.json(userCart);
  } catch (error) {
    console.error("POST /api/cart/merge error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
