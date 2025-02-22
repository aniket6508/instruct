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
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instruct</title>
    <style>
        :root {
            --primary-color: #eb9f18;
            --secondary-color: #b16901;
            --text-primary: #c6c6c4;
            --text-secondary: #8a8a89;
            --dark-bg: #0a0a0a;
            --darker-bg: #050505;
            --card-bg: #141414;
        }
        
        body {
            list-style: none;
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
            border-bottom: 2px solid var(--primary-color);
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at top right, rgba(235, 159, 24, 0.1), transparent 60%),
                        radial-gradient(circle at bottom left, rgba(177, 105, 1, 0.1), transparent 60%);
        }

        .welcome-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            box-shadow: 0 4px 15px rgba(235, 159, 24, 0.3);
        }

        .content {
            padding: 40px;
            background-color: var(--card-bg);
        }

        h1 {
            color: var(--primary-color);
            font-size: 28px;
            margin: 0 0 20px;
            text-align: center;
            font-weight: 600;
        }

        .feature-card {
            background: linear-gradient(145deg, #1c1c1c, #0f0f0f);
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
            border: 1px solid rgba(235, 159, 24, 0.1);
        }

        .feature-title {
            color: var(--primary-color);
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .quote {
            font-style: italic;
            color: var(--text-secondary);
            text-align: center;
            padding: 20px;
            margin: 20px 0;
            border-left: 3px solid var(--primary-color);
            background: rgba(235, 159, 24, 0.05);
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
        }

        .social-links {
            margin: 20px 0;
            display: inline-flex
        }

        .social-icon {
            display: flex; 
    align-items: center; 
    justify-content: center; 
    margin: 0 10px;
    width: 36px;
    height: 36px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 50%;
            padding: 8px;
            transition: all 0.3s ease;
            opacity: 0.8;
        }

        .social-icon:hover {
            opacity: 1;
            transform: translateY(-2px);
        }

        @media only screen and (max-width: 480px) {
            .container { padding: 20px 10px; }
            .content { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-wrapper">
            <div class="header">
                <div class="welcome-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#ffffff">
                        <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
                    </svg>
                </div>
                <div class="logo">
                    <img src="Assets used/mail header.svg" alt="Instruct">
                </div>
            </div>
            
            <div class="content">
                <h1>Begin Your Learning Journey</h1>
                <p style="text-align: center; color: var(--text-primary);">
                    Welcome to a community of innovators, creators, and lifelong learners!
                </p>

                <div class="quote">
                    "Education is not preparation for life; education is life itself." - John Dewey
                </div>

                <div class="feature-card">
                    <div class="feature-title">🎯 Your Path to Excellence</div>
                    <p>Every expert was once a beginner. Your decision to join Instruct marks the first step toward mastery. Our cutting-edge methods are designed to transform your potential into expertise.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-title">🌟 When You'll Succeed</div>
                    <p>A teacher can guide you, but your success depends on your own effort and determination. Research from the *Journal of Personality and Social Psychology* (Duckworth et al., 2007) found that perseverance and self-discipline, rather than talent alone, are key factors in achieving excellence.</p>
                </div>

                <div class="feature-card">
                    <div class="feature-title">🚀 Your Next Steps</div>
                    <p>1. Complete your profile
                    <br>2. Join our community forum
                    <br>3. Set your learning schedule
                    <br>4. Start your first course</p>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="#" class="button">Start Learning Now</a>
                </div>

                <p style="color: var(--text-secondary); font-size: 14px; text-align: center; margin-top: 30px;">
                    "The future belongs to those who learn more skills and combine them in creative ways." - Robert Greene
                </p>
            </div>

            <div class="footer">
                <div class="social-links">
                    <a href="https://t.me/instructedu" class="social-icon">
                        <img src="Assets used/tele.svg.svg" alt="Telegram">
                    </a>
                    <a href="https://www.youtube.com/@Instruct-edu?sub_confirmation=1" class="social-icon">
                        <img src="Assets used/yt (2).svg" alt="Youtube">
                    </a>
                    <a href="https://whatsapp.com/channel/0029VapAEFwIt5rn5nNfnx05" class="social-icon">
                        <img src="Assets used/whatsapp.svg" alt="Whatsapp">
                    </a>
                </div>
                <p>&copy; 2025 Instruct. All rights reserved.</p>
                <p>This is an automated message. Please do not reply.</p>
                <li><a href="terms.html">Terms & Conditions</a></li>
                      <li><a href="privacy.policy.html">Privacy Policy</a></li>
        </div>
    </div>
</body>
</html>`,
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
