import { useEffect, useState } from "react";
import { useCreateUser, useUpdateUser } from "../../hooks/useUsers";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../ui/Button";
import Input from "../ui/Input";
import {
  FaEye,
  FaEyeSlash,
  FaKey,
  FaMailBulk,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { FiX, FiEdit2 } from "react-icons/fi";

// ✅ Schema
const getSchema = (isEdit) =>
  z.object({
    name: z.string().min(2, "Name required"),
    email: z.string().email("Invalid email"),
    password: isEdit
      ? z.string().optional()
      : z.string().min(6, "Minimum 6 characters"),
    role: z.enum(["student", "teacher"]),
  });

export default function CreateUserModal({ onClose, editUser }) {
  const isEdit = !!editUser;

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(getSchema(isEdit)),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  // ✅ Prefill edit
  useEffect(() => {
    if (editUser) {
      reset({
        name: editUser.name,
        email: editUser.email,
        password: "",
        role: editUser.role,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: "student",
      });
    }
  }, [editUser, reset]);

  // ✅ Submit
  const onSubmit = async (form) => {
    const loadingToast = toast.loading("Processing...");

    try {
      const payload = { ...form };

      if (isEdit && !payload.password) {
        delete payload.password;
      }

      if (isEdit) {
        await updateUser.mutateAsync({
          id: editUser._id,
          form: payload,
        });

        toast.success("User updated", { id: loadingToast });
      } else {
        await createUser.mutateAsync(payload);

        toast.success("User created", { id: loadingToast });
      }

      onClose();
    } catch (err) {
      toast.error("Something went wrong", { id: loadingToast });
    }
  };

  const isLoading = createUser.isLoading || updateUser.isLoading;

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-center items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <FaUser />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit User" : "Create User"}
          </h2>
          <p className="text-xs text-gray-500">
            {isEdit ? "Update user details" : "Add a new user"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* NAME */}
        <div>
          <Input
            label="Full Name"
            icon={<FaUser />}
            placeholder="Enter full name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <Input
            label="Email"
            icon={<FaMailBulk />}
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        {!isEdit && (
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Minimum 6 characters"
              icon={<FaKey />}
              {...register("password")}
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>
        )}

        {/* ROLE */}
        <div>
          <label className="text-sm text-center text-gray-500 mb-1 block">Role</label>

          <div className="flex gap-2">
            {["student", "teacher"].map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => reset({ ...getValues(), role })}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition
                    ${watch("role") === role
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                  }
                  `}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">

          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
          >
            <FiX />
            Cancel
          </Button>

          <Button
            disabled={
              !isValid || isLoading
            }
          >
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>
                {isEdit ? <FiEdit2 size={18} /> : <FaUserPlus size={18} />}
                {isEdit ? "Update" : "Create"}
              </>
            )}
          </Button>

        </div>

      </form>
    </div>
  );
}