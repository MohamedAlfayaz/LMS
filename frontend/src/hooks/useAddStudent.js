import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/api";

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      API.post("/auth/create-student", data),

    onSuccess: () => {
      // 🔥 refetch student list automatically
      queryClient.invalidateQueries(["students"]);
    },
  });
};