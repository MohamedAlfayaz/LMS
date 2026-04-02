import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getArticle,
  getHighlights,
  createHighlight,
  deleteHighlight
} from "../api/studentApi";

/* ARTICLE */
export const useArticle = (id) => {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticle(id),

    retry: true,              // retry if backend fails
    retryDelay: 2000,        // retry every 2 sec
    refetchOnWindowFocus: true, // tab focus வந்தா refetch
    refetchInterval: 5000,
  });
};

/* HIGHLIGHTS FOR ARTICLE */
export const useHighlights = (id) => {
  return useQuery({
    queryKey: ["highlights", id],
    queryFn: getHighlights,
    select: (data) => data.filter((n) => n.articleId?._id === id),
  });
};

/* STUDENT NOTES */
export const useStudentNotes = () => {
  return useQuery({
    queryKey: ["studentNotes"],
    queryFn: getHighlights,

    retry: true,              // retry if backend fails
    retryDelay: 2000,        // retry every 2 sec
    refetchOnWindowFocus: true, // tab focus வந்தா refetch
    refetchInterval: 5000,
  });
};

/* MUTATIONS */
export const useHighlightMutations = () => {

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createHighlight,
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["highlights"] });
      queryClient.invalidateQueries({ queryKey: ["studentNotes"] });

    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHighlight,
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["highlights"] });
      queryClient.invalidateQueries({ queryKey: ["studentNotes"] });

    }
  });

  return { createMutation, deleteMutation };

};