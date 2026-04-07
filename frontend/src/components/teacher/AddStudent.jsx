import React, { useState, useEffect } from "react";
import { useUpdateUser, useCreateStudent } from "../../hooks/useUsers"; // ✅ ADD
import { useDispatch } from "react-redux";
import { closeModal } from "../../store/modalSlice";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Button from "../ui/Button";
import Input from "../ui/Input";
import {
  FaEye,
  FaEyeSlash,
  FaUserLock,
  FaMailBulk,
  FaUser,
  FaUserPlus,
  FaEdit,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";

// ✅ Dynamic schema
const getSchema = (isEdit) =>
  z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: isEdit
      ? z.string().optional()
      : z.string()
        .min(6, "Minimum 6 characters")
        .regex(/[A-Z]/, "At least one uppercase letter")
        .regex(/[0-9]/, "At least one number")
        .regex(/[@$!%*?&]/, "At least one special character"),
  });

const AddStudent = ({ editUser }) => {
  const dispatch = useDispatch();

  const isEdit = !!editUser;

  const { mutate: createStudent, isPending: creating } = useCreateStudent();
  const { mutate: updateUser, isPending: updating } = useUpdateUser();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(getSchema(isEdit)),
    mode: "onChange",
  });

  // ✅ Prefill for edit
  useEffect(() => {
    if (editUser) {
      reset({
        name: editUser.name,
        email: editUser.email,
      });
    }
  }, [editUser, reset]);

  const onSubmit = (data) => {
    setServerError("");

    const loadingToast = toast.loading(
      isEdit ? "Updating student..." : "Creating student..."
    );

    if (isEdit) {
      // ✏️ UPDATE
      updateUser(
        { id: editUser._id, form: data },
        {
          onSuccess: () => {
            toast.success("Student updated successfully", {
              id: loadingToast,
            });
            dispatch(closeModal());
          },
          onError: (err) => {
            const message =
              err?.response?.data?.message || "Update failed";

            toast.error(message, { id: loadingToast });
            setServerError(message);
          },
        }
      );
    } else {
      // ➕ CREATE
      createStudent(data, {
        onSuccess: () => {
          toast.success("Student created successfully", {
            id: loadingToast,
          });

          reset();
          dispatch(closeModal());
        },
        onError: (err) => {
          const message =
            err?.response?.data?.message || "Something went wrong";

          toast.error(message, { id: loadingToast });
          setServerError(message);
        },
      });
    }
  };

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex justify-center items-center gap-3 mb-2">

        <div className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-sm
          ${isEdit ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
          {isEdit ? <FaEdit /> : <FaUserPlus />}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Student" : "Create Student"}
          </h2>
          <p className="text-xs text-gray-500">
            {isEdit
              ? "Update student details"
              : "Add new student account"}
          </p>
        </div>
      </div>

      {/* ERROR */}
      {serverError && (
        <div className="text-sm px-3 py-2 rounded-md border bg-red-50 text-red-700 border-red-200">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* NAME */}
        <div>
          <Input
            label="Full Name"
            placeholder="Enter full name"
            icon={<FaUser />}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>
        <div>
          {/* EMAIL */}
          <Input
            label="Email Address"
            placeholder="you@example.com"
            icon={<FaMailBulk />}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* PASSWORD (ONLY CREATE) */}
        {!isEdit && (
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Minimum 6 characters"
              icon={<FaUserLock />}
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
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">

          <Button
            type="button"
            onClick={() => dispatch(closeModal())}
            variant="secondary"
          >
            <FiX />
            Cancel
          </Button>

          <Button
            disabled={!isValid || creating || updating}
          >
            {(creating || updating) ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>
                {isEdit ? <FaEdit size={18} /> : <FaUserPlus size={18} />}
                {isEdit ? "Update" : "Create"}
              </>
            )}
          </Button>

        </div>

      </form>
    </div>
  );
};

export default AddStudent;