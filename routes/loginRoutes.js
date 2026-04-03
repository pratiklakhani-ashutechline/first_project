const express = require('express');
const router = express.Router();
const User = require('../models/login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../config/emailConfig');

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
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
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
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        // 1. Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Check all fields
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        // 3. Password validation
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be strong (uppercase, lowercase, number, special char, min 6 chars)"
            });
        }

        // 4. Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // 5. Hash password (SECURITY 🔐)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Create user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set OTP and expiration (10 minutes)
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "OTP sent to email successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify OTP and expiration
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Validate new password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: "Password must be strong (uppercase, lowercase, number, special char, min 6 chars)"
            });
        }

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 10);

        // Clear OTP fields
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ success: true, message: "Password reset successful" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;