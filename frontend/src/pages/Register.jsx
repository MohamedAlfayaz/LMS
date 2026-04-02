import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useAuth"
import { FaEye, FaEyeSlash, FaUserLock, FaMailBulk, FaUser, FaUserPlus, FaBookOpen, FaChartLine, FaBullseye } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[0-9]/, "At least one number")
    .regex(/[@$!%*?&]/, "At least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });


  const onSubmit = (data) => {
    mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          reset();
          navigate("/login");
        },
        onError: (err) => {
          setError("root", {
            message:
              err?.response?.data?.message || "Registration failed",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center 
                bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-800 
                text-white p-10 lg:p-14 relative overflow-hidden">

          {/* BACKGROUND GLOW */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl"></div>

          {/* TOP CONTENT */}
          <div className="relative z-10 flex flex-col items-center gap-3">

            {/* ICON */}
            <div className="w-12 h-12 flex items-center justify-center rounded-xl 
                    bg-white/20 backdrop-blur mb-3 shadow-lg">
              <FaUserPlus size={24} />
            </div>

            {/* TITLE */}
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              Join the Platform
            </h1>

            {/* SUBTITLE */}
            <p className="mt-2 text-sm text-center lg:text-base text-indigo-100 max-w-sm">
              Create your account and unlock powerful learning tools designed to help you grow faster.
            </p>

          </div>

          {/* FEATURES */}
          <div className="relative z-10 mt-8 space-y-4">

            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur">
              <FaBookOpen className="text-yellow-300" />
              <p className="text-sm">Learn smarter with structured content</p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur">
              <FaChartLine className="text-green-300" />
              <p className="text-sm">Track your progress in real-time</p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur">
              <FaBullseye className="text-pink-300" />
              <p className="text-sm">Achieve your learning goals faster</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            {/* MOBILE TITLE */}
            <div className="text-center mb-4">

              {/* ICON */}
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl 
                    bg-indigo-100 text-indigo-600 shadow-md">
                  <FaUserPlus />
                </div>
              </div>

              {/* MAIN HEADING */}
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Account
              </h2>

              {/* SUB HEADING */}
              <p className="text-sm text-gray-500 mt-1">
                Join and start your learning journey
              </p>

            </div>

            {/* ERROR */}
            {errors.root && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                {errors.root.message}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* NAME */}
              <div>
                <Input
                  label="Full Name"
                  type="text"
                  icon={<FaUser />}
                  placeholder="Your Full Name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  icon={<FaMailBulk />}
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">
                    {errors.email.message}
                  </p>
                )}
              </div>


              {/* PASSWORD */}
              <div className="relative mt-2">
                <Input
                  label="Password"
                  icon={<FaUserLock />}
                  type={show ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  {...register("password")}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button
                    type="button"
                    onClick={() => setShow(!show)}
                    variant="ghost"
                  >
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative mt-2">
                <Input
                  label="Confirm Password"
                  icon={<FaUserLock />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  {...register("confirmPassword")}
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
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* BUTTON */}
              <div className="flex justify-center items-center">
                <Button
                  type="submit"
                  disabled={!isValid || isPending}
                  variant="register"
                >
                  <FaUserPlus />
                  {
                    isPending ? (
                      <span className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                    ) : (
                      "Create Account"
                    )}
                </Button>
              </div>
            </form>

            {/* LOGIN LINK */}
            <p className="text-sm text-center mt-4 text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;