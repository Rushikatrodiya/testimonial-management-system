import { StarRatingDisplay } from "./StarRating";
import { Testimonial } from "../lib/api";

interface TestimonialCardProps {
    testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <StarRatingDisplay value={testimonial.rating} />
            <p className="text-sm leading-relaxed mt-3">{testimonial.message}</p>
            <div className="flex items-center gap-3 mt-4">
                {testimonial.photoUrl ? (
                    <img
                        src={testimonial.photoUrl}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover bg-neutral-100"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-semibold text-neutral-500">
                        {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    {testimonial.company && <p className="text-xs text-neutral-400">{testimonial.company}</p>}
                </div>
            </div>
        </div>
    );
}