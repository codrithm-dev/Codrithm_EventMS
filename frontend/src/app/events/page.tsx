"use client";

import { useState, useEffect } from "react";
import { Search, Code, Brain, Briefcase, Mic, Globe, Zap, BookOpen, Coffee, Award, type LucideIcon } from "lucide-react";
import EventCard, { type EventCardProps } from "@/components/EventCard";
import { api, ApiClientError } from "@/lib/api";
import type { EventListItem, PaginatedEvents } from "@/types";

const inputCls = `
  px-4 py-2.5 rounded-xl text-sm
  bg-[var(--color-surface)]
  border border-[var(--color-border)]
  text-[var(--color-text-primary)]
  placeholder:text-[var(--color-text-secondary)]
  outline-none
  focus:border-[var(--color-primary-blue)]
  focus:ring-2 focus:ring-[rgba(0,102,255,0.2)]
  transition-colors duration-150
`.trim();

const categoryIcons: Record<string, LucideIcon> = {
  Workshop: Code, Meetup: Brain, Conference: Globe,
  Hackathon: Zap, Career: Briefcase, Networking: Mic,
  Competition: Award, Bootcamp: BookOpen, Social: Coffee,
};

const categoryColors: Record<string, string> = {
  Workshop: "#0066ff", Meetup: "#87ffbc", Conference: "#8b5cf6",
  Hackathon: "#0066ff", Career: "#f59e0b", Networking: "#ec4899",
  Competition: "#f59e0b", Bootcamp: "#6366f1", Social: "#92400e",
};

function getCategoryIcon(cat: string): LucideIcon {
  return categoryIcons[cat] || Code;
}

function getCategoryColor(cat: string): string {
  return categoryColors[cat] || "#0066ff";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [eventType, setEventType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [page, category, eventType]);

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "9");
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (eventType) params.set("event_type", eventType);

      const data = await api.get<PaginatedEvents>(`/events?${params.toString()}`, true);
      setEvents(data.items);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.detail);
      else setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const toCardProps = (e: EventListItem): EventCardProps => ({
    slug: e.slug,
    title: e.title,
    category: e.category,
    categoryColor: getCategoryColor(e.category),
    date: formatDate(e.date_time),
    venue: e.venue || "Online",
    registeredCount: e.registered_count || 0,
    capacity: e.capacity,
    bannerIcon: getCategoryIcon(e.category),
    bannerGradient: `linear-gradient(135deg, ${getCategoryColor(e.category)} 0%, ${getCategoryColor(e.category)}cc 100%)`,
  });

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">Browse events</h1>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
            <input
              type="search"
              placeholder="Search events…"
              className={`${inputCls} w-full pl-10`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className={`${inputCls} sm:w-44 cursor-pointer`} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All categories</option>
            <option>Workshop</option><option>Meetup</option><option>Conference</option>
            <option>Hackathon</option><option>Career</option><option>Networking</option><option>Competition</option>
          </select>
          <select className={`${inputCls} sm:w-44 cursor-pointer`} value={eventType} onChange={(e) => { setEventType(e.target.value); setPage(1); }}>
            <option value="">All types</option>
            <option>in-person</option><option>online</option><option>hybrid</option>
          </select>
        </form>

        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2 mb-6">{error}</p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--color-text-secondary)] text-lg">No events found</p>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {events.map((event) => (
                <EventCard key={event.slug || event.id} {...toCardProps(event)} />
              ))}
            </div>

            {pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--color-primary-blue)] hover:text-[var(--color-text-primary)] transition-colors duration-150 cursor-pointer"
                >← Previous</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} type="button" onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold border transition-colors duration-150 cursor-pointer ${p === page ? "bg-[var(--color-primary-blue)] border-[var(--color-primary-blue)] text-white" : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-text-primary)]"}`}
                  >{p}</button>
                ))}
                <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--color-primary-blue)] hover:text-[var(--color-text-primary)] transition-colors duration-150 cursor-pointer"
                >Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
