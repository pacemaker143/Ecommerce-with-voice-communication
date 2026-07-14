const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddlware");

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      user: req.user._id,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/products
// @desc    Get all products with optional query filters
// @access  Public
router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};

    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (brand && brand.toLowerCase() !== "all") {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.sizes = { $in: size.split(",") };
    }
    if (color) {
      query.colors = { $in: [color] };
    }
    if (gender && gender.toLowerCase() !== "all") {
      query.gender = gender;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/products/best-sellers
// @desc    Get best selling products (top 5 by rating)
// @access  Public
router.get("/best-seller", async (req, res) => {
  try {
    const bestSellers = await Product.find({}).sort({ rating: -1 }).limit(5);
    if (bestSellers.length > 0) {
      res.json(bestSellers);
    } else {
      res.status(404).json({ message: "No best sellers found" });
    }
  } catch (error) {
    console.error("Get best sellers error:", error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/products/new-arrivals
// @desc    Get new arrival products (latest 8 by createdAt)
// @access  Public
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error("Get new arrivals error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/products/similar/:id
// @desc    Get similar products based on the current products category and gender
// @access  Public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const similarProducts = await Product.find({
      category: product.category,
      gender: product.gender,
      _id: { $ne: id },
    }).limit(4);
    res.json(similarProducts);
  } catch (error) {
    console.error("Get similar products error:", error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const fields = [
      "name",
      "description",
      "price",
      "discountPrice",
      "countInStock",
      "category",
      "brand",
      "sizes",
      "colors",
      "collections",
      "material",
      "gender",
      "images",
      "isFeatured",
      "isPublished",
      "tags",
      "dimensions",
      "weight",
      "sku",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
