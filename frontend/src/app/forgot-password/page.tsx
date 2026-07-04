import Link from "next/link";
import AuthCard from "@/components/AuthCard";

const inputCls = `
  w-full px-4 py-2.5 rounded-xl text-sm
  bg-[var(--color-background)]
  border border-[var(--color-border)]
  text-[var(--color-text-primary)]
  placeholder:text-[var(--color-text-secondary)]
  outline-none
  focus:border-[var(--color-primary-blue)]
  focus:ring-2 focus:ring-[var(--color-primary-blue)]/20
  transition-colors duration-150
`.trim();

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      heading="Reset your password"
      subtext="Enter your email and we'll send you a reset link."
    >
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={inputCls}
          />
        </div>

        <button
          type="submit"
          className="
            w-full mt-2 py-2.5 rounded-full
            text-sm font-semibold text-white
            bg-[var(--color-primary-blue)]
            hover:opacity-90 active:scale-[0.98]
            transition duration-150
            shadow-lg shadow-[rgba(0,102,255,0.2)]
            cursor-pointer
          "
        >
          Send reset link
        </button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        Remember your password?{" "}
        <Link href="/login" className="text-[var(--color-primary-blue)] font-medium hover:underline">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}


