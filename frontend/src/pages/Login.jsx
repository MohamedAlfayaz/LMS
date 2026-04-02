import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { FaUserLock, FaMailBulk, FaEye, FaEyeSlash, FaBookOpen, FaChartLine, FaBullseye, FaSignInAlt } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Minimum 6 characters")
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginMutation = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  /* 🔥 AUTO REDIRECT IF ALREADY LOGGED IN */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      // 🔐 check expiry
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return;
      }

      // redirect
      switch (decoded.role) {
        case "admin":
          navigate("/admin");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "student":
          navigate("/student");
          break;
        default:
          localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("token");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await loginMutation.mutateAsync(data);

      const token = res.token;
      localStorage.setItem("token", token);

      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch {
        setError("root", { message: "Invalid token" });
        return;
      }

      dispatch(loginSuccess({ token, user: decoded }));

      switch (decoded.role) {
        case "admin":
          navigate("/admin");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "student":
          navigate("/student");
          break;
        default:
          navigate("/login");
      }

    } catch (err) {
      setError("root", {
        message: err?.response?.data?.message || "Login failed",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* 🔥 LEFT SIDE (PREMIUM HERO) */}
        <div className="hidden md:flex flex-col justify-between 
                      bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 
                      text-white p-10 lg:p-14 relative overflow-hidden">

          {/* BACKGROUND GLOW */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl"></div>

          {/* TOP */}
          <div className="relative z-10 flex flex-col items-center">

            <div className="w-12 h-12 flex items-center justify-center rounded-xl 
                          bg-white/20 backdrop-blur mb-6 shadow-lg">
              <FaUserLock size={22} />
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              Welcome Back
            </h1>

            <p className="mt-4 text-sm text-center lg:text-base text-indigo-100 max-w-sm">
              Continue your journey, track progress, and unlock your learning potential.
            </p>

          </div>

          {/* FEATURES */}
          <div className="relative z-10 space-y-4 mt-10">

            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur">
              <FaBookOpen className="text-yellow-300" />
              <p className="text-sm">Structured learning paths</p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur">
              <FaChartLine className="text-green-300" />
              <p className="text-sm">Track progress easily</p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur">
              <FaBullseye className="text-pink-300" />
              <p className="text-sm">Achieve your goals faster</p>
            </div>

          </div>
        </div>

        {/* 🔥 RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            {/* 🔥 HEADER */}
            <div className="text-center mb-6">

              <div className="flex justify-center mb-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl 
                              bg-indigo-100 text-indigo-600 shadow-sm">
                  <FaUserLock />
                </div>
              </div>

              <h2 className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Sign In <span className="text-indigo-600"><FaSignInAlt /></span>
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Enter your credentials to continue
              </p>

            </div>

            {/* ERROR */}
            {errors.root && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                {errors.root.message}
              </div>
            )}

            {/* FORM */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

              {/* EMAIL */}
              <div>
                <Input
                  type="email"
                  label="Email Address"
                  icon={<FaMailBulk />}
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <div className="relative mt-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    icon={<FaUserLock />}
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between text-sm">

                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="accent-indigo-600" />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-indigo-600 hover:underline"
                >
                  Forgot?
                </Link>

              </div>

              {/* BUTTON */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={!isValid || loginMutation.isPending}
                  variant="login"
                >
                  {loginMutation.isPending ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <>
                      <FaSignInAlt />
                      Login
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* REGISTER */}
            <p className="text-sm text-center mt-6 text-gray-500">
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