"use client";

import { useState, FormEvent } from "react";
import { submitTestimonial } from "../lib/api";
import type { SubmitTestimonialPayload } from "../lib/types";
import { StarRatingInput } from "../components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

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
        <Card className="border-indigo-200 bg-indigo-50 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">🎉</div>
            <h1 className="text-2xl font-bold tracking-tight text-indigo-900 mb-2">Thank you!</h1>
            <p className="text-indigo-700/80">Your testimonial has been submitted and is pending review.</p>
          </CardContent>
        </Card>
        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => setStatus("idle")} className="text-indigo-600 hover:text-indigo-800">
            Submit another testimonial →
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Share your experience</h1>
      <p className="text-slate-500 mb-8 text-lg">We&apos;d love to hear what you think about our product.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Name</label>
              <Input
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="John Smith"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Email</label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Company <span className="text-slate-400 font-normal">(optional)</span></label>
              <Input
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="Acme Corp"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Your testimonial</label>
              <Textarea
                required
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                className="min-h-[120px]"
                placeholder="Tell us about your experience..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Rating</label>
              <StarRatingInput value={form.rating} onChange={(v) => updateField("rating", v)} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Photo URL <span className="text-slate-400 font-normal">(optional)</span></label>
              <Input
                value={form.photoUrl}
                onChange={(e) => updateField("photoUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <Button type="submit" disabled={status === "submitting"} className="w-full mt-2" size="lg">
              {status === "submitting" ? "Submitting..." : "Submit testimonial"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}