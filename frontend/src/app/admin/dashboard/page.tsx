"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, CalendarDays, BarChart2, PlusCircle, Settings } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { PlatformAnalytics } from "@/types";

export default function AdminDashboardPage() {
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

  const metrics = analytics ? [
    { label: "Total users", value: analytics.total_users.toLocaleString() },
    { label: "Total events", value: analytics.total_events.toLocaleString() },
    { label: "Total registrations", value: analytics.total_registrations.toLocaleString() },
    { label: "Active categories", value: String(Object.keys(analytics.events_by_category || {}).length) },
  ] : [
    { label: "Total users", value: "—" },
    { label: "Total events", value: "—" },
    { label: "Total registrations", value: "—" },
    { label: "Active categories", value: "—" },
  ];

  const QUICK_ACTIONS = [
    { label: "Manage users", description: "View, edit, and manage all platform users.", href: "/admin/users", Icon: Users },
    { label: "Create event", description: "Create a new event for the platform.", href: "/organizer/events/create", Icon: PlusCircle },
    { label: "Manage events", description: "View and manage all events on the platform.", href: "/organizer/events", Icon: CalendarDays },
    { label: "Analytics", description: "Explore platform-wide metrics and trends.", href: "/admin/analytics", Icon: BarChart2 },
    { label: "My registrations", description: "View your own event registrations.", href: "/my-registrations", Icon: Settings },
  ];

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">Admin dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metrics.map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-1">
              <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
              <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{loading ? "..." : value}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {QUICK_ACTIONS.map(({ label, description, href, Icon }) => (
            <Link key={label} href={href}
              className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-3 hover:border-[var(--color-primary-blue)]/50 hover:shadow-lg hover:shadow-[rgba(0,102,255,0.08)] transition duration-150">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-primary-blue)]/10 text-[var(--color-primary-blue)] group-hover:bg-[var(--color-primary-blue)]/20 transition duration-150">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">{label}</p>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
