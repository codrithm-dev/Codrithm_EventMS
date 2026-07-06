"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 text-red-400/60 [&>svg]:stroke-[1]">
        <AlertTriangle size={96} />
      </div>

      <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] mb-3">
        500
      </p>

      <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-3">
        Something went wrong
      </h1>

      <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-8">
        An unexpected error occurred. Please try again or return to the home page.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 active:scale-[0.98] transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.2)] cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)] transition duration-150"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
