import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useLogin"
import { FaEye, FaEyeSlash, FaUserLock, FaMailBulk, FaUser, FaUserPlus } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
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
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-10 lg:p-14">

          <h1 className="text-3xl lg:text-4xl text-center font-bold leading-tight">
            Join the Platform 🚀
          </h1>

          <p className="mt-5 text-sm text-center lg:text-base text-indigo-100">
            Create your account and start your learning journey today.
          </p>

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
            <div className="md:hidden mb-3 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Create Account 🚀
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Start your journey
              </p>
            </div>

            {/* HEADER */}
            <h2 className="text-2xl text-center sm:text-3xl font-bold text-gray-800">
              Sign Up
            </h2>
            <p className="text-sm text-center text-gray-500 mb-2">
              Fill in your details
            </p>

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
              </div>

              {errors.name && (
                <p className="text-red-500 text-xs">
                  {errors.name.message}
                </p>
              )}

              {/* EMAIL */}
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  icon={<FaMailBulk />}
                  placeholder="you@example.com"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs">
                  {errors.email.message}
                </p>
              )}

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
                  variant="primary"
                >
                  <FaUserPlus />
                  {
                    isPending ?
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      : "Create Account"
                  }
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