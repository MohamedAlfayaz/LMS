import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(`/auth/reset-password/${token}`, {
        password,
      });

      setMessage(res.data.message);
      
      if (password.length < 6) {
        setMessage("Password must be at least 6 characters");
        return;
      }

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setMessage("Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-10 shadow rounded-xl w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

        <form onSubmit={handleReset} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-600">
              New Password
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg">
            Reset Password
          </button>

        </form>

        {message && (
          <p className="text-center text-green-600 mt-4">{message}</p>
        )}

      </div>

    </div>
  );
};

export default ResetPassword;