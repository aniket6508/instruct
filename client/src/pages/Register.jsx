import React from "react";

import API from "../api";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registration successful!");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg max-w-sm w-full">
        <div className="mb-6 text-center">
          <img 
            src="assets/img/logo/main_logo.svg" 
            alt="Logo" 
            className="mx-auto w-24 h-24"
          />
          <h1 className="text-2xl font-semibold text-white mt-4">
            Create an Account
          </h1>
        </div>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
              placeholder="Create a password"
              required
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-orange-500">
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-400">
            Already have an account? <a href="login.html" className="text-orange-500 hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
