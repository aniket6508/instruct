const jwt = require("jsonwebtoken");
const express = require('express');
const Course = require('../models/Course')
const User = require('../models/User')
const upload = require("../utils/upload");


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

router.get('/getAllCourses', authenticateToken, (req, res) => {
    Course.find()
        .then(courses => {
            if (!courses.length) {
                return res.status(404).json({
                    success: false,
                    message: "No courses found"
                });
            }

            res.status(200).json({
                success: true,
                count: courses.length,
                userId: req.user.id,
                courses
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Server error occurred while fetching courses",
                error: error.message
            });
        });
});

router.post(
    "/addCourse",
    authenticateToken,
    // Use multer to handle two file fields (if present)
    upload.fields([{ name: "pdf", maxCount: 1 }, { name: "audioFile", maxCount: 1 }]),
    async (req, res) => {
        try {
            const verified = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
            const user = await User.findById(verified.id);
            if (!user) return res.status(404).json({ message: "User not found!" });
            if (user.type !== "admin") {
                return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
            }
            const { courseName, description, videoUrl } = req.body;
            // Files come from req.files – if using local disk, file.path; if S3, file.location
            const pdfFile = req.files["pdf"] ? req.files["pdf"][0].location || req.files["pdf"][0].path : "";
            const audioFile = req.files["audioFile"] ? req.files["audioFile"][0].location || req.files["audioFile"][0].path : "";
            const newCourse = new Course({
                id: Date.now(), // or some other unique identifier
                courseName,
                description,
                videoUrl,
                pdf: pdfFile,
                audioFile: audioFile,
            });
            const course = await newCourse.save();
            res.status(201).json({ success: true, message: "Course created successfully", userId: verified.id, course });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error creating course", error: error.message });
        }
    }
);

router.delete('/courses/:courseId', (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided!" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        User.findById(verified.id)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: "User not found!" });
                }

                if (user.type !== 'admin') {
                    return res.status(403).json({
                        success: false,
                        message: "Access denied. Admin privileges required."
                    });
                }

                return Course.findByIdAndDelete(req.params.courseId)
                    .then(course => {
                        if (!course) {
                            return res.status(404).json({
                                success: false,
                                message: "Course not found"
                            });
                        }

                        res.status(200).json({
                            success: true,
                            message: "Course deleted successfully",
                            userId: verified.id,
                            deletedCourse: course
                        });
                    });
            })
            .catch(error => {
                res.status(500).json({
                    success: false,
                    message: "Error deleting course",
                    error: error.message
                });
            });
    } catch (error) {
        res.status(401).json({ message: "Invalid token!" });
    }
});

// routes/course.js (or add a new endpoint)
router.get('/course/:courseId', authenticateToken, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Allow access if the user is an admin, or if the user is a student who has purchased the course
        const user = await User.findById(req.user.id);
        if (user.type === 'student' && !user.purchasedCourses.includes(course._id)) {
            return res.status(403).json({ message: "Access denied. You have not purchased this course." });
        }

        res.status(200).json({ course });
    } catch (error) {
        res.status(500).json({ message: "Error fetching course", error: error.message });
    }
});



// Stream PDF securely
router.get("/course/:courseId/pdf", authenticateToken, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        const user = await User.findById(req.user.id);
        if (user.type === "student" && !user.purchasedCourses.includes(course._id)) {
            return res.status(403).json({ message: "Access denied. You have not purchased this course." });
        }
        if (process.env.NODE_ENV === "production") {
            const s3 = new aws.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION,
            });
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: course.pdf, // Assuming you store the S3 key here
            };
            s3.getSignedUrl("getObject", params, (err, url) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Error generating signed URL" });
                }
                res.json({ url });
            });
        } else {
            // Local file streaming
            const filePath = path.join(__dirname, "../uploads/", course.pdf);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline");
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (error) {
        res.status(500).json({ message: "Error streaming PDF", error: error.message });
    }
});




// Stream Audio securely
router.get("/course/:courseId/audio", authenticateToken, async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
      const user = await User.findById(req.user.id);
      if (user.type === "student" && !user.purchasedCourses.includes(course._id)) {
        return res.status(403).json({ message: "Access denied. You have not purchased this course." });
      }
      if (process.env.NODE_ENV === "production") {
        const s3 = new aws.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
        });
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: course.audioFile,
        };
        s3.getSignedUrl("getObject", params, (err, url) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error generating signed URL for audio" });
          }
          res.json({ url });
        });
      } else {
        const filePath = path.join(__dirname, "../uploads/", course.audioFile);
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", "inline");
        fs.createReadStream(filePath).pipe(res);
      }
    } catch (error) {
      res.status(500).json({ message: "Error streaming audio", error: error.message });
    }
  });


  


module.exports = router;
