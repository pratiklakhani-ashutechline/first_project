const express = require('express');
const router = express.Router();

// Dummy data
let products = [
    { id: 1, name: "iPhone 14", price: 79999, image: "https://via.placeholder.com/200?text=iPhone" },
    { id: 2, name: "Samsung Galaxy", price: 69999, image: "https://via.placeholder.com/200?text=Samsung" },
    { id: 3, name: "Laptop", price: 55000, image: "https://via.placeholder.com/200?text=Laptop" },
    { id: 4, name: "Headphones", price: 2999, image: "https://via.placeholder.com/200?text=Headphones" },
    { id: 5, name: "Shoes", price: 1999, image: "https://via.placeholder.com/200?text=Shoes" }
];

// GET all products
router.get('/products', (req, res) => {
    res.json(products);
});

// POST add product
router.post('/add-products', (req, res) => {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({ message: "All fields required" });
    }

    const newProduct = {
        id: products.length + 1,
        name,
        price,
        image
    };

    products.push(newProduct);

    res.json({
        message: "Product added successfully ✅",
        product: newProduct
    });
});

/// PUT update product
router.put('/update-products', (req, res) => {
    const id = parseInt(req.body.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Update values
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;

    res.json({
        message: "Product updated ✅",
        product
    });
});

// DELETE product
router.delete('/delete-products', (req, res) => {
    const id = parseInt(req.body.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const deletedProduct = products.splice(index, 1);

    res.json({
        message: "Product deleted ✅",
        product: deletedProduct[0]
    });
});

module.exports = router;