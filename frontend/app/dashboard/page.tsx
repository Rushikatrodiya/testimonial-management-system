"use client";

import { useEffect, useState, useCallback } from "react";
import {
    fetchTestimonials,
    approveTestimonial,
    rejectTestimonial,
    Testimonial,
    TestimonialStatus,
} from "../../lib/api";
import { SubmissionRow } from "../../components/SubmissionRow";

const TABS: TestimonialStatus[] = ["PENDING", "APPROVED", "REJECTED"];

type LoadState = "loading" | "done" | "error";

export default function DashboardPage() {
    const [tab, setTab] = useState<TestimonialStatus>("PENDING");
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loadState, setLoadState] = useState<LoadState>("loading");
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async (status: TestimonialStatus) => {
        setLoadState("loading");
        setError(null);
        try {
            const data = await fetchTestimonials(status);
            setTestimonials(data);
            setLoadState("done");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setLoadState("error");
        }
    }, []);

    useEffect(() => {
        load(tab);
    }, [tab, load]);

    async function handleApprove(id: string) {
        await approveTestimonial(id);
        load(tab);
    }

    async function handleReject(id: string) {
        await rejectTestimonial(id);
        load(tab);
    }

    return (
        <main className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-2xl font-semibold mb-1">Moderation dashboard</h1>
            <p className="text-neutral-500 mb-8">Review and moderate customer testimonials.</p>

            <div className="flex gap-2 mb-6">
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`text-xs font-semibold px-4 py-1.5 rounded-full border ${tab === t
                                ? "bg-emerald-700 text-white border-emerald-700"
                                : "bg-white text-neutral-500 border-neutral-200"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {loadState === "loading" && (
                <div className="text-center text-neutral-400 py-16">Loading...</div>
            )}

            {loadState === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">
                    Failed to load submissions: {error}
                </div>
            )}

            {loadState === "done" && testimonials.length === 0 && (
                <div className="text-center text-neutral-400 py-16">No {tab.toLowerCase()} submissions yet.</div>
            )}

            {loadState === "done" &&
                testimonials.map((t) => (
                    <SubmissionRow key={t.id} testimonial={t} onApprove={handleApprove} onReject={handleReject} />
                ))}
        </main>
    );
}