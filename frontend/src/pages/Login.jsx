import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { FaEye, FaEyeSlash, FaUserLock, FaMailBulk } from "react-icons/fa";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE (DESKTOP + TABLET) */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-10 lg:p-14">

          <h1 className="text-3xl lg:text-4xl text-center font-bold leading-tight">
            Welcome Back 👋
          </h1>

          <p className="mt-5 text-sm text-center lg:text-base text-indigo-100">
            Continue your learning journey and track your progress easily.
          </p>

          {/* EXTRA VISUAL (OPTIONAL) */}
          <div className="mt-10 hidden lg:block">
            <div className="bg-white/10 backdrop-blur p-4 text-center rounded-xl">
              <p className="text-sm">
                🚀 Learn smarter
              </p>
              <p className="text-sm">📊 Track progress</p>
              <p className="text-sm">🎯 Achieve goals</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            {/* MOBILE TITLE */}
            <div className="md:hidden mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome Back 👋
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Login to continue
              </p>
            </div>

            {/* HEADER */}
            <h2 className="text-2xl text-center sm:text-3xl font-bold text-gray-900 mb-2">
              Sign In
            </h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              Enter your credentials to continue
            </p>

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
                  <div className="text-red-500 text-xs">
                    {errors.email.message}
                  </div>
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
              <div className="flex items-center justify-around text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-indigo-600" />
                  Remember
                </label>

                <Link
                  to="/forgot-password"
                  className="text-indigo-600 hover:underline"
                >
                  Forgot ?
                </Link>
              </div>

              {/* BUTTON */}
              <div className="flex justify-center items-center">
                <Button
                  type="submit"
                  disabled={!isValid || loginMutation.isPending}
                  variant="primary"
                >
                  {loginMutation.isPending ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    "Login"
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