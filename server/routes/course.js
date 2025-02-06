const jwt = require("jsonwebtoken");
const express = require('express');
const Course = require('../models/Course')
const User = require('../models/User')



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

router.post('/addCourse', (req, res) => {
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

                const { id, courseName, description, videoUrl, pdf, audioFile } = req.body;

                const newCourse = new Course({
                    id,
                    courseName,
                    description,
                    videoUrl,
                    pdf,
                    audioFile
                });

                return newCourse.save()
                    .then(course => {
                        res.status(201).json({
                            success: true,
                            message: "Course created successfully",
                            userId: verified.id,
                            course: course
                        });
                    });
            })
            .catch(error => {
                res.status(500).json({
                    success: false,
                    message: "Error creating course",
                    error: error.message
                });
            });
    } catch (error) {
        res.status(401).json({ message: "Invalid token!" });
    }
});

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
    } catch(error){
        res.status(401).json({ message: "Invalid token!" });
    }
});





module.exports = router;
