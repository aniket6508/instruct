require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const User = require("./models/User");
const paymentRoutes = require('./routes/payment');
const passport = require('./config/passport');
const adminRoutes = require("./routes/admin")
const userRoutes = require("./routes/user");
const transactionRoutes = require("./routes/transaction");
const uploadRoutes = require("./routes/upload");
const presignedUrlRoute = require("./routes/presignedUrl");


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes)
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/presigned-url", presignedUrlRoute);




// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error(err));

// Start the server
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected!");
    
    // 1) Create default admin if not exists
    createDefaultAdmin();
  })
  .catch((err) => console.error(err));

// This function checks if admin user exists, otherwise creates one
async function createDefaultAdmin() {
  try {
    const adminEmail = "admin@instruct.edu";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const bcrypt = require("bcrypt");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin", salt);

      const adminUser = new User({
        name: "Default Admin",
        email: adminEmail,
        password: hashedPassword,
        type: "admin",
      });

      await adminUser.save();
      console.log("Default admin user created:", adminEmail, "password: admin");
    } else {
      console.log("Admin user already exists:", existingAdmin.email);
    }
  } catch (error) {
    console.error("Error creating default admin user:", error.message);
  }
}



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
