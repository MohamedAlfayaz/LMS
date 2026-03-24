import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnalytics, getStudentAnalytics } from "../api/analyticsApi";

export const useAnalytics = () => {
    return useQuery({
        queryKey: ['analytics'],
        queryFn: getAnalytics,
    });
}

export const useStudentAnalytics = () => {
    return useQuery({
        queryKey: ['student-analytics'],
        queryFn: getStudentAnalytics,
    });
}

export const useArticleAnalytics = () => {
    return useQuery({
        queryKey: ['article-analytics'],
        queryFn: async () => {
            const data = await getStudentAnalytics();
            return data.readingHistory;
        },
        staleTime: 0,              // always consider stale
        refetchOnMount: true,     // refetch when page opens
        refetchOnWindowFocus: true, // refetch when tab focus
    });
};