const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options && options.headers),
        },
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            body && body.errors ? body.errors.join(", ") : `Request failed with status ${res.status}`;
        throw new Error(message);
    }

    return body as T;
}

export type TestimonialStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Testimonial {
    id: string;
    name: string;
    email: string;
    company?: string;
    message: string;
    rating: number;
    photoUrl?: string;
    status: TestimonialStatus;
    createdAt: string;
}

export interface SubmitTestimonialPayload {
    name: string;
    email: string;
    company?: string;
    message: string;
    rating: number;
    photoUrl?: string;
}

export function submitTestimonial(data: SubmitTestimonialPayload): Promise<Testimonial> {
    return request<Testimonial>("/api/testimonials", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function fetchTestimonials(status?: TestimonialStatus): Promise<Testimonial[]> {
    const query = status ? `?status=${status}` : "";
    return request<Testimonial[]>(`/api/testimonials${query}`);
}

export function fetchApprovedTestimonials(): Promise<Testimonial[]> {
    return request<Testimonial[]>("/api/testimonials/approved");
}

export function approveTestimonial(id: string): Promise<Testimonial> {
    return request<Testimonial>(`/api/testimonials/${id}/approve`, { method: "PATCH" });
}

export function rejectTestimonial(id: string): Promise<Testimonial> {
    return request<Testimonial>(`/api/testimonials/${id}/reject`, { method: "PATCH" });
}