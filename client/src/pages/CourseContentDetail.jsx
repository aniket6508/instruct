import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import { PlayCircle, HelpCircle, FileText, Music } from "lucide-react";
import Modal from "react-modal";
import * as pdfjsLib from 'pdfjs-dist';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

// Set up PDF.js worker URL with dynamic version
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const extractKeyFromUrl = (url) => {
  const parts = url.split("/");
  return parts.slice(3).join("/");
};

const CourseContentDetail = () => {
  const { courseId, subjectId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [subject, setSubject] = useState(null);
  const [activeChapters, setActiveChapters] = useState({});
  const [loading, setLoading] = useState(true);
  const [pdfViewerUrl, setPdfViewerUrl] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const handleOpenProtectedResource = async (resourceUrl, type) => {
    try {
      const token = localStorage.getItem("token");
      const key = extractKeyFromUrl(resourceUrl);
      const presignedResponse = await API.get(
        `/presigned-url/presigned-url?key=${encodeURIComponent(key)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const signedUrl = presignedResponse.data.url;
      const response = await fetch(signedUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      if (type === "pdf") {
        setPdfViewerUrl(blobUrl);
        setPdfError(null);
        setPageNumber(1);
      } else if (type === "audio") {
        setAudioUrl(blobUrl);
        setShowAudioPlayer(true);
      }
    } catch (error) {
      console.error("Error opening protected resource:", error);
      setPdfError(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    API.get(`/courses/course/${courseId}/content`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
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
  const closeAudioPlayer = () => {
    setShowAudioPlayer(false);
    setAudioUrl(null);
  };

  const renderPage = async (pdf, pageNum) => {
    try {
      setIsRendering(true);
      const page = await pdf.getPage(pageNum);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      const viewport = page.getViewport({ scale: 1.5 });

      // Handle HiDPI displays
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = viewport.width * pixelRatio;
      canvas.height = viewport.height * pixelRatio;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      context.scale(pixelRatio, pixelRatio);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      setIsRendering(false);
    } catch (error) {
      console.error("Error rendering page:", error);
      setPdfError(error);
      setIsRendering(false);
    }
  };


  // In the same file, update the PDF loading useEffect
  useEffect(() => {
    if (pdfViewerUrl) {
      const loadPdf = async () => {
        try {
          const pdf = await pdfjsLib.getDocument(pdfViewerUrl).promise;
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          await renderPage(pdf, pageNumber);
        } catch (error) {
          console.error("Error loading PDF:", error);
          setPdfError(error);
        }
      };
      loadPdf();
    }
  }, [pdfViewerUrl]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pdfDoc, pageNumber);
    }
  }, [pageNumber]);

  const toggleChapter = (index) => {
    setActiveChapters((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const closePdfViewer = () => {
    setPdfViewerUrl(null);
    setPdfDoc(null);
    setPageNumber(1);
    setNumPages(null);
    setPdfError(null);
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
    <div className="min-h-screen w-screen  text-white pt-250 p-8">
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
              <span className="text-2xl">
                {activeChapters[index] ? "-" : "+"}
              </span>
            </div>
            {activeChapters[index] && (
              <div className="px-4 pb-4 border-t border-gray-700 flex flex-col space-y-2">
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

      {/* PDF Viewer Modal */}
      {pdfViewerUrl && (
        <Modal
          isOpen={true}
          onRequestClose={closePdfViewer}
          contentLabel="PDF Viewer"
          className="fixed pt-250 inset-0 flex items-center justify-center p-4 z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
        >
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">PDF Viewer</h2>
              <button
                onClick={closePdfViewer}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Close
              </button>
            </div>

            {pdfError ? (
              <div className="text-red-600 p-4 text-center">
                <p>Error loading PDF: {pdfError.message}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div
                  className="w-full overflow-auto mb-4 relative"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {isRendering && (
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
                      <p className="text-gray-600">Loading page...</p>
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    className="mx-auto border border-gray-300 shadow-lg"
                  />
                </div>

                <div className="flex items-center justify-center gap-4 p-2 bg-gray-100 rounded-lg w-full">
                  <button
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(prev => prev - 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(prev => prev + 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {showAudioPlayer && audioUrl && (
        <Modal
          isOpen={true}
          onRequestClose={closeAudioPlayer}
          contentLabel="Audio Player"
          className="fixed pt-250 inset-0 flex items-center justify-center p-4 z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
        >
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Audio Player</h2>
              <button
                onClick={closeAudioPlayer}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Close
              </button>
            </div>
            <AudioPlayer
              autoPlay
              src={audioUrl}
              onPlay={e => console.log("onPlay")}
              showJumpControls={true}
              customProgressBarSection={['PROGRESS_BAR']}
              customControlsSection={['MAIN_CONTROLS', 'VOLUME_CONTROLS']}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CourseContentDetail;