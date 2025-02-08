// routes/payment.js
const express = require('express');
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Course = require('../models/Course');
const User = require('../models/User');
const jwt = require("jsonwebtoken");

// Re-use your authentication middleware (or import it from a common file)
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

// Create a Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Route to create an order
router.post('/create-order', authenticateToken, async (req, res) => {
    try {
        const { courseId } = req.body;
        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Define the amount (in paise). Here, for example, ₹1999 is converted to 199900 paise.
        const amount = 1999 * 100;  // You can also use course.price if defined

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_order_${courseId}_${req.user.id}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            order,
            courseId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating Razorpay order",
            error: error.message
        });
    }
});

// Route to verify the payment and update user's purchased courses
router.post('/verify-payment', authenticateToken, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

        // Create expected signature using HMAC SHA256 and your Razorpay secret
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is verified: update the user record to mark the course as purchased
            await User.findByIdAndUpdate(req.user.id, {
                $addToSet: { purchasedCourses: courseId }
            });
            sendMail({
                to: user.email,
                subject: "Payment Successful - Course Purchased",
                text: "Your payment was successful and you have purchased the course. Enjoy learning!",
                html: `<p>Your payment was successful and you have purchased the course. Enjoy learning!</p>`,
            }).catch((err) => console.error("Error sending payment success email:", err));
            return res.status(200).json({ success: true, message: "Payment verified and course purchased" });
        } else {
            sendMail({
                to: user.email,
                subject: "Payment Failed - Instruct",
                text: "Your payment could not be verified. Please try again or contact support.",
                html: `<p>Your payment could not be verified. Please try again or contact support.</p>`,
            }).catch((err) => console.error("Error sending payment failure email:", err));
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error verifying payment",
            error: error.message
        });
    }
});

module.exports = router;
