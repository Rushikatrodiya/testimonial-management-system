"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

// Self-contained types to avoid tight coupling
interface WidgetTestimonial {
    id: string;
    name: string;
    email: string;
    company?: string;
    message: string;
    rating: number;
    photoUrl?: string;
    createdAt: string;
}

export interface TestimonialWidgetProps {
    apiUrl: string;
    accentColor?: string;
    wallUrl?: string;
}

const WIDGET_LIMIT = 9;

async function fetchWidgetTestimonials(apiUrl: string) {
    const res = await apiClient.get<{ data: WidgetTestimonial[]; total: number } | WidgetTestimonial[]>(
        `${apiUrl}/api/testimonials/approved`,
        { params: { take: WIDGET_LIMIT } }
    );
    const body = res.data;
    if (Array.isArray(body)) {
        return { testimonials: body, total: body.length };
    }
    return { testimonials: body.data, total: body.total };
}

export function TestimonialWidget({ apiUrl, accentColor = "#f3f3f3ff", wallUrl }: TestimonialWidgetProps) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["widget-testimonials", apiUrl],
        queryFn: () => fetchWidgetTestimonials(apiUrl),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8 animate-pulse">
                <div className="h-8 w-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: accentColor, borderTopColor: 'transparent' }}></div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="p-4 rounded-lg bg-red-50 text-red-500 text-sm text-center">
                Could not load testimonials.
            </div>
        );
    }

    const { testimonials, total } = data;

    if (testimonials.length === 0) {
        return (
            <div className="p-8 text-center text-neutral-500 italic">
                No testimonials to display yet.
            </div>
        );
    }

    const hasMore = total > WIDGET_LIMIT;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                    <div
                        key={t.id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-neutral-100 flex flex-col h-full"
                    >
                        <div className="p-6 flex-grow flex flex-col">
                            <div className="flex items-center gap-1 mb-4" style={{ color: accentColor }}>
                                {"★".repeat(t.rating)}
                                <span className="text-neutral-200">{"★".repeat(5 - t.rating)}</span>
                            </div>

                            <p className="text-neutral-700 italic flex-grow mb-6 relative z-10">
                                &ldquo;{t.message}&rdquo;
                            </p>

                            <div className="flex items-center gap-3 mt-auto">
                                {t.photoUrl ? (
                                    <img
                                        src={t.photoUrl}
                                        alt={t.name}
                                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                                    />
                                ) : (
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        {t.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-semibold text-neutral-900 text-sm leading-tight">
                                        {t.name}
                                    </h4>
                                    {t.company && (
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            {t.company}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="h-1 w-full" style={{ backgroundColor: accentColor }}></div>
                    </div>
                ))}
            </div>

            {hasMore && wallUrl && (
                <div className="flex justify-center pt-2">
                    <a
                        href={wallUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-slate-900 transition-opacity hover:opacity-90"
                    >
                        See all testimonials →
                    </a>
                </div>
            )}
        </div>
    );
}
