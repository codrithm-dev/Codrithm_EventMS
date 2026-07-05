"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/reset-password", { token, new_password: password }, true);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.detail);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <div className="flex flex-col gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <span className="text-3xl text-green-500">✓</span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">Password reset successfully! Redirecting to login...</p>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="password">New password</label>
            <input id="password" type="password" placeholder="••••••••" autoComplete="new-password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}

          <button type="submit" disabled={loading || !token}
            className="w-full mt-2 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.2)] cursor-pointer"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>

          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            <Link href="/login" className="text-[var(--color-primary-blue)] font-medium hover:underline">Back to login</Link>
          </p>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard heading="Reset password" subtext="Choose a new password for your account.">
      <Suspense fallback={<div className="text-center py-4 text-[var(--color-text-secondary)]">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
