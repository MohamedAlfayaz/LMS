import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch {
      localStorage.removeItem("token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Student Performance & Article Analytics Dashboard
        </Link>

        {/* Role Based Navigation */}
        <div className="flex items-center space-x-6">
          
          {role === "teacher" && (
            <Link
              to="/teacher"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Teacher
            </Link>
          )}

          {role === "student" && (
            <Link
              to="/student"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Student
            </Link>
          )}

          {/* Auth Buttons */}
          {!token ? (
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
