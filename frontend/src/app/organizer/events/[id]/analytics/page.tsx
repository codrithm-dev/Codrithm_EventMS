"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { BarChart2 } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { EventAnalytics } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AnalyticsPage({ params }: Props) {
  const { id } = use(params);
  const [analytics, setAnalytics] = useState<EventAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<EventAnalytics>(`/analytics/events/${id}`);
        setAnalytics(data);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <main className="flex-1 flex flex-col">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-48 bg-[var(--color-surface)] rounded animate-pulse mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-[var(--color-surface)] rounded-2xl animate-pulse" />)}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return <main className="flex-1 flex items-center justify-center"><p className="text-red-500">{error}</p></main>;
  }

  const metrics = [
    { label: "Total registrations", value: String(analytics?.total_registrations || 0) },
    { label: "Approved", value: String(analytics?.approved || 0) },
    { label: "Pending", value: String(analytics?.pending || 0) },
    { label: "Checked in", value: String(analytics?.checked_in || 0) },
  ];

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">
          Event analytics — {analytics?.event_title || ""}
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {metrics.map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-1">
              <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
              <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl mb-10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Registration trend</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Daily registrations over time</p>
          </div>
          <div className="h-72 flex flex-col items-center justify-center gap-4 text-[var(--color-text-secondary)]">
            <BarChart2 size={48} strokeWidth={1.5} />
            <p className="text-sm font-medium">Registration trend chart</p>
            <p className="text-xs text-center max-w-xs">Chart will render here once charting library is wired up</p>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-6">
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-5">Registration breakdown</p>
          <div className="flex flex-col gap-4">
            {[
              { label: "Approved", value: analytics?.approved || 0, total: analytics?.total_registrations || 1 },
              { label: "Pending", value: analytics?.pending || 0, total: analytics?.total_registrations || 1 },
              { label: "Rejected", value: analytics?.rejected || 0, total: analytics?.total_registrations || 1 },
              { label: "Waitlisted", value: analytics?.waitlisted || 0, total: analytics?.total_registrations || 1 },
            ].map(({ label, value, total }) => {
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[var(--color-text-primary)]">{label}</span>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">{value} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #0066ff, #87ffbc)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
