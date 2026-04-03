const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // IMPORT MODEL
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'gromuse_products',
        resource_type: 'auto' // Allows both images and videos
    }
});

const upload = multer({ storage: storage });

// ✅ GET all products
router.get('/products' , auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST upload assets (generic decoupled endpoint)
router.post('/upload-assets', auth, upload.array('assets', 5), async (req, res) => {
  try {
    let urls = [];
    if (req.files && req.files.length > 0) {
        urls = req.files.map(file => file.path);
    }
    res.json({ message: "Assets uploaded successfully", urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST add product
router.post('/add-products', auth, async (req, res) => {
  try {
    const { name, price, images } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const newProduct = new Product({
      name,
      price,
      images
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
    const { id, name, price, images } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = price;
    if (images !== undefined) updateData.images = images;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
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