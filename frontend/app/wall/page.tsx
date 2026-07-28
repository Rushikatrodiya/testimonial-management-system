"use client";

import { useEffect, useState } from "react";
import { fetchApprovedTestimonials, Testimonial } from "../../lib/api";
import { TestimonialCard } from "../../components/TestimonialCard";

type LoadState = "loading" | "done" | "error";

export default function WallPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loadState, setLoadState] = useState<LoadState>("loading");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchApprovedTestimonials()
            .then((data) => {
                setTestimonials(data);
                setLoadState("done");
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Something went wrong");
                setLoadState("error");
            });
    }, []);

    return (
        <main className="max-w-5xl mx-auto px-6 py-16">
            <h1 className="text-2xl font-semibold mb-1">What our customers say</h1>
            <p className="text-neutral-500 mb-10">Real feedback from real customers.</p>

            {loadState === "loading" && (
                <div className="text-center text-neutral-400 py-16">Loading testimonials...</div>
            )}

            {loadState === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">
                    Couldn't load testimonials right now: {error}
                </div>
            )}

            {loadState === "done" && testimonials.length === 0 && (
                <div className="text-center text-neutral-400 py-16">No testimonials yet — check back soon.</div>
            )}

            {loadState === "done" && testimonials.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {testimonials.map((t) => (
                        <TestimonialCard key={t.id} testimonial={t} />
                    ))}
                </div>
            )}
        </main>
    );
}