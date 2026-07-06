"use client";

import { useState, useEffect } from "react";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell,
  LineChart, Line,
} from "recharts";
import { api } from "@/lib/api";
import type { PlatformAnalytics } from "@/types";

const COLORS = ["#0066ff", "#87ffbc", "#ff6b6b", "#ffd93d", "#6bcbff", "#c084fc", "#fb923c"];

const chartTooltipStyle = {
  contentStyle: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 12,
    fontSize: 12,
  },
  labelStyle: { color: "var(--color-text-primary)" },
};

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
    { label: "Approval rate", value: analytics?.approval_rate != null ? `${analytics.approval_rate}%` : "—" },
  ];

  const categoryPieData = (analytics?.events_by_category
    ? Object.entries(analytics.events_by_category)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 7)
    : []
  ).map(([name, value]) => ({ name, value }));

  const registrationBarData = analytics?.registrations_over_time?.map((d) => ({
    date: d.date.slice(5),
    count: d.count,
  })) || [];

  const userGrowthData = analytics?.user_growth?.map((d) => ({
    date: d.date.slice(5),
    count: d.count,
  })) || [];

  const statusPieData = analytics?.registrations_by_status
    ? Object.entries(analytics.registrations_by_status).map(([name, value]) => ({ name, value }))
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
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Registrations over time</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Last 30 days</p>
            </div>
            <div className="p-6">
              {registrationBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={registrationBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} allowDecimals={false} />
                    <Tooltip {...chartTooltipStyle} />
                    <Bar dataKey="count" fill="#0066ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-[var(--color-text-secondary)]">
                  <BarChart3 size={48} strokeWidth={1.5} />
                  <p className="text-sm font-medium">No data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">User growth</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">New users over last 30 days</p>
            </div>
            <div className="p-6">
              {userGrowthData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} allowDecimals={false} />
                    <Tooltip {...chartTooltipStyle} />
                    <Line type="monotone" dataKey="count" stroke="#87ffbc" strokeWidth={2} dot={{ r: 3, fill: "#87ffbc" }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-[var(--color-text-secondary)]">
                  <BarChart3 size={48} strokeWidth={1.5} />
                  <p className="text-sm font-medium">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Events by category</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Distribution across categories</p>
            </div>
            <div className="p-6">
              {categoryPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {categoryPieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...chartTooltipStyle} />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-[var(--color-text-secondary)]">
                  <PieChartIcon size={48} strokeWidth={1.5} />
                  <p className="text-sm font-medium">No data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Registration status</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Breakdown by current status</p>
            </div>
            <div className="p-6">
              {statusPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {statusPieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...chartTooltipStyle} />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-[var(--color-text-secondary)]">
                  <PieChartIcon size={48} strokeWidth={1.5} />
                  <p className="text-sm font-medium">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
