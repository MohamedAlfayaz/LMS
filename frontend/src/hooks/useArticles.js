import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getArticles, deleteArticle, updateArticle, createArticle, uploadArticleFile } from '../api/articleApi';

export const useArticles = () => {
    const queryClient = useQueryClient();

    const articeQuery = useQuery({
        queryKey: ['article'],
        queryFn: getArticles,

        retry: true,              // retry if backend fails
        retryDelay: 2000,        // retry every 2 sec
        refetchOnWindowFocus: true, // tab focus வந்தா refetch
        refetchInterval: 5000,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['article'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['article'] });
        },
    });

    const createMutation = useMutation({
        mutationFn: createArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['article'] });
        },
    });

    const uploadMutation = useMutation({
        mutationFn: uploadArticleFile,
    });

    return {
        ...articeQuery,
        deleteArticle: deleteMutation.mutate,
        updateArticle: updateMutation.mutate,
        createArticle: createMutation.mutate,
        uploadFile: uploadMutation.mutate,
    }
}