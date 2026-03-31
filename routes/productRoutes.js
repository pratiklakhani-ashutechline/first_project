const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // IMPORT MODEL
const auth = require('../middleware/auth');

// ✅ GET all products
router.get('/products' , auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST add product
router.post('/add-products', auth, async (req, res) => {
  try {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newProduct = new Product({
      name,
      price,
      image
    });

    const savedProduct = await newProduct.save();

    res.json({
      message: "Product saved ✅",
      product: savedProduct
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ PUT update product
router.put('/update-products', auth, async (req, res) => {
  try {
    const { id, name, price, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated ✅",
      product: updatedProduct
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ DELETE product
router.delete('/delete-products', auth, async (req, res) => {
  try {
    const { id } = req.body;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product deleted ✅",
      product: deletedProduct
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;