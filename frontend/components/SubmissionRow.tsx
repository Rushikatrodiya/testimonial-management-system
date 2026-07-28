"use client";

import { StarRatingDisplay } from "./StarRating";
import { Testimonial, TestimonialStatus } from "../lib/api";

const badgeStyles: Record<TestimonialStatus, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
};

interface SubmissionRowProps {
    testimonial: Testimonial;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export function SubmissionRow({ testimonial, onApprove, onReject }: SubmissionRowProps) {
    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-3">
            <div className="flex justify-between items-start gap-3 mb-2">
                <div>
                    <span className="font-semibold">{testimonial.name}</span>
                    {testimonial.company && (
                        <span className="text-neutral-500 text-sm"> — {testimonial.company}</span>
                    )}
                </div>
                <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${badgeStyles[testimonial.status]}`}>
                    {testimonial.status}
                </span>
            </div>

            <StarRatingDisplay value={testimonial.rating} />

            <p className="text-sm mt-3 leading-relaxed">{testimonial.message}</p>

            <p className="text-xs text-neutral-400 mt-2">
                {testimonial.email} · {new Date(testimonial.createdAt).toLocaleDateString()}
            </p>

            {testimonial.status === "PENDING" && (
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => onApprove(testimonial.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => onReject(testimonial.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md"
                    >
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
}