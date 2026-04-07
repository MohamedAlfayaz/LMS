import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser, createStudent } from "../api/usersApi";

const USERS_KEY = ["users"];

export const useUsers = () => {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: getUsers,

    retry: 2, // don't retry forever
    retryDelay: 2000,
    refetchOnWindowFocus: true,

    // ❌ REMOVE THIS unless needed
    // refetchInterval: 5000,
  });
};

// 🔥 COMMON INVALIDATE FUNCTION
const useInvalidateUsers = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: USERS_KEY });
};

export const useCreateUser = () => {
  const invalidate = useInvalidateUsers();

  return useMutation({
    mutationFn: createUser,
    onSuccess: invalidate,
  });
};

export const useCreateStudent = () => {
  const invalidate = useInvalidateUsers();

  return useMutation({
    mutationFn: createStudent, // ✅ FIXED (no direct API call)
    onSuccess: invalidate,
  });
};

export const useUpdateUser = () => {
  const invalidate = useInvalidateUsers();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: invalidate,
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    // 🔥 SAFE OPTIMISTIC UPDATE
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: USERS_KEY });

      const previous = qc.getQueryData(USERS_KEY);

      qc.setQueryData(USERS_KEY, (old = []) =>
        old.filter((u) => u._id !== id)
      );

      return { previous };
    },

    onError: (err, id, context) => {
      if (context?.previous) {
        qc.setQueryData(USERS_KEY, context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
};