"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";
import type { User } from "@/types";

const inputCls = `
  w-full px-4 py-2.5 rounded-xl text-sm
  bg-[var(--color-background)]
  border border-[var(--color-border)]
  text-[var(--color-text-primary)]
  placeholder:text-[var(--color-text-secondary)]
  outline-none
  focus:border-[var(--color-primary-blue)]
  focus:ring-2 focus:ring-[rgba(0,102,255,0.2)]
  transition-colors duration-150
`.trim();

const disabledInputCls = `
  w-full px-4 py-2.5 rounded-xl text-sm
  bg-[var(--color-surface)]
  border border-[var(--color-border)]
  text-[var(--color-text-secondary)]
  cursor-not-allowed outline-none
`.trim();

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<User>("/users/me");
        setUser(data);
        setFullName(data.full_name);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const updated = await api.put<User>("/users/me", { full_name: fullName });
      setUser(updated);
      setSuccess("Profile updated successfully");
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.detail);
      else setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col">
        <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-48 bg-[var(--color-surface)] rounded animate-pulse mb-8" />
          <div className="h-96 bg-[var(--color-surface)] rounded-2xl animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">Profile settings</h1>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 sm:px-8 py-8">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-extrabold text-white select-none bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-accent-green)]" aria-label="Profile avatar">
              {user?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
            </div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="full-name">Full name</label>
              <input id="full-name" type="text" autoComplete="name" className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="email">
                Email <span className="text-xs font-normal">(cannot be changed)</span>
              </label>
              <input id="email" type="email" value={user?.email || ""} disabled readOnly className={disabledInputCls} />
            </div>

            {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}
            {success && <p className="text-sm text-green-500 bg-green-500/10 rounded-xl px-4 py-2">{success}</p>}

            <button type="submit" disabled={saving}
              className="w-full mt-2 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.2)] cursor-pointer"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
