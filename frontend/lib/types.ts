// All shared domain types for the Testimonial platform

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
    flagReason?: string;
    isDuplicate?: boolean;
    createdAt: string;
}

export interface PaginatedResponse {
    data: Testimonial[];
    total: number;
    skip: number;
    take: number | null;
}

export interface SubmitTestimonialPayload {
    name: string;
    email: string;
    company?: string;
    message: string;
    rating: number;
    photoUrl?: string;
}
