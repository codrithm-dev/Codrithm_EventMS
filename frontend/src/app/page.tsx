"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Users, Ticket, Code, Brain, Briefcase, Mic, Globe, Zap, Coffee, type LucideIcon } from "lucide-react";
import EventCard, { type EventCardProps } from "@/components/EventCard";
import { api, ApiClientError } from "@/lib/api";
import type { EventListItem, PaginatedEvents } from "@/types";

const STATS = [
  { value: "50+", label: "Events Hosted" },
  { value: "1K+", label: "Registrations" },
  { value: "95%", label: "Approval Rate" },
];

const ICON_BADGES = [
  { icon: Calendar, bg: "rgba(0,102,255,0.12)", color: "#0066ff", label: "Calendar" },
  { icon: Users, bg: "rgba(135,255,188,0.12)", color: "#87ffbc", label: "Community" },
  { icon: Ticket, bg: "rgba(0,102,255,0.08)", color: "#0066ff", label: "Tickets" },
];

const categoryIcons: Record<string, LucideIcon> = {
  Workshop: Code, Meetup: Brain, Conference: Globe,
  Hackathon: Zap, Career: Briefcase, Networking: Mic,
  Competition: Code, Bootcamp: Code, Social: Coffee,
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
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function HomePage() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<PaginatedEvents>("/events?limit=6&status=published", true);
        setEvents(data.items);
      } catch (e) {
        console.error("Failed to load events", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32 overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-30" style={{ background: "radial-gradient(circle, #0066ff 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute -bottom-32 -right-16 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #87ffbc 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute top-16 right-0 w-[300px] h-[300px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #0066ff 0%, transparent 70%)", filter: "blur(60px)" }} />
        </div>

        <div className="flex items-center gap-3 mb-8" aria-hidden="true">
          {ICON_BADGES.map(({ icon: Icon, bg, color, label }) => (
            <span key={label} className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: bg }}>
              <Icon size={18} color={color} strokeWidth={2} />
            </span>
          ))}
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-[var(--color-text-primary)] max-w-4xl mx-auto mb-6">
          Find Your{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #0066ff 0%, #87ffbc 100%)" }}>
            Next Event
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto mb-10 leading-relaxed">
          From workshops to meetups — discover events, register in seconds, and manage everything in one place.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/events" className="inline-flex items-center px-7 py-3 text-base font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 active:scale-[0.98] rounded-full transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.25)]">
            Browse Events
          </Link>
          <Link href="/about" className="inline-flex items-center px-7 py-3 text-base font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)] bg-transparent rounded-full transition duration-150">
            About Codrithm
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-0 divide-x divide-[var(--color-border)]" aria-label="Platform statistics">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center px-8 py-2">
              <span className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">{value}</span>
              <span className="text-xs sm:text-sm mt-0.5 text-[var(--color-text-secondary)]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-8">Upcoming events</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {events.map((event) => (
                  <EventCard key={event.slug || event.id} {...toCardProps(event)} />
                ))}
              </div>
              <div className="flex justify-center">
                <Link href="/events" className="inline-flex items-center px-7 py-3 text-base font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)] bg-transparent rounded-full transition duration-150">
                  View all events →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
              <p className="text-[var(--color-text-secondary)]">No events available right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
