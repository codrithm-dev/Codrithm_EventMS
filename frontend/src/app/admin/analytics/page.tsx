"use client";

import { useState, useEffect } from "react";
import { TrendingUp, PieChart } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { PlatformAnalytics } from "@/types";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<PlatformAnalytics>("/analytics/platform");
        setAnalytics(data);
      } catch (e) {
        console.error("Failed to load analytics", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const metrics = [
    { label: "Total users", value: analytics?.total_users?.toLocaleString() || "—" },
    { label: "Total events", value: analytics?.total_events?.toLocaleString() || "—" },
    { label: "Total registrations", value: analytics?.total_registrations?.toLocaleString() || "—" },
  ];

  const topCategories = analytics?.events_by_category
    ? Object.entries(analytics.events_by_category)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">Platform analytics</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {metrics.map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-1">
              <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
              <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{loading ? "..." : value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Events by category</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Distribution across event categories</p>
            </div>
            <div className="p-6">
              {topCategories.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {topCategories.map(([category, count]) => {
                    const maxCount = topCategories[0][1];
                    const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-[var(--color-text-primary)]">{category}</span>
                          <span className="text-sm font-semibold text-[var(--color-text-primary)]">{count}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #0066ff, #87ffbc)" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center gap-4 text-[var(--color-text-secondary)]">
                  <PieChart size={48} strokeWidth={1.5} />
                  <p className="text-sm font-medium">No data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">User growth</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">New registrations over time</p>
            </div>
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-[var(--color-text-secondary)]">
              <TrendingUp size={48} strokeWidth={1.5} />
              <p className="text-sm font-medium">User growth chart</p>
              <p className="text-xs text-center max-w-xs">Chart will render here once charting library is wired up</p>
            </div>
          </div>
        </div>

        {analytics?.events_by_category && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-6">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-5">Categories breakdown</p>
            <div className="flex flex-col gap-4">
              {topCategories.map(([category, count]) => {
                const total = topCategories.reduce((s, [, c]) => s + c, 0);
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[var(--color-text-primary)]">{category}</span>
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #0066ff, #87ffbc)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
