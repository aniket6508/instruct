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
            html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Failed</title>
    <style>
        :root {
            --primary-color: #eb9f18;
            --secondary-color: #b16901;
            --error-color: #dc2626;
            --error-secondary: #991b1b;
            --text-primary: #c6c6c4;
            --text-secondary: #8a8a89;
            --dark-bg: #0a0a0a;
            --darker-bg: #050505;
            --card-bg: #141414;
        }
        
        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(145deg, var(--dark-bg), #000000);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: var(--text-primary);
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .email-wrapper {
            background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .header {
            background: linear-gradient(145deg, var(--dark-bg), var(--darker-bg));
            padding: 40px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
            border-bottom: 2px solid var(--error-color);
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at top right, rgba(220, 38, 38, 0.1), transparent 60%),
                        radial-gradient(circle at bottom left, rgba(153, 27, 27, 0.1), transparent 60%);
        }

        .error-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--error-color), var(--error-secondary));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }

        .content {
            padding: 40px;
            background-color: var(--card-bg);
        }

        h1 {
            color: var(--error-color);
            font-size: 28px;
            margin: 0 0 20px;
            text-align: center;
            font-weight: 600;
        }

        .transaction-details {
            background: linear-gradient(145deg, #1c1c1c, #0f0f0f);
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid rgba(220, 38, 38, 0.1);
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(220, 38, 38, 0.1);
        }

        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .detail-label {
            color: var(--text-secondary);
        }

        .detail-value {
            color: var(--text-primary);
            font-weight: 600;
        }

        .error-message {
            background: rgba(220, 38, 38, 0.1);
            border-left: 4px solid var(--error-color);
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
        }

        .solution-box {
            background: rgba(235, 159, 24, 0.05);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
        }

        .solution-title {
            color: var(--primary-color);
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .button {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(235, 159, 24, 0.2);
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(235, 159, 24, 0.3);
        }

        .footer {
            text-align: center;
            padding: 30px;
            background: linear-gradient(to bottom, #141414, #0a0a0a);
            color: var(--text-secondary);
            font-size: 13px;
            border-top: 1px solid rgba(198, 198, 196, 0.1);
        }

        @media only screen and (max-width: 480px) {
            .container { padding: 20px 10px; }
            .content { padding: 20px; }
            .transaction-details { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-wrapper">
            <div class="header">
                <div class="error-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#ffffff">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"/>
                    </svg>
                </div>
                <div class="logo">
                    <img src="/Assets used/mail header.svg" alt="EduTech Academy">
                </div>
            </div>
            
            <div class="content">
                <h1>Transaction Failed</h1>
                <p style="text-align: center; color: var(--text-secondary);">
                    We encountered an issue while processing your payment. Don't worry, no charges were made to your account.
                </p>

                <div class="transaction-details">
                    <div class="detail-row">
                        <span class="detail-label">Transaction ID</span>
                        <span class="detail-value">#TRX-789456123</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date</span>
                        <span class="detail-value">January 31, 2025</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Amount</span>
                        <span class="detail-value">999 INR</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Course</span>
                        <span class="detail-value">Vision</span>
                    </div>
                </div>

                <div class="error-message">
                    <strong style="color: var(--error-color);">Error Details:</strong>
                    <p style="margin: 10px 0 0 0;"> Please ensure you have enough balance or try a different payment method.</p>
                </div>

                <div class="solution-box">
                    <div class="solution-title">
                        💡 What You Can Do
                    </div>
                    <ul style="color: var(--text-secondary); margin: 10px 0; padding-left: 20px;">
                        <li>Check your card balance</li>
                        <li>Verify your card details</li>
                        <li>Try a different payment method</li>
                        <li>Contact support if the issue persists</li>
                    </ul>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" class="button">Try Payment Again</a>
                </div>

                <p style="color: var(--text-secondary); font-size: 14px; text-align: center; margin-top: 30px;">
                    Need help? Our support team is available 24/7 to assist you.
                </p>
            </div>

            <div class="footer">
                <p>If you continue to experience issues, please contact support at <a href="mailto:contact@instructedu.in">contact@instructedu.in</a>.</p>
                <p>&copy; 2025 Instruct. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>`,
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
  