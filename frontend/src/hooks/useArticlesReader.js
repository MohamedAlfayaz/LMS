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