const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    pdf: { type: String, required: true },
    audioFile: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
