import React from "react";
import API from "../api/api";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { FaMailBulk, FaKey, FaLink } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Schema
const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

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
      const res = await API.post("/auth/forgot-password", data);

      // optional success handling
      if (res.data.resetLink) {
        const token = res.data.resetLink.split("/").pop();
        navigate(`/reset-password/${token}`);
      }

    } catch (err) {
      setError("root", {
        message: err?.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-10">

          <h1 className="flex justify-center items-center gap-3 text-3xl font-bold">
            Forgot Password <span className="text-yellow-400"><FaKey /></span>
          </h1>

          <p className="mt-4 text-center text-sm text-indigo-100">
            Enter your email and we’ll help you reset your password.
          </p>

        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center p-6">

          <div className="w-full max-w-md">

            <h2 className="flex justify-center items-center gap-3 text-2xl font-bold text-gray-900 mb-2">
              Reset Link <span className="text-indigo-600"><FaLink /></span>
            </h2>

            <p className="text-sm text-center text-gray-500 mb-6">
              Enter your email to receive a reset link
            </p>

            {/* ERROR */}
            {errors.root && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                {errors.root.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* EMAIL */}
              <Input
                type="email"
                label="Email Address"
                icon={<FaMailBulk />}
                placeholder="you@example.com"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-red-500 text-xs">
                  {errors.email.message}
                </p>
              )}

              {/* BUTTON */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>

            </form>

            {/* BACK */}
            <p className="text-sm text-center mt-3 text-gray-500">
              Remember password?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-indigo-600 cursor-pointer hover:underline"
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

export default ForgotPassword;