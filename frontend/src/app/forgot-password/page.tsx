"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import { api, ApiClientError } from "@/lib/api";

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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email }, true);
      setSent(true);
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.detail);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard heading="Forgot password" subtext="We'll send you a reset link.">
      {sent ? (
        <div className="flex flex-col gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <span className="text-3xl text-green-500">✓</span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            If an account exists with that email, you'll receive a password reset link shortly.
          </p>
          <Link href="/login" className="text-sm font-semibold text-[var(--color-primary-blue)] hover:underline">Back to login</Link>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" autoComplete="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full mt-2 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.2)] cursor-pointer"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            Remember your password?{" "}
            <Link href="/login" className="text-[var(--color-primary-blue)] font-medium hover:underline">Log in</Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}
