import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { toast } from "react-hot-toast";
import {
  Users,
  BookOpen,
  LogOut,
  Plus,
  User,
  CreditCard,
  Home,
  Settings,
  Bell
} from "lucide-react";

function AdminPage() {
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("course"); // "course" or "admin"
  const [courseViewMode, setCourseViewMode] = useState("add"); // "add", "list", "edit", or "transactions"
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({
    courseName: "",
    description: "",
    includedAssets: "",
    introVideo: "",
    languages: "",
    originalPrice: "",
    discountPrice: "",
    promocode: ""
  });
  const [subjects, setSubjects] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    if (!token || userType !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserCount(response.data.userCount);
      setCourseCount(response.data.courseCount);
      if (response.data.transactionCount !== undefined) {
        setTransactionCount(response.data.transactionCount);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to fetch admin stats!");
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/courses/getAllCourses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setTransactions(res.data.transactions);
        setTransactionCount(res.data.count);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
    }
  };

  // Upload file and update the respective chapter field (pdfLink or audioLink)
  const handleFileUpload = async (subjIndex, chapIndex, field, file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        handleChapterChange(subjIndex, chapIndex, field, res.data.url);
        toast.success("File uploaded successfully");
      } else {
        toast.error("File upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Error uploading file");
    }
  };

  // Functions for managing subjects and chapters dynamically
  const addSubject = () => {
    setSubjects([...subjects, { subjectName: "", chapters: [] }]);
  };

  const removeSubject = (index) => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const handleSubjectNameChange = (index, value) => {
    const newSubjects = [...subjects];
    newSubjects[index].subjectName = value;
    setSubjects(newSubjects);
  };

  const addChapter = (subjectIndex) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters.push({
      chapterName: "",
      quizLink: "",
      audioLink: "",
      pdfLink: "",
      videoLink: ""
    });
    setSubjects(newSubjects);
  };

  const removeChapter = (subjectIndex, chapterIndex) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters.splice(chapterIndex, 1);
    setSubjects(newSubjects);
  };

  const handleChapterChange = (subjectIndex, chapterIndex, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters[chapterIndex][field] = value;
    setSubjects(newSubjects);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const courseData = {
        ...courseForm,
        includedAssets: courseForm.includedAssets.split(",").map((s) => s.trim()),
        languages: courseForm.languages.split(",").map((s) => s.trim()),
        subjects
      };
      let response;
      if (editingCourseId) {
        response = await API.put(`/courses/updateCourse/${editingCourseId}`, courseData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await API.post("/courses/createCourse", courseData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      if (response.data.success) {
        toast.success(editingCourseId ? "Course updated successfully!" : "Course added successfully!");
        setCourseForm({
          courseName: "",
          description: "",
          includedAssets: "",
          introVideo: "",
          languages: "",
          originalPrice: "",
          discountPrice: "",
          promocode: ""
        });
        setSubjects([]);
        setEditingCourseId(null);
        fetchStats();
        if (courseViewMode !== "add") fetchCourses();
      } else {
        toast.error(response.data.message || "Failed to add/update course.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding/updating course.");
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await API.post("/admin/createAdmin", adminForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAdminForm({ name: "", email: "", password: "" });
        fetchStats();
      } else {
        toast.error(response.data.message || "Failed to create admin.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating admin.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    toast.success("Logged out!");
    navigate("/login");
  };

  const handleViewCourses = () => {
    setCourseViewMode("list");
    fetchCourses();
  };

  const handleViewTransactions = () => {
    setCourseViewMode("transactions");
    fetchTransactions();
  };

  const handleEditCourse = (course) => {
    setCourseForm({
      courseName: course.courseName,
      description: course.description,
      includedAssets: course.includedAssets.join(", "),
      introVideo: course.introVideo,
      languages: course.languages.join(", "),
      originalPrice: course.originalPrice,
      discountPrice: course.discountPrice,
      promocode: course.promocode || ""
    });
    setSubjects(course.subjects || []);
    setEditingCourseId(course._id);
    setCourseViewMode("edit");
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.delete(`/courses/deleteCourse/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success("Course deleted successfully!");
        fetchCourses();
        fetchStats();
      } else {
        toast.error(response.data.message || "Failed to delete course.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting course.");
    }
  };

  const cancelEdit = () => {
    setCourseForm({
      courseName: "",
      description: "",
      includedAssets: "",
      introVideo: "",
      languages: "",
      originalPrice: "",
      discountPrice: "",
      promocode: ""
    });
    setSubjects([]);
    setEditingCourseId(null);
    setCourseViewMode("list");
  };

  return (
    <div className="min-h-screen w-screen  pt-10 p-8 text-white">
      {/* Navbar */}
      <nav className="shadow-md px-6 py-4 flex justify-between items-center bg-gray-800 mb-8">
        <div className="flex items-center gap-2">
          <Home size={24} className="text-white" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Bell size={20} className="text-white" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-gray-700 rounded-lg shadow-md p-6 bg-gray-800">
            <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-gray-300">Total Users</p>
                <h3 className="text-2xl font-bold">{userCount}</h3>
              </div>
            </div>
          </div>
          <div
            onClick={handleViewCourses}
            className="cursor-pointer border border-gray-700 rounded-lg shadow-md p-6 bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <BookOpen className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm text-gray-300">Total Courses</p>
                <h3 className="text-2xl font-bold">{courseCount}</h3>
              </div>
            </div>
          </div>
          <div
            onClick={handleViewTransactions}
            className="cursor-pointer border border-gray-700 rounded-lg shadow-md p-6 bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-300">Total Transactions</p>
                <h3 className="text-2xl font-bold">{transactionCount}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setActiveTab("course");
              setCourseViewMode("add");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "course" && courseViewMode === "add"
                ? "bg-blue-500 text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            <Plus size={20} />
            Add Course
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "admin"
                ? "bg-blue-500 text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            <User size={20} />
            Create Admin
          </button>
          <button
            onClick={() => {
              setActiveTab("course");
              setCourseViewMode("list");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              courseViewMode === "list"
                ? "bg-blue-500 text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            <Settings size={20} />
            Courses List
          </button>
        </div>

        {/* Main Content: Course Form / List / Edit / Transactions */}
        {activeTab === "course" && (
          <>
            {courseViewMode === "list" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Courses List</h2>
                {courses.length ? (
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Course Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Intro Video
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Original Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Discount Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                      {courses.map((course) => (
                        <tr key={course._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {course.courseName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              href={course.introVideo}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              View
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {course.originalPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {course.discountPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="text-green-400 hover:text-green-500 mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No courses found.</p>
                )}
                <div className="mt-4">
                  <button
                    onClick={() => setCourseViewMode("add")}
                    className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add New Course
                  </button>
                </div>
              </>
            )}

            {(courseViewMode === "add" || courseViewMode === "edit") && (
              <>
                <h2 className="text-xl font-semibold mb-6">
                  {courseViewMode === "edit" ? "Edit Course" : "Add New Course"}
                </h2>
                <form onSubmit={handleCourseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={courseForm.courseName}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, courseName: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={courseForm.description}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, description: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Included Assets (comma separated)
                    </label>
                    <input
                      type="text"
                      value={courseForm.includedAssets}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, includedAssets: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Intro Video URL
                    </label>
                    <input
                      type="text"
                      value={courseForm.introVideo}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, introVideo: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Languages (comma separated)
                    </label>
                    <input
                      type="text"
                      value={courseForm.languages}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, languages: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Original Price
                    </label>
                    <input
                      type="number"
                      value={courseForm.originalPrice}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, originalPrice: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Discount Price
                    </label>
                    <input
                      type="number"
                      value={courseForm.discountPrice}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, discountPrice: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Promocode
                    </label>
                    <input
                      type="text"
                      value={courseForm.promocode}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, promocode: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Subjects and Chapters Section */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Subjects</h3>
                    {subjects.map((subject, subjIndex) => (
                      <div
                        key={subjIndex}
                        className="border border-gray-700 p-4 rounded mb-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <input
                            type="text"
                            placeholder="Subject Name"
                            value={subject.subjectName}
                            onChange={(e) =>
                              handleSubjectNameChange(subjIndex, e.target.value)
                            }
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => removeSubject(subjIndex)}
                            type="button"
                            className="ml-2 text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                        <div>
                          <h4 className="text-md font-semibold mb-2">Chapters</h4>
                          {subject.chapters.map((chapter, chapIndex) => (
                            <div key={chapIndex} className="mb-2">
                              <input
                                type="text"
                                placeholder="Chapter Name"
                                value={chapter.chapterName}
                                onChange={(e) =>
                                  handleChapterChange(
                                    subjIndex,
                                    chapIndex,
                                    "chapterName",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 mb-1"
                              />
                              <input
                                type="text"
                                placeholder="Quiz Link"
                                value={chapter.quizLink}
                                onChange={(e) =>
                                  handleChapterChange(
                                    subjIndex,
                                    chapIndex,
                                    "quizLink",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 mb-1"
                              />
                              <label className="block text-sm font-medium mb-1">
                                Upload PDF
                              </label>
                              <input
                                type="file"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handleFileUpload(
                                      subjIndex,
                                      chapIndex,
                                      "pdfLink",
                                      e.target.files[0]
                                    );
                                  }
                                }}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 mb-1"
                              />
                              <label className="block text-sm font-medium mb-1">
                                Upload Audio
                              </label>
                              <input
                                type="file"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handleFileUpload(
                                      subjIndex,
                                      chapIndex,
                                      "audioLink",
                                      e.target.files[0]
                                    );
                                  }
                                }}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 mb-1"
                              />
                              <button
                                onClick={() => removeChapter(subjIndex, chapIndex)}
                                type="button"
                                className="text-red-500 hover:text-red-600"
                              >
                                Remove Chapter
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addChapter(subjIndex)}
                            type="button"
                            className="mt-2 text-blue-400 hover:text-blue-500"
                          >
                            Add Chapter
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addSubject}
                      type="button"
                      className="mt-2 text-blue-400 hover:text-blue-500"
                    >
                      Add Subject
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      {courseViewMode === "edit" ? "Update Course" : "Add Course"}
                    </button>
                    {courseViewMode === "edit" && (
                      <button
                        onClick={cancelEdit}
                        type="button"
                        className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}

            {courseViewMode === "transactions" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Transactions List</h2>
                {transactions.length ? (
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                      {transactions.map((txn) => (
                        <tr key={txn._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {txn.razorpay_order_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {txn.course}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹{txn.amount / 100}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(txn.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No transactions found.</p>
                )}
                <div className="mt-4">
                  <button
                    onClick={() => setCourseViewMode("list")}
                    className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
                  >
                    Back to Courses
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "admin" && (
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Create New Admin</h2>
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={adminForm.name}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <User size={20} />
                Create Admin
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
