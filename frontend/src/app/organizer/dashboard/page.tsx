"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import EventStatusBadge, { type EventStatus } from "@/components/EventStatusBadge";
import { api, ApiClientError } from "@/lib/api";
import type { OrganizerDashboardSummary, EventListItem } from "@/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function OrganizerDashboardPage() {
  const [summary, setSummary] = useState<OrganizerDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<OrganizerDashboardSummary>("/admin/dashboard/organizer/events");
        setSummary(data);
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-[var(--color-surface)] rounded-2xl animate-pulse" />)}
          </div>
          <div className="h-64 bg-[var(--color-surface)] rounded-2xl animate-pulse" />
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
    { label: "Total events", value: String(summary?.total_events || 0) },
    { label: "Total registrations", value: String(summary?.total_registrations || 0) },
    { label: "Pending approvals", value: String(summary?.pending_approvals || 0) },
    { label: "Check-in rate", value: `${Math.round((summary?.checkin_rate || 0) * 100)}%` },
  ];

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">Organizer dashboard</h1>
          <Link href="/organizer/events/create"
            className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.2)]"
          >+ Create event</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-1">
              <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
              <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{value}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Your events</h2>
        {summary?.recent_events && summary.recent_events.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Event</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Registered</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="bg-[var(--color-background)] divide-y divide-[var(--color-border)]">
                {summary.recent_events.map((e: EventListItem) => (
                  <tr key={e.id} className="hover:bg-[var(--color-surface)] transition-colors duration-100">
                    <td className="px-5 py-4 text-sm font-medium text-[var(--color-text-primary)]">{e.title}</td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">{formatDate(e.date_time)}</td>
                    <td className="px-5 py-4"><EventStatusBadge status={e.status as EventStatus} /></td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">{e.registered_count || 0}/{e.capacity}</td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/organizer/events/${e.id}/edit`} className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline">Manage →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
            <p className="text-[var(--color-text-secondary)]">No events yet</p>
            <Link href="/organizer/events/create" className="mt-2 inline-block text-sm font-semibold text-[var(--color-primary-blue)] hover:underline">Create your first event →</Link>
          </div>
        )}
      </div>
    </main>
  );
}
