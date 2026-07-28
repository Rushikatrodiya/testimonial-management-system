"use client";

interface StarRatingInputProps {
    value: number;
    onChange: (value: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    className={`text-3xl leading-none ${star <= value ? "text-amber-500" : "text-neutral-300"}`}
                    aria-label={`${star} star`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

interface StarRatingDisplayProps {
    value: number;
}

export function StarRatingDisplay({ value }: StarRatingDisplayProps) {
    return (
        <span className="text-amber-500 text-sm tracking-wide">
            {"★".repeat(value)}
            <span className="text-neutral-300">{"★".repeat(5 - value)}</span>
        </span>
    );
}