import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnalytics, getStudentAnalytics } from "../api/analyticsApi";

export const useAnalytics = () => {
    return useQuery({
        queryKey: ['analytics'],
        queryFn: getAnalytics,

        retry: true,              // retry if backend fails
        retryDelay: 2000,        // retry every 2 sec
        refetchOnWindowFocus: true, // tab focus வந்தா refetch
        refetchInterval: 5000,
    });
}

export const useStudentAnalytics = () => {
    return useQuery({
        queryKey: ['student-analytics'],
        queryFn: getStudentAnalytics,

        retry: true,              // retry if backend fails
        retryDelay: 2000,        // retry every 2 sec
        refetchOnWindowFocus: true, // tab focus வந்தா refetch
        refetchInterval: 5000,
    });
}

export const useArticleAnalytics = () => {
    return useQuery({
        queryKey: ['article-analytics'],
        queryFn: async () => {
            const data = await getStudentAnalytics();
            return data.readingHistory;
        },
        retry: true,              // retry if backend fails
        retryDelay: 2000,        // retry every 2 sec
        refetchOnWindowFocus: true, // tab focus வந்தா refetch
        refetchInterval: 5000,
    });
};