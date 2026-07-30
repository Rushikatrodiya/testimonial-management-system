"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StarRatingDisplay } from "./StarRating";
import type { Testimonial, TestimonialStatus } from "../lib/types";
import { summarizeTestimonial } from "../lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const statusVariant: Record<TestimonialStatus, "default" | "secondary" | "destructive"> = {
    PENDING: "secondary",
    APPROVED: "default",
    REJECTED: "destructive",
};

interface SubmissionRowProps {
    testimonial: Testimonial;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export function SubmissionRow({ testimonial, onApprove, onReject }: SubmissionRowProps) {
    const wordCount = testimonial.message.split(/\s+/).filter(Boolean).length;
    const isLong = wordCount > 150;

    const [showFull, setShowFull] = useState(!isLong);

    const { data: summary, isLoading: isSummarizing, isError } = useQuery({
        queryKey: ["testimonial-summary", testimonial.id],
        queryFn: async () => {
            const cacheKey = `tw-summary-${testimonial.id}`;
            if (typeof window !== "undefined") {
                const cached = localStorage.getItem(cacheKey);
                if (cached) return cached;
            }
            const result = await summarizeTestimonial(testimonial.message);
            if (typeof window !== "undefined") {
                localStorage.setItem(cacheKey, result);
            }
            return result;
        },
        enabled: isLong,
        staleTime: Infinity,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    const displayFullText = showFull || isError;

    return (
        <Card className="mb-4 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex justify-between items-start gap-3 mb-3">
                    <div>
                        <span className="font-semibold text-slate-900">{testimonial.name}</span>
                        {testimonial.company && (
                            <span className="text-slate-500 text-sm font-medium"> — {testimonial.company}</span>
                        )}
                    </div>
                    <Badge variant={statusVariant[testimonial.status]}>
                        {testimonial.status}
                    </Badge>
                </div>

                {/* Flag reason badges */}
                {testimonial.flagReason && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {testimonial.flagReason.split(" | ").map((reason, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className={
                                    reason.startsWith("DUPLICATE")
                                        ? "border-orange-200 bg-orange-50 text-orange-700"
                                        : "border-yellow-200 bg-yellow-50 text-yellow-700"
                                }
                            >
                                {reason.startsWith("DUPLICATE") ? "⚠️" : "🚩"} {reason}
                            </Badge>
                        ))}
                    </div>
                )}

                <StarRatingDisplay value={testimonial.rating} />

                <div className="mt-4">
                    {isLong && !displayFullText ? (
                        <p className="text-sm text-slate-700 leading-relaxed italic">
                            {isSummarizing ? (
                                <span className="flex items-center gap-2 text-slate-500">
                                    <span className="animate-pulse">Summarizing...</span>
                                </span>
                            ) : (
                                `"${summary}"`
                            )}
                        </p>
                    ) : (
                        <p className="text-sm text-slate-700 leading-relaxed italic">
                            "{testimonial.message}"
                        </p>
                    )}
                    {isLong && !isError && (
                        <button
                            onClick={() => setShowFull(!showFull)}
                            className="text-xs text-blue-600 hover:underline mt-1 font-medium"
                        >
                            {showFull ? "Show summary" : "Read full"}
                        </button>
                    )}
                </div>

                <p className="text-xs text-slate-400 mt-3 font-medium">
                    {testimonial.email} · {new Date(testimonial.createdAt).toLocaleDateString()}
                </p>

                {testimonial.status === "PENDING" && (
                    <div className="flex gap-2 mt-5">
                        <Button size="sm" onClick={() => onApprove(testimonial.id)}>
                            {testimonial.flagReason ? "Approve anyway" : "Approve"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onReject(testimonial.id)}
                            className="hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                            Reject
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}