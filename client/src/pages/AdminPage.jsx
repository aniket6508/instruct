import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { toast } from "react-hot-toast";
import { Users, BookOpen, LogOut, Plus, FileVideo, FileAudio, FileText, User } from "lucide-react";

function AdminPage() {
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [activeTab, setActiveTab] = useState('course'); // 'course' or 'admin'

  const [courseForm, setCourseForm] = useState({
    courseName: "",
    description: "",
    videoUrl: "",
    pdf: "",
    audioFile: "",
  });

  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const token = localStorage.getItem("token");
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserCount(response.data.userCount);
      setCourseCount(response.data.courseCount);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to fetch admin stats!");
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await API.post(
        "/courses/addCourse",
        courseForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Course added successfully!");
        setCourseForm({
          courseName: "",
          description: "",
          videoUrl: "",
          pdf: "",
          audioFile: "",
        });
        fetchStats();
      } else {
        toast.error(response.data.message || "Failed to add course.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding course.");
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await API.post(
        "/admin/createAdmin",
        adminForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response)
      if (response.data.success) {
        // setAdminForm({ name: "", email: "", password: "" });
        setAdminForm({
          name: "",
          email: "",
          password: ""
        });
        console.log(adminForm)
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

  return (
    <div className="min-h-screen w-screen mx-auto pt-200 p-8 ">
      {/* Navbar */}
      <nav className=" shadow-md px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          {/* <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button> */}
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border  rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-800">{userCount}</h3>
              </div>
            </div>
          </div>
          <div className="border rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <h3 className="text-2xl font-bold text-gray-800">{courseCount}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'course'
                ? 'bg-blue-500 text-black'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('course')}
          >
            <Plus size={20} />
            Add Course
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'admin'
                ? 'bg-blue-500 text-black'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('admin')}
          >
            <User size={20} />
            Create Admin
          </button>
        </div>

        {/* Forms */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'course' ? (
            <>
              <h2 className="text-xl font-semibold text-black mb-6">Add New Course</h2>
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={courseForm.courseName}
                    onChange={(e) => setCourseForm({ ...courseForm, courseName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FileVideo size={16} />
                      Video URL
                    </div>
                  </label>
                  <input
                    type="text"
                    value={courseForm.videoUrl}
                    onChange={(e) => setCourseForm({ ...courseForm, videoUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      PDF URL
                    </div>
                  </label>
                  <input
                    type="text"
                    value={courseForm.pdf}
                    onChange={(e) => setCourseForm({ ...courseForm, pdf: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FileAudio size={16} />
                      Audio File URL
                    </div>
                  </label>
                  <input
                    type="text"
                    value={courseForm.audioFile}
                    onChange={(e) => setCourseForm({ ...courseForm, audioFile: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              {/*  <div>*/}
              {/*  <label className="block text-sm font-medium text-gray-700 mb-1">*/}
              {/*    <div className="flex items-center gap-2">*/}
              {/*      <FileText size={16} />*/}
              {/*      PDF File*/}
              {/*    </div>*/}
              {/*  </label>*/}
              {/*  <input*/}
              {/*    type="file"*/}
              {/*    accept="application/pdf"*/}
              {/*    onChange={(e) => setPdfFile(e.target.files[0])}*/}
              {/*    className="w-full"*/}
              {/*  />*/}
              {/*</div>*/}

              {/*<div>*/}
              {/*  <label className="block text-sm font-medium text-gray-700 mb-1">*/}
              {/*    <div className="flex items-center gap-2">*/}
              {/*      <FileAudio size={16} />*/}
              {/*      Audio File*/}
              {/*    </div>*/}
              {/*  </label>*/}
              {/*  <input*/}
              {/*    type="file"*/}
              {/*    accept="audio/*"*/}
              {/*    onChange={(e) => setAudioFile(e.target.files[0])}*/}
              {/*    className="w-full"*/}
              {/*  />*/}
              {/*</div>*/}

              
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 black-bg"
                >
                  <Plus size={20} />
                  Add Course
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Admin</h2>
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 black-bg"
                >
                  <User size={20} />
                  Create Admin
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;