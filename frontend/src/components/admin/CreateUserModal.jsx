import { useEffect, useState } from "react";
import { useCreateUser, useUpdateUser } from "../../hooks/useUsers";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { FaEye, FaEyeSlash, FaKey, FaMailBulk, FaUser } from "react-icons/fa";

// ✅ Dynamic schema
const getSchema = (isEdit) =>
  z.object({
    name: z.string().min(2, "Name required"),
    email: z.string().email("Invalid email"),

    password: isEdit
      ? z.string().min(6, "Min 6 chars").optional().or(z.literal(""))
      : z.string().min(6, "Password required"),

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
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(getSchema(isEdit)),
    mode: "onChange", // 🔥 instant validation
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
    }
  }, [editUser, reset]);

  // ✅ Submit with safe payload
  const onSubmit = async (form) => {
    try {
      const payload = { ...form };

      // 🔥 CRITICAL FIX
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      if (isEdit) {
        await updateUser.mutateAsync({
          id: editUser._id,
          form: payload,
        });
      } else {
        await createUser.mutateAsync(payload);
      }

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">

      <div className="bg-white p-6 rounded-2xl w-[400px]">
        <h2 className="text-lg text-center font-semibold mb-4">
          {isEdit ? "Edit User" : "Create User"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

          {/* NAME */}
          <Input
            label="Full Name"
            icon={<FaUser />}
            placeholder="Full Name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}

          {/* EMAIL */}
          <Input
            label="Email"
            icon={<FaMailBulk />}
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}

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
          <select
            {...register("role")}
            className="w-full border p-2 rounded"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} variant="secondary">
              Cancel
            </Button>

            <Button
              disabled={
                !isValid ||
                createUser.isLoading ||
                updateUser.isLoading
              }
            >
              {isEdit
                ? (updateUser.isLoading ? "Updating..." : "Update")
                : (createUser.isLoading ? "Creating..." : "Create")}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}