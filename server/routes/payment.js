// routes/payment.js
const express = require('express');
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Course = require('../models/Course');
const User = require('../models/User');
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/mailer"); // Ensure you have a mailer utility

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided!" });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};

// Create a Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Route to create an order
router.post("/create-order", authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Define the amount (in paise). For example, ₹1999 becomes 199900 paise.
    const amount = 1999 * 100;
    // Generate a short receipt string.
    const receipt = `rcpt_${courseId.slice(0, 8)}_${req.user.id.slice(0, 6)}`;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: receipt
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json({
      success: true,
      order,
      courseId
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating Razorpay order",
      error: error.message
    });
  }
});

// Route to verify the payment and update user's purchased courses,
// as well as creating a transaction record.
// Route to verify the payment and update user's purchased courses,
// as well as creating a transaction record.
router.post("/verify-payment", authenticateToken, async (req, res) => {
    try {
      console.log("verify-payment: Request body:", req.body);
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      console.log("verify-payment: Concatenated body for signature:", body);
      
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
      console.log("verify-payment: Expected signature:", expectedSignature);
      console.log("verify-payment: Received signature:", razorpay_signature);
  
      const user = await User.findById(req.user.id);
      console.log("verify-payment: Fetched user:", user);
      if (!user) {
        console.log("verify-payment: User not found for id:", req.user.id);
        return res.status(404).json({ message: "User not found" });
      }
  
      if (expectedSignature === razorpay_signature) {
        console.log("verify-payment: Signature matched. Creating transaction record...");
        // Create transaction record
        const transaction = new Transaction({
          user: req.user.id,
          course: courseId,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount: 1999 * 100, // Replace with dynamic amount if needed.
          currency: "INR",
        });
        await transaction.save();
        console.log("verify-payment: Transaction saved:", transaction);
  
        // Update user's purchasedCourses field.
        await User.findByIdAndUpdate(req.user.id, {
          $addToSet: { purchasedCourses: courseId }
        });
        console.log("verify-payment: Updated user's purchasedCourses.");
  
        // Attempt to send a success email.
        try {
          await sendMail({
            to: user.email,
            subject: "Payment Successful - Course Purchased",
            text: "Your payment was successful and you have purchased the course. Enjoy learning!",
            html: `<p>Your payment was successful and you have purchased the course. Enjoy learning!</p>`,
          });
          console.log("verify-payment: Payment success email sent.");
        } catch (mailError) {
          console.error("verify-payment: Error sending payment success email:", mailError);
        }
  
        return res.status(200).json({ success: true, message: "Payment verified and course purchased" });
      } else {
        console.log("verify-payment: Signature mismatch. Expected:", expectedSignature, "Received:", razorpay_signature);
        // Attempt to send a failure email.
        try {
          await sendMail({
            to: user.email,
            subject: "Payment Failed - Instruct",
            text: "Your payment could not be verified. Please try again or contact support.",
            html: `<p>Your payment could not be verified. Please try again or contact support.</p>`,
          });
          console.log("verify-payment: Payment failure email sent.");
        } catch (mailError) {
          console.error("verify-payment: Error sending payment failure email:", mailError);
        }
        return res.status(400).json({ success: false, message: "Invalid signature" });
      }
    } catch (error) {
      console.error("verify-payment: Error in verify-payment:", error);
      return res.status(500).json({
        success: false,
        message: "Error verifying payment",
        error: error.message
      });
    }
  });
  
  module.exports = router;
  