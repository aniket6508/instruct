// components/VisionDetails.jsx
import React, { useEffect, useState } from "react";
import API from "../../api";
import { useParams } from "react-router-dom";

function VisionDetails() {
  const { courseId } = useParams(); // assumes the route includes a courseId parameter
  const [pdfUrl, setPdfUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Get secure PDF URL
    API.get(`/courses/course/${courseId}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        // In production, res.data.url contains the signed URL.
        // In local mode, you can use the same endpoint as the src.
        setPdfUrl(res.data.url || `/api/courses/course/${courseId}/pdf`);
      })
      .catch((err) => console.error(err));

    // Get secure Audio URL
    API.get(`/courses/course/${courseId}/audio`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setAudioUrl(res.data.url || `/api/courses/course/${courseId}/audio`);
      })
      .catch((err) => console.error(err));
  }, [courseId]);

  return (
    <div>
      <h1>Vision Details</h1>
      <div>
        <h2>Course PDF</h2>
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            title="Course PDF"
            width="100%"
            height="600px"
            style={{ border: "none" }}
            sandbox="allow-scripts allow-same-origin"
            onContextMenu={(e) => e.preventDefault()}
          ></iframe>
        )}
      </div>
      <div>
        <h2>Course Audio</h2>
        {audioUrl && (
          <audio
            controls
            controlsList="nodownload noplaybackrate"
            onContextMenu={(e) => e.preventDefault()}
          >
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
}

export default VisionDetails;
