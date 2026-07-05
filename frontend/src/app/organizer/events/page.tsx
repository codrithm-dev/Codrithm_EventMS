"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import EventStatusBadge, { type EventStatus } from "@/components/EventStatusBadge";
import { api, ApiClientError } from "@/lib/api";
import type { EventListItem, PaginatedEvents } from "@/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const thCls = "text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]";
const tdCls = "px-5 py-4 text-sm";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<PaginatedEvents>("/events/my");
        setEvents(data.items);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 flex flex-col">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-48 bg-[var(--color-surface)] rounded animate-pulse mb-8" />
          <div className="h-64 bg-[var(--color-surface)] rounded-2xl animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">My events</h1>
          <Link href="/organizer/events/create"
            className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.2)]"
          >+ Create event</Link>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2 mb-6">{error}</p>}

        {events.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
            <p className="text-[var(--color-text-secondary)] text-lg">No events yet</p>
            <Link href="/organizer/events/create" className="mt-2 inline-block text-sm font-semibold text-[var(--color-primary-blue)] hover:underline">Create your first event →</Link>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-hidden rounded-2xl border border-[var(--color-border)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className={thCls}>Event</th>
                    <th className={thCls}>Category</th>
                    <th className={thCls}>Date</th>
                    <th className={thCls}>Capacity</th>
                    <th className={thCls}>Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="bg-[var(--color-background)] divide-y divide-[var(--color-border)]">
                  {events.map((e) => (
                    <tr key={e.id} className="hover:bg-[var(--color-surface)] transition-colors duration-100">
                      <td className={`${tdCls} font-medium text-[var(--color-text-primary)]`}>{e.title}</td>
                      <td className={`${tdCls} text-[var(--color-text-secondary)]`}>{e.category}</td>
                      <td className={`${tdCls} text-[var(--color-text-secondary)] whitespace-nowrap`}>{formatDate(e.date_time)}</td>
                      <td className={`${tdCls} text-[var(--color-text-secondary)]`}>{e.registered_count || 0}/{e.capacity}</td>
                      <td className={tdCls}><EventStatusBadge status={e.status as EventStatus} /></td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <Link href={`/events/${e.slug}`} className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline">View</Link>
                          <Link href={`/organizer/events/${e.id}/edit`} className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline">Edit</Link>
                          <Link href={`/organizer/events/${e.id}/registrations`} className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline">Registrations</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden flex flex-col gap-3">
              {events.map((e) => (
                <div key={e.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-[var(--color-text-primary)]">{e.title}</p>
                    <EventStatusBadge status={e.status as EventStatus} />
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">{e.category} · {formatDate(e.date_time)} · {e.registered_count || 0}/{e.capacity}</p>
                  <div className="flex items-center gap-4 pt-1">
                    <Link href={`/events/${e.slug}`} className="text-xs font-semibold text-[var(--color-text-secondary)] hover:underline">View</Link>
                    <Link href={`/organizer/events/${e.id}/edit`} className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline">Edit</Link>
                    <Link href={`/organizer/events/${e.id}/registrations`} className="text-xs font-semibold text-[var(--color-text-secondary)] hover:underline">Registrations</Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
