import Link from "next/link";
import { Chrome, Github, Linkedin } from "lucide-react";
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

const socialBtnCls = `
  flex-1 inline-flex items-center justify-center gap-2
  px-4 py-2.5 rounded-full text-sm font-medium
  border border-[var(--color-border)]
  text-[var(--color-text-primary)]
  bg-transparent
  hover:bg-[var(--color-surface)]
  hover:border-[var(--color-primary-blue)]/40
  active:scale-[0.98]
  transition duration-150
  cursor-pointer
`.trim();

export default function RegisterPage() {
  return (
    <AuthCard
      heading="Create your account"
      subtext="Join Codrithm Events to discover and register for events."
    >
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            className={inputCls}
          />
        </div>

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

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
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
          Sign up
        </button>
      </form>

      {/* ── Social login ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        {/* Provider buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" className={socialBtnCls} aria-label="Continue with Google">
            <Chrome size={16} />
            Google
          </button>
          <button type="button" className={socialBtnCls} aria-label="Continue with GitHub">
            <Github size={16} />
            GitHub
          </button>
          <button type="button" className={socialBtnCls} aria-label="Continue with LinkedIn">
            <Linkedin size={16} />
            LinkedIn
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--color-primary-blue)] font-medium hover:underline">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
