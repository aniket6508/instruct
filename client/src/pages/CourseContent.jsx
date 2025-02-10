// components/CourseContent.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import { Atom, Droplet, BookOpen, Cpu, Activity, Code } from "lucide-react";

// Array of icon components to choose randomly from.
const icons = [Atom, Droplet, BookOpen, Cpu, Activity, Code];

const CourseContent = () => {
  const { courseId } = useParams();
  const [courseName, setCourseName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // First, fetch the detailed content (subjects) from the backend.
    API.get(`/courses/course/${courseId}/content`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        // Expecting: { courseContent: [ { subjectName, chapters: [...] }, ... ] }
        setSubjects(res.data.courseContent || []);
        // Then, fetch the basic course details (for course name)
        return API.get(`/courses/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        setCourseName(res.data.course.courseName);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching course content:", err);
        setLoading(false);
      });
  }, [courseId]);

  if (loading) return <p className="text-white">Loading course content...</p>;

  return (
    <div className="container mx-auto p-8">
      {/* Batch heading */}
      <div className="batch-heading flex items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{courseName}</h1>
        <img className="ml-4 h-12" src="assets/img/slider/1.svg" alt="course banner" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => {
            // Randomly select an icon component from the icons array.
            const IconComponent = icons[Math.floor(Math.random() * icons.length)];
            return (
              <a
                key={index}
                href={`/course-content-detail/${courseId}/${subject._id}`}
                className="card p-4 bg-dark border border-gray-700 rounded shadow-lg hover:shadow-xl transition"
              >
                <div className="card-content flex flex-col items-center">
                  <div className="card-icon text-5xl mb-4 text-blue-400">
                    <IconComponent />
                  </div>
                  <h3 className="card-title text-xl font-bold mb-2 text-white">{subject.subjectName}</h3>
                  <p className="card-description text-gray-300">
                    {subject.chapters.length > 0
                      ? `Includes ${subject.chapters.length} chapter${subject.chapters.length > 1 ? "s" : ""}`
                      : "No chapters available"}
                  </p>
                  {subject.chapters.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-400">
                      {subject.chapters.map((chapter, idx) => (
                        <li key={idx}>- {chapter.chapterName}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
