import React, { useState } from "react";
import API from "../../../api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);

      // Save token & show success toast
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", data.user.type);
      toast.success("Logged in successfully!");


      // Redirect based on user type
      if (data.user.type === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }


    } catch (err) {
      // Show error toast (from server message or fallback)
      const message = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    // Updated background gradient: purples & dark
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r 
                    from-purple-900 via-gray-900 to-black px-4">
      {/* Card container: slightly lighter background, new border color */}
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="mb-6 text-center">
          <img
            src="assets/img/logo/main_logo.svg"
            alt="Logo"
            className="mx-auto w-20 h-20 mb-4 transition-transform duration-300 hover:scale-105"
          />
          <h1 className="text-2xl font-bold text-white">
            Welcome Back
          </h1>
          <p className="text-gray-300 mt-2">
            Please log in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={form.email}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-gray-100 
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 
                         placeholder-gray-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={form.password}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-gray-100
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                         placeholder-gray-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white text-sm font-semibold 
                       rounded-lg hover:bg-purple-700 transition-colors duration-300 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Log In
          </button>
        </form>

        <div className="mt-4">
        {/* Link to Google OAuth */}
        <a
          href="http://localhost:5000/api/auth/google"
          className="w-full py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300 block text-center"
        >
          Sign in with Google
        </a>
      </div>

        {/* Extra Links */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <Link
            to="/forgot-password"
            className="hover:text-purple-300 hover:underline transition-colors"
          >
            Forgot password?
          </Link>
          <Link
            to="/register"
            className="hover:text-purple-300 hover:underline transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
