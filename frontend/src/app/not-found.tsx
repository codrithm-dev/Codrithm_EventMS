import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">

      {/* Large muted icon */}
      <div className="mb-6 text-[var(--color-border)] [&>svg]:stroke-[1]">
        <SearchX size={96} />
      </div>

      {/* 404 label */}
      <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] mb-3">
        404
      </p>

      {/* Heading */}
      <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-3">
        Page not found
      </h1>

      {/* Subtext */}
      <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="
          inline-flex items-center px-6 py-2.5 rounded-full
          text-sm font-semibold text-white
          bg-[var(--color-primary-blue)] hover:opacity-90 active:scale-[0.98]
          transition duration-150
          shadow-lg shadow-[rgba(0,102,255,0.2)]
        "
      >
        Back to home
      </Link>

    </main>
  );
}
