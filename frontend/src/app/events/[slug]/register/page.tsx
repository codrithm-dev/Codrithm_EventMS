"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiClientError } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import type { EventDetail, RegistrationResponse, RegistrationCreate, User } from "@/types";

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

const labelCls = "text-sm font-medium text-[var(--color-text-primary)]";
const fieldCls = "flex flex-col gap-1.5";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function RegisterForEventPage({ params }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<RegistrationCreate>({
    full_name: "", email: "", phone: "", university: "",
    company: "", job_title: "", linkedin_url: "", github_url: "",
    portfolio_url: "",
  });

  useEffect(() => {
    (async () => {
      const { slug: resolvedSlug } = await params;
      setSlug(resolvedSlug);
    })();
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      try {
        const [eventData, user] = await Promise.all([
          api.get<EventDetail>(`/events/${slug}`, true),
          Promise.resolve(getStoredUser<User>()),
        ]);
        setEvent(eventData);
        if (user) {
          setFormData((prev) => ({
            ...prev,
            full_name: user.full_name || "",
            email: user.email || "",
          }));
        }
      } catch {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id.replace("-", "_")]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload: RegistrationCreate = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        university: formData.university || null,
        company: formData.company || null,
        job_title: formData.job_title || null,
        linkedin_url: formData.linkedin_url || null,
        github_url: formData.github_url || null,
        portfolio_url: formData.portfolio_url || null,
      };

      await api.post<RegistrationResponse>(`/registrations/events/${event!.id}/register`, payload);
      setSuccess(true);
      setTimeout(() => router.push("/my-registrations"), 2000);
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.detail);
      else setError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="animate-pulse text-[var(--color-text-secondary)]">Loading...</div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-8 py-10 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-green-500">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Registration submitted!</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">You'll receive a confirmation once it's processed.</p>
          <Link href="/my-registrations" className="text-[var(--color-primary-blue)] font-medium hover:underline">View my registrations →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-10">
        <Link href={`/events/${slug}`} className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150 mb-6">
          ← Back to event
        </Link>

        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1">
          Register for {event?.title || "Event"}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          {event?.date_time ? new Date(event.date_time).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : ""} · {event?.venue || "Online"}
        </p>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 sm:px-8 py-8">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <section className="flex flex-col gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Required information</h2>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="full-name">Full name <span className="text-red-400">*</span></label>
                <input id="full-name" type="text" placeholder="Your full name" autoComplete="name" className={inputCls} value={formData.full_name} onChange={handleChange} required />
              </div>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="email">Email address <span className="text-red-400">*</span></label>
                <input id="email" type="email" placeholder="you@example.com" autoComplete="email" className={inputCls} value={formData.email} onChange={handleChange} required />
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Optional information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="phone">Phone number</label>
                  <input id="phone" type="tel" placeholder="+92 300 0000000" autoComplete="tel" className={inputCls} value={formData.phone || ""} onChange={handleChange} />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="university">University</label>
                  <input id="university" type="text" placeholder="Your university" className={inputCls} value={formData.university || ""} onChange={handleChange} />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="company">Company</label>
                  <input id="company" type="text" placeholder="Your company" autoComplete="organization" className={inputCls} value={formData.company || ""} onChange={handleChange} />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="job-title">Job title</label>
                  <input id="job-title" type="text" placeholder="e.g. Software Engineer" autoComplete="organization-title" className={inputCls} value={formData.job_title || ""} onChange={handleChange} />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="linkedin">LinkedIn profile</label>
                  <input id="linkedin" type="url" placeholder="https://linkedin.com/in/you" className={inputCls} value={formData.linkedin_url || ""} onChange={handleChange} />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="github">GitHub profile</label>
                  <input id="github" type="url" placeholder="https://github.com/you" className={inputCls} value={formData.github_url || ""} onChange={handleChange} />
                </div>
              </div>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="portfolio">Portfolio URL</label>
                <input id="portfolio" type="url" placeholder="https://yourportfolio.com" className={inputCls} value={formData.portfolio_url || ""} onChange={handleChange} />
              </div>
            </section>

            {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}

            <div className="flex flex-col gap-3 pt-2 border-t border-[var(--color-border)]">
              <button type="submit" disabled={submitting}
                className="w-full py-3 rounded-full text-base font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.25)] cursor-pointer"
              >
                {submitting ? "Submitting..." : "Submit registration"}
              </button>
              <p className="text-xs text-center text-[var(--color-text-secondary)]">By registering, you agree to receive event updates via email.</p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
