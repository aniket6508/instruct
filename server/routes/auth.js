const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");
const { sendMail } = require("../utils/mailer");
const router = express.Router();



// ----- Google OAuth -----
// Step 1: Redirect to Google for authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2: Google redirects back to your callback URL
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication: create a JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    // Redirect to your frontend with the token (adjust the URL as needed)
    sendMail({
      to: req.user.email,
      subject: "Login Alert - Instruct",
      text: `You have successfully logged in via Google at ${new Date().toLocaleString()}.`,
      html: `<p>You have successfully logged in via Google at <strong>${new Date().toLocaleString()}</strong>.</p>`,
    }).catch((err) => console.error("Error sending Google login email:", err));

    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  }
);



// Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, type: "student" });
    await newUser.save();


    sendMail({
      to: email,
      subject: "Welcome to Instruct!",
      text: "Thank you for registering at Instruct. Enjoy our platform.",
      html: `<p>Thank you for registering at <strong>Instruct</strong>. Enjoy our platform!</p>`,
    }).catch((err) => console.error("Error sending registration email:", err));

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });


    sendMail({
      to: email,
      subject: "Login Alert - Instruct",
      text: `You have successfully logged in at ${new Date().toLocaleString()}.`,
      html: `<p>You have successfully logged in at <strong>${new Date().toLocaleString()}</strong>.</p>`,
    }).catch((err) => console.error("Error sending login email:", err));

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, type: user.type } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected Route Example
router.get("/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "This is a protected route", userId: verified.id });
  } catch (error) {
    res.status(401).json({ message: "Invalid token!" });
  }
});

module.exports = router;
