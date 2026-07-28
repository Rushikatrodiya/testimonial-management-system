"use client";

import { useState, FormEvent } from "react";
import { submitTestimonial, SubmitTestimonialPayload } from "../lib/api";
import { StarRatingInput } from "../components/StarRating";

interface FormState {
  name: string;
  email: string;
  company: string;
  message: string;
  rating: number;
  photoUrl: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
  rating: 0,
  photoUrl: "",
};

type Status = "idle" | "submitting" | "success";

export default function SubmissionPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (form.rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setStatus("submitting");

    try {
      const payload: SubmitTestimonialPayload = {
        name: form.name,
        email: form.email,
        company: form.company || undefined,
        message: form.message,
        rating: form.rating,
        photoUrl: form.photoUrl || undefined,
      };
      await submitTestimonial(payload);
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <main className="max-w-xl mx-auto px-6 py-16">
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-6 text-center">
          <h1 className="text-lg font-semibold mb-1">Thank you!</h1>
          <p className="text-sm">Your testimonial has been submitted and is pending review.</p>
        </div>
        <button
          className="mt-6 text-sm font-medium text-emerald-700 hover:underline"
          onClick={() => setStatus("idle")}
        >
          Submit another testimonial
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-1">Share your experience</h1>
      <p className="text-neutral-500 mb-8">We'd love to hear what you think.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Company (optional)</label>
          <input
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Your testimonial</label>
          <textarea
            required
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Rating</label>
          <StarRatingInput value={form.rating} onChange={(v) => updateField("rating", v)} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Photo URL (optional)</label>
          <input
            value={form.photoUrl}
            onChange={(e) => updateField("photoUrl", e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm"
        >
          {status === "submitting" ? "Submitting..." : "Submit testimonial"}
        </button>
      </form>
    </main>
  );
}