import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser } from "../api/usersApi";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });
};

export const useCreateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries(["users"]);
    },
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      qc.invalidateQueries(["users"]);
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (id) => {
      await qc.cancelQueries(["users"]);

      const previous = qc.getQueryData(["users"]);

      qc.setQueryData(["users"], (old) =>
        old.filter((u) => u._id !== id)
      );

      return { previous };
    },

    onError: (err, id, context) => {
      qc.setQueryData(["users"], context.previous);
    },

    onSettled: () => {
      qc.invalidateQueries(["users"]);
    },
  });
};