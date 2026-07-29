"use client";

import { useWallTestimonials } from "@/hooks/useWallTestimonials";
import { TestimonialCard } from "../../components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WallPage() {
    const { testimonials, isLoading, isError, error, hasMore, loadingMore, handleLoadMore } = useWallTestimonials();

    return (
        <main className="max-w-5xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">What our customers say</h1>
            <p className="text-slate-500 mb-12 text-lg">Real feedback from real customers.</p>

            {/* Loading */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="font-medium">Loading testimonials...</p>
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">
                    Couldn&apos;t load testimonials right now: {error}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && testimonials.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-24">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-2xl mb-3">✨</div>
                        <p className="text-slate-500 font-medium">No testimonials yet — check back soon.</p>
                    </CardContent>
                </Card>
            )}

            {/* Grid */}
            {!isLoading && !isError && testimonials.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {testimonials.map((t) => (
                            <TestimonialCard key={t.id} testimonial={t} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-12">
                            <Button variant="outline" size="lg" onClick={() => handleLoadMore()} disabled={loadingMore}>
                                {loadingMore ? "Loading..." : "Load more"}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}