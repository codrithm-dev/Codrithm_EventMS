import type { ReactNode } from "react";

interface AuthCardProps {
  heading: string;
  subtext: string;
  children: ReactNode;
}

export default function AuthCard({ heading, subtext, children }: AuthCardProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div
        className="
          w-full max-w-[440px]
          bg-[var(--color-surface)]
          border border-[var(--color-border)]
          rounded-2xl
          px-8 py-10
          flex flex-col gap-6
        "
      >
        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">
            {heading}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{subtext}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
