const jwt = require("jsonwebtoken");
const express = require('express');
const Course = require('../models/Course')
const User = require('../models/User')
const bcrypt = require("bcrypt");



const router = express.Router();

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided!" });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token!" });
    }
};

router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided!" });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(verified.id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (user.type !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const userCount = await User.countDocuments();
        const courseCount = await Course.countDocuments();

        return res.status(200).json({ userCount, courseCount });
    } catch (error) {
        console.error("Error in /stats endpoint:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post("/createAdmin", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword, type: "admin" });
        await newUser.save();

        res.status(201).json({ message: "Admin registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;