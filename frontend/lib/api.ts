import apiClient from "./apiClient";
import type { Testimonial, PaginatedResponse, SubmitTestimonialPayload, TestimonialStatus } from "./types";

export async function submitTestimonial(data: SubmitTestimonialPayload): Promise<Testimonial> {
    const res = await apiClient.post<Testimonial>("/api/testimonials", data);
    return res.data;
}

export async function fetchTestimonials(
    status?: TestimonialStatus,
    { skip, take }: { skip?: number; take?: number } = {}
): Promise<PaginatedResponse> {
    const res = await apiClient.get<PaginatedResponse>("/api/testimonials", {
        params: { status, skip, take },
    });
    return res.data;
}

export async function fetchApprovedTestimonials(
    { skip, take }: { skip?: number; take?: number } = {}
): Promise<PaginatedResponse> {
    const res = await apiClient.get<PaginatedResponse>("/api/testimonials/approved", {
        params: { skip, take },
    });
    return res.data;
}

export async function approveTestimonial(id: string): Promise<Testimonial> {
    const res = await apiClient.patch<Testimonial>(`/api/testimonials/${id}/approve`);
    return res.data;
}

export async function rejectTestimonial(id: string): Promise<Testimonial> {
    const res = await apiClient.patch<Testimonial>(`/api/testimonials/${id}/reject`);
    return res.data;
}