import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Collect and showcase customer testimonials",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900">
        <nav className="flex gap-6 px-6 py-4 border-b border-neutral-200 bg-white">
          <a href="/" className="text-sm font-medium hover:text-emerald-700">
            Submit
          </a>
          <a href="/dashboard" className="text-sm font-medium hover:text-emerald-700">
            Dashboard
          </a>
          <a href="/wall" className="text-sm font-medium hover:text-emerald-700">
            Wall
          </a>
        </nav>
        {children}
      </body>
    </html>
  );
}