"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Code } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import type { User } from "@/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

interface DashboardEvent {
  registration_id: string;
  event_title: string;
  event_date: string | null;
  event_slug: string;
  status: string;
  ticket_id: string | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredUser<User>();
    if (stored) setUser(stored);

    (async () => {
      try {
        const [userData, eventsData] = await Promise.all([
          api.get<User>("/users/me"),
          api.get<DashboardEvent[]>("/admin/dashboard/my-events"),
        ]);
        setUser(userData);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 flex flex-col">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-64 bg-[var(--color-surface)] rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-[var(--color-surface)] rounded-2xl animate-pulse" />)}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <p className="text-red-500">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-[var(--color-primary-blue)] hover:underline text-sm">Try again</button>
      </main>
    );
  }

  const stats = [
    { label: "Upcoming events", value: String(events.filter(e => e.event_date && new Date(e.event_date) > new Date()).length) },
    { label: "Total registrations", value: String(events.length) },
    { label: "Approved", value: String(events.filter(e => e.status === "approved").length) },
  ];

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">
          Welcome back, {user?.full_name?.split(" ")[0] || "User"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-1">
              <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
              <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{value}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Your events</h2>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((reg) => (
              <div key={reg.registration_id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col gap-2">
                <p className="font-semibold text-[var(--color-text-primary)]">{reg.event_title}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {reg.event_date ? formatDate(reg.event_date) : "Date TBA"} · {reg.status}
                </p>
                {reg.ticket_id && (
                  <Link href={`/tickets/${reg.registration_id}`} className="mt-2 text-xs font-semibold text-[var(--color-primary-blue)] hover:underline self-start">
                    View ticket →
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
            <p className="text-[var(--color-text-secondary)]">No events yet</p>
            <Link href="/events" className="mt-2 inline-block text-sm font-semibold text-[var(--color-primary-blue)] hover:underline">
              Browse events →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
