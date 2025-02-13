import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import { PlayCircle, HelpCircle, FileText, Music } from "lucide-react";

// Helper to extract S3 object key from full URL.
// Assumes your S3 URL format is: https://{bucket}.s3.{region}.amazonaws.com/{key}
const extractKeyFromUrl = (url) => {
  const parts = url.split("/");
  return parts.slice(3).join("/"); // joins everything after the bucket domain
};

const CourseContentDetail = () => {
  const { courseId, subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [activeChapters, setActiveChapters] = useState({});
  const [loading, setLoading] = useState(true);

  // Function to fetch a presigned URL and open the file as a blob.
  const handleOpenProtectedResource = async (resourceUrl, type) => {
    try {
      const token = localStorage.getItem("token");
      const key = extractKeyFromUrl(resourceUrl);

      // Call backend to get a presigned URL using the updated base path
      const presignedResponse = await API.get(
        `presigned-url/presigned-url?key=${encodeURIComponent(key)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const signedUrl = presignedResponse.data.url;

      // Fetch the file using the presigned URL and convert it into a blob.
      const response = await fetch(signedUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Error opening protected resource:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Fetch course content including all subjects using the proper endpoint
    API.get(`/courses/course/${courseId}/content`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        // Expected response: { courseContent: [ { _id, subjectName, chapters: [...] }, ... ] }
        const subjects = res.data.courseContent;
        const foundSubject = subjects.find((subj) => subj._id === subjectId);
        setSubject(foundSubject);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching course content:", err);
        setLoading(false);
      });
  }, [courseId, subjectId]);

  const toggleChapter = (index) => {
    setActiveChapters((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">Loading subject content...</p>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">Subject not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen pt-250 bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{subject.subjectName}</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>
      
      {/* Chapters Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subject.chapters.map((chapter, index) => (
          <div
            key={index}
            className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => toggleChapter(index)}
          >
            <div className="p-4 flex justify-between items-center">
              <span className="text-lg font-medium">{chapter.chapterName}</span>
              <span className="text-2xl">{activeChapters[index] ? "-" : "+"}</span>
            </div>
            {activeChapters[index] && (
              <div className="px-4 pb-4 border-t border-gray-700 flex flex-col space-y-2 opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenProtectedResource(chapter.pdfLink, "pdf");
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded"
                >
                  <FileText size={20} />
                  PDF
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenProtectedResource(chapter.audioLink, "audio");
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded"
                >
                  <Music size={20} />
                  Audio Book
                </button>
                <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded">
                  <PlayCircle size={20} />
                  Play Video
                </button>
                <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded">
                  <HelpCircle size={20} />
                  Quiz
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContentDetail;
