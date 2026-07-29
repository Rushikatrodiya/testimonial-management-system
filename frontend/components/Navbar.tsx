"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function Navbar() {
  const pathname = usePathname();

  if (pathname === "/widget") {
    return null;
  }

  const navLinks = [
    { name: "Submit", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Wall", path: "/wall" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
          T
        </div>
        <span className="font-semibold tracking-tight text-slate-900">Testimonial</span>
      </div>
      <div className="flex gap-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium transition-all duration-200 ${isActive
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-indigo-600 hover:-translate-y-0.5"
                }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
