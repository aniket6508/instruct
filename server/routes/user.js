// routes/user.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// JWT authentication middleware (reuse as needed)
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

// GET /api/user/my-courses – returns the list of courses purchased by the authenticated user.
router.get("/my-courses", authenticateToken, async (req, res) => {
  try {
    // Find the user and populate the purchasedCourses field
    const user = await User.findById(req.user.id).populate("purchasedCourses");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, courses: user.purchasedCourses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching purchased courses",
      error: error.message,
    });
  }
});

module.exports = router;
