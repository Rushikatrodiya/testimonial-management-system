"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTestimonials, approveTestimonial, rejectTestimonial } from "@/lib/api";
import type { TestimonialStatus } from "@/lib/types";

const PAGE_SIZE = 10;

export function useTestimonials() {
    const queryClient = useQueryClient();
    const [tab, setTab] = useState<TestimonialStatus>("PENDING");
    const [page, setPage] = useState(0);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["testimonials", tab, page],
        queryFn: () => fetchTestimonials(tab, { skip: page * PAGE_SIZE, take: PAGE_SIZE }),
    });

    const approveMutation = useMutation({
        mutationFn: approveTestimonial,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["testimonials"] }),
    });

    const rejectMutation = useMutation({
        mutationFn: rejectTestimonial,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["testimonials"] }),
    });

    function handleTabChange(newTab: TestimonialStatus) {
        setPage(0);
        setTab(newTab);
    }

    const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

    return {
        tab,
        testimonials: data?.data ?? [],
        total: data?.total ?? 0,
        totalPages,
        page,
        setPage,
        isLoading,
        isError,
        error: error instanceof Error ? error.message : null,
        handleTabChange,
        handleApprove: approveMutation.mutate,
        handleReject: rejectMutation.mutate,
    };
}
