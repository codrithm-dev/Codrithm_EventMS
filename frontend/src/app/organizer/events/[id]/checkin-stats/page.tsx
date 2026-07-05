"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { CheckCircle } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { CheckinStats } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CheckInStatsPage({ params }: Props) {
  const { id } = use(params);
  const [stats, setStats] = useState<CheckinStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<CheckinStats>(`/tickets/checkin/${id}/stats`);
        setStats(data);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <main className="flex-1 flex flex-col">
        <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-48 bg-[var(--color-surface)] rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-[var(--color-surface)] rounded-2xl animate-pulse" />)}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return <main className="flex-1 flex items-center justify-center"><p className="text-red-500">{error}</p></main>;
  }

  const metricCards = [
    { label: "Total registered", value: String(stats?.total_registered || 0) },
    { label: "Checked in", value: String(stats?.checked_in || 0) },
    { label: "Not checked in", value: String(stats?.not_checked_in || 0) },
  ];

  const pct = stats?.percentage || 0;

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">Check-in stats</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {metricCards.map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-1">
              <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
              <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Check-in rate</span>
            <span className="text-2xl font-extrabold text-[var(--color-text-primary)]">{Math.round(pct)}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[var(--color-border)] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #0066ff, #87ffbc)" }} />
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">{stats?.checked_in || 0} of {stats?.total_registered || 0} registered attendees have checked in</p>
        </div>
      </div>
    </main>
  );
}
