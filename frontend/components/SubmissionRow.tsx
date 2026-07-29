"use client";

import { StarRatingDisplay } from "./StarRating";
import type { Testimonial, TestimonialStatus } from "../lib/types";
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

                <p className="text-sm mt-4 text-slate-700 leading-relaxed italic">"{testimonial.message}"</p>

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