const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddlware');
const router = express.Router();
// @route   POST /api/admin/products
// @desc    get all products (admin only)
// @access  Private/Admin
router.get("/products", protect, admin, async (req, res) => {   
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error("GET /api/admin/products error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   POST /api/admin/products
// @desc    create a new product (admin only)
// @access  Private/Admin
router.post("/products", protect, admin, async (req, res) => {
    const { name, description, price, imageUrl } = req.body;    
    if (!name || !description || !price || !imageUrl) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const newProduct = new Product({
            name,   
            description,
            price,
            imageUrl,
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("POST /api/admin/products error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }   
});

module.exports = router;
// @route   PUT /api/admin/products/:id