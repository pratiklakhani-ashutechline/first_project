const express = require('express');
const router = express.Router();
const User = require('../models/login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found ❌" });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password ❌" });
        }

        // 3. Create token
        const token = jwt.sign(
            { id: user._id },
            "secretkey",   // later move to .env
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            message: "Login successful ✅",
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword
        });

        await user.save();

        res.json(
            { 
                success: true,
                message: "User registered",
                user: {
                    id: user._id,
                    email: user.email
                }
            }
        );

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;