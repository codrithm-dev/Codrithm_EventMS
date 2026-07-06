"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Chrome } from "lucide-react";
import AuthCard from "@/components/AuthCard";
import { api, ApiClientError } from "@/lib/api";
import { setStoredUser, setFrontendSessionCookie } from "@/lib/auth";
import type { User, RegisterRequest } from "@/types";

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
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: RegisterRequest = { full_name: fullName, email, password };
      await api.post<User>("/auth/register", payload);

      const tokens = await api.post<{ access_token: string; refresh_token: string }>("/auth/login", { email, password }, true);
      setFrontendSessionCookie(tokens.access_token);

      const user = await api.get<User>("/users/me");
      setStoredUser(user as unknown as Record<string, unknown>);

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard heading="Create your account" subtext="Join Codrithm Events to discover and register for events.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full mt-2 py-2.5 rounded-full
            text-sm font-semibold text-white
            bg-[var(--color-primary-blue)]
            hover:opacity-90 active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition duration-150
            shadow-lg shadow-[rgba(0,102,255,0.2)]
            cursor-pointer
          "
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">Or continue with</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/api/v1/auth/google`} className={socialBtnCls}>
            <Chrome size={16} /> Google
          </a>
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
