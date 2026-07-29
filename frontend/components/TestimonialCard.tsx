import { StarRatingDisplay } from "./StarRating";
import type { Testimonial } from "../lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
    testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6 flex flex-col h-full">
                <StarRatingDisplay value={testimonial.rating} />
                <p className="text-sm text-slate-700 leading-relaxed mt-4 italic flex-1">"{testimonial.message}"</p>
                <div className="flex items-center gap-3 mt-6">
                    {testimonial.photoUrl ? (
                        <img
                            src={testimonial.photoUrl}
                            alt={testimonial.name}
                            className="w-11 h-11 rounded-full object-cover bg-slate-100 ring-2 ring-indigo-50"
                        />
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700 ring-2 ring-indigo-50">
                            {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                        {testimonial.company && <p className="text-xs text-slate-500 font-medium">{testimonial.company}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}