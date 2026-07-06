"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Code, Brain, Briefcase, Mic, Globe, Zap, BookOpen, Coffee, Award, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import type { PaginatedEvents } from "@/types";

const CATEGORY_INFO: Record<string, { icon: LucideIcon; color: string; description: string }> = {
  Workshop: { icon: Code, color: "#0066ff", description: "Hands-on learning sessions to build practical skills" },
  Meetup: { icon: Brain, color: "#87ffbc", description: "Casual gatherings for community connection" },
  Conference: { icon: Globe, color: "#8b5cf6", description: "Large-scale events with talks and presentations" },
  Hackathon: { icon: Zap, color: "#0066ff", description: "Intensive building competitions and coding sprints" },
  Career: { icon: Briefcase, color: "#f59e0b", description: "Professional development and networking events" },
  Networking: { icon: Mic, color: "#ec4899", description: "Connect with like-minded professionals" },
  Competition: { icon: Award, color: "#f59e0b", description: "Competitive events and challenges" },
  Bootcamp: { icon: BookOpen, color: "#6366f1", description: "Intensive training programs and crash courses" },
  Social: { icon: Coffee, color: "#92400e", description: "Fun social gatherings and community events" },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_INFO);

export default function EventCategoriesPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const results = await Promise.all(
          ALL_CATEGORIES.map(async (cat) => {
            try {
              const data = await api.get<PaginatedEvents>(`/events?category=${cat}&limit=1&status=published`, true);
              return [cat, data.total] as const;
            } catch {
              return [cat, 0] as const;
            }
          })
        );
        const map: Record<string, number> = {};
        for (const [cat, count] of results) {
          map[cat] = count;
        }
        setCounts(map);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-2">Event categories</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-10">Browse events by category</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_CATEGORIES.map((cat) => {
              const info = CATEGORY_INFO[cat];
              const Icon = info.icon;
              const count = counts[cat] || 0;
              return (
                <Link
                  key={cat}
                  href={`/events?category=${cat}`}
                  className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-primary-blue)]/50 hover:shadow-lg hover:shadow-[rgba(0,102,255,0.08)] transition duration-150"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${info.color}1a`, color: info.color }}
                    >
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-blue)] transition-colors duration-150 mb-1">
                        {cat}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-2">
                        {info.description}
                      </p>
                      <span className="text-xs font-medium" style={{ color: info.color }}>
                        {count} {count === 1 ? "event" : "events"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
