import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import Button from "./ui/Button";
import Input from "./ui/Input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Schema
const schema = z.object({
  password: z
    .string()
    .min(6, "Minimum 6 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[0-9]/, "At least one number"),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const res = await API.post(
        `/auth/reset-password/${token}`,
        { password: data.password }
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError("root", {
        message: err?.response?.data?.message || "Reset failed",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-10 lg:p-14">

          <h1 className="flex justify-center items-center gap-3 text-3xl lg:text-4xl font-bold">
            Reset Password
            <span className="text-yellow-400">
              <FaLock />
            </span>
          </h1>

          <p className="mt-4 text-sm lg:text-base text-indigo-100">
            Create a new secure password and continue your journey.
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            {/* MOBILE TITLE */}
            <div className="md:hidden mb-3 text-center">
              <h1 className="flex justify-center items-center gap-3 text-2xl font-bold text-gray-900">
                Reset Password
                <span className="text-indigo-600">
                  <FaLock />
                </span>
              </h1>
              <p className="text-sm text-gray-500">
                Enter a new password
              </p>
            </div>
            <h2 className="text-2xl text-center font-bold mb-2">
              New Password
            </h2>

            <p className="text-sm text-center text-gray-500 mb-4">
              Must be strong password
            </p>

            {/* GLOBAL ERROR */}
            {errors.root && (
              <div className="mb-3 p-2 bg-red-100 text-red-600 rounded text-sm">
                {errors.root.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* PASSWORD */}

              <div className="relative mt-1">
                <Input
                  label="New Password"
                  icon={<FaLock />}
                  type={showPassword ? "text" : "password"}
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

              {/* CONFIRM PASSWORD */}
              <div className="relative mt-1">
                <Input
                  label="Confirm Password"
                  icon={<FaLock />}
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
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
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Updating..." : "Reset Password"}
              </Button>

            </form>

            {/* BACK */}
            <p className="text-sm text-center mt-3 text-gray-500">
              Remember password?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-indigo-600 cursor-pointer"
              >
                Login
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;