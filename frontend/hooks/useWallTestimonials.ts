"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchApprovedTestimonials } from "@/lib/api";

const PAGE_SIZE = 9;

export function useWallTestimonials() {
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["wall-testimonials"],
        queryFn: ({ pageParam }) =>
            fetchApprovedTestimonials({ skip: pageParam, take: PAGE_SIZE }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.reduce((sum, p) => sum + p.data.length, 0);
            return loaded < lastPage.total ? loaded : undefined;
        },
    });

    const testimonials = data?.pages.flatMap((page) => page.data) ?? [];

    return {
        testimonials,
        isLoading,
        isError,
        error: error instanceof Error ? error.message : null,
        hasMore: !!hasNextPage,
        loadingMore: isFetchingNextPage,
        handleLoadMore: fetchNextPage,
    };
}
