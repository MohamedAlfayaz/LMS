import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginMutation = useLogin();

  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await loginMutation.mutateAsync({
        email,
        password,
        role,
      });

      const token = res.token;

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);

      dispatch(
        loginSuccess({
          token,
          user: decoded,
          role: decoded.role,
        })
      );

      if (decoded.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex rounded-3xl shadow-lg overflow-hidden max-w-4xl mx-auto">

        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center p-12">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome Back 👋
            </h1>
            <p className="mt-6 text-lg text-indigo-100">
              Continue your learning journey and track your progress easily.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md bg-white p-10">

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Sign In
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Enter your credentials to continue
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>

              {/* ROLE TOGGLE */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {["Student", "Teacher"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                      role === r
                        ? "bg-white shadow text-indigo-600"
                        : "text-gray-500"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Password
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

              {/* REMEMBER / FORGOT */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-indigo-600" />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-indigo-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold disabled:opacity-50 flex items-center justify-center"
              >
                {loginMutation.isPending ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  `Login as ${role}`
                )}
              </button>
            </form>

            {/* REGISTER */}
            <p className="text-sm text-center mt-8 text-gray-500">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-medium hover:underline"
              >
                Register
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;