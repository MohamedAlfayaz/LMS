import React, { useState } from "react";
import { useCreateStudent } from "../../hooks/useAddStudent";
import { useDispatch } from "react-redux";
import { closeModal } from "../../store/modalSlice";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../ui/Button";
import Input from "../ui/Input";
import {
  FaEye,
  FaEyeSlash,
  FaUserLock,
  FaMailBulk,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";

// ✅ Validation Schema
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const AddStudent = () => {
  const dispatch = useDispatch();
  const { mutate, isPending } = useCreateStudent();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    setServerError("");

    mutate(data, {
      onSuccess: () => {
        reset();
        dispatch(closeModal());
      },
      onError: (err) => {
        setServerError(
          err?.response?.data?.message || "Something went wrong"
        );
      },
    });
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Create Student
        </h2>
        <p className="text-sm text-gray-500">
          Enter student details below
        </p>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="text-sm px-3 py-2 rounded-md border bg-red-50 text-red-700 border-red-200">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* NAME */}
        <Input
          type="text"
          label="Full Name"
          placeholder="Student Full Name"
          icon={<FaUser />}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}

        {/* EMAIL */}
        <Input
          type="email"
          label="Email Address"
          placeholder="Student Email"
          icon={<FaMailBulk />}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        {/* PASSWORD */}
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

          {errors.password && (
            <p className="text-red-500 text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-2">

          <Button
            type="button"
            onClick={() => dispatch(closeModal())}
            variant="secondary"
          >
            Cancel
          </Button>

          <Button
            variant="success"
            disabled={!isValid || isPending}
          >
            <FaUserPlus />

            {isPending ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Create"
            )}
          </Button>

        </div>

      </form>
    </div>
  );
};

export default AddStudent;