"use client";

import { useTestimonials } from "@/hooks/useTestimonials";
import { SubmissionRow } from "../../components/SubmissionRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TestimonialStatus } from "@/lib/types";

const TABS: TestimonialStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export default function DashboardPage() {
    const {
        tab,
        testimonials,
        total,
        totalPages,
        page,
        setPage,
        isLoading,
        isError,
        error,
        handleTabChange,
        handleApprove,
        handleReject,
    } = useTestimonials();

    return (
        <main className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Moderation Dashboard</h1>
            <p className="text-slate-500 mb-8 text-lg">Review and moderate customer testimonials.</p>

            {/* Tab bar */}
            <div className="flex gap-2 mb-6">
                {TABS.map((t) => (
                    <Button
                        key={t}
                        size="sm"
                        variant={tab === t ? "default" : "outline"}
                        onClick={() => handleTabChange(t)}
                        className="uppercase tracking-wider text-xs font-bold"
                    >
                        {t}
                    </Button>
                ))}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="font-medium">Loading testimonials...</p>
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">
                    Failed to load submissions: {error}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && testimonials.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-2xl mb-3">👻</div>
                        <p className="text-slate-500 font-medium">No {tab.toLowerCase()} submissions yet.</p>
                    </CardContent>
                </Card>
            )}

            {/* List */}
            {!isLoading && !isError &&
                testimonials.map((t) => (
                    <SubmissionRow key={t.id} testimonial={t} onApprove={handleApprove} onReject={handleReject} />
                ))}

            {/* Pagination */}
            {!isLoading && !isError && totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                    >
                        ← Previous
                    </Button>
                    <span className="text-xs text-slate-500">
                        Page {page + 1} of {totalPages} · {total} total
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                    >
                        Next →
                    </Button>
                </div>
            )}
        </main>
    );
}