"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, Clock, ArrowLeft } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import type { EventDetail } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

export default function EventDetailsPage({ params }: Props) {
  const [slug, setSlug] = useState<string>("");
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError("");
      try {
        const data = await api.get<EventDetail>(`/events/${slug}`, true);
        setEvent(data);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex-1 flex flex-col">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="w-full h-56 sm:h-72 rounded-2xl mb-8 bg-[var(--color-surface)] animate-pulse" />
          <div className="h-8 w-2/3 bg-[var(--color-surface)] rounded animate-pulse mb-4" />
          <div className="h-4 w-1/2 bg-[var(--color-surface)] rounded animate-pulse" />
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <p className="text-[var(--color-text-secondary)] text-lg">{error || "Event not found"}</p>
        <Link href="/events" className="mt-4 text-[var(--color-primary-blue)] hover:underline text-sm">← Back to events</Link>
      </main>
    );
  }

  const { date, time } = formatDateTime(event.date_time);
  const registered = event.registered_count || 0;
  const spotsLeft = event.capacity - registered;
  const pct = Math.round((registered / event.capacity) * 100);

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150 mb-6">
          <ArrowLeft size={14} /> Back to events
        </Link>

        <div className="w-full h-56 sm:h-72 rounded-2xl mb-8 flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-accent-green)]" aria-hidden="true" />

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(0,102,255,0.12)", color: "#0066ff" }}>
                {event.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(135,255,188,0.12)", color: "#87ffbc" }}>
                {event.event_type}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] mb-6 leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 pb-6 mb-6 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Calendar size={15} strokeWidth={2} />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Clock size={15} strokeWidth={2} />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <MapPin size={15} strokeWidth={2} />
                <span>{event.venue || "Online"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Users size={15} strokeWidth={2} />
                <span>{event.capacity} capacity</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">About this event</h2>
              <div className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{event.description}</div>
            </div>
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">Registered</span>
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">{registered} / {event.capacity}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #0066ff, #87ffbc)" }} />
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">{spotsLeft > 0 ? `${spotsLeft} spots remaining` : "Fully booked"}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-2xl font-extrabold text-[var(--color-text-primary)]">Free</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">· {event.approval_mode} approval</span>
                </div>

                {event.status === "published" && spotsLeft > 0 ? (
                  <Link
                    href={isAuthenticated() ? `/events/${slug}/register` : `/login?redirect=/events/${slug}/register`}
                    className="inline-flex items-center justify-center w-full py-3 px-6 rounded-full text-base font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 active:scale-[0.98] transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.25)]"
                  >
                    {isAuthenticated() ? "Register now" : "Log in to register"}
                  </Link>
                ) : (
                  <button disabled className="inline-flex items-center justify-center w-full py-3 px-6 rounded-full text-base font-semibold text-white bg-gray-400 cursor-not-allowed">
                    {event.status === "published" ? "Fully booked" : event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
