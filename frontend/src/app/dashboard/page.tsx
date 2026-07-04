import { Code, Brain, Zap } from "lucide-react";
import EventCard, { type EventCardProps } from "@/components/EventCard";

const STAT_CARDS = [
  { label: "Upcoming events",    value: "3" },
  { label: "Total registrations", value: "8" },
  { label: "Events attended",    value: "5" },
];

// Hardcoded upcoming events for the dashboard grid.
// TODO: replace with real API data; show empty state ("No upcoming events yet — browse events to register") when array is empty.
const UPCOMING: EventCardProps[] = [
  {
    slug: "web-dev-workshop-2026",
    title: "Full-Stack Web Dev Workshop",
    category: "Workshop",
    categoryColor: "#0066ff",
    date: "Sat, Jul 12 · 10:00 AM",
    venue: "Tech Hub, Lahore",
    registeredCount: 42,
    capacity: 60,
    bannerIcon: Code,
    bannerGradient: "linear-gradient(135deg, #0066ff 0%, #0044cc 100%)",
  },
  {
    slug: "ai-meetup-july",
    title: "AI & Machine Learning Meetup",
    category: "Meetup",
    categoryColor: "#87ffbc",
    date: "Wed, Jul 16 · 6:00 PM",
    venue: "The Nest, Karachi",
    registeredCount: 78,
    capacity: 100,
    bannerIcon: Brain,
    bannerGradient: "linear-gradient(135deg, #00c97a 0%, #007a50 100%)",
  },
  {
    slug: "hackathon-codrithm-2026",
    title: "Codrithm Hackathon 2026",
    category: "Hackathon",
    categoryColor: "#0066ff",
    date: "Fri–Sat, Aug 1–2 · 8:00 AM",
    venue: "Arfa Tower, Lahore",
    registeredCount: 95,
    capacity: 120,
    bannerIcon: Zap,
    bannerGradient: "linear-gradient(135deg, #0066ff 0%, #87ffbc 100%)",
  },
];

export default function DashboardPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">
          Welcome back, Alex
        </h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {STAT_CARDS.map(({ label, value }) => (
            <div
              key={label}
              className="
                bg-[var(--color-surface)]
                border border-[var(--color-border)]
                rounded-2xl px-6 py-5
                flex flex-col gap-1
              "
            >
              <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
              <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{value}</span>
            </div>
          ))}
        </div>

        {/* Upcoming events */}
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
          Upcoming events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {UPCOMING.map((event) => (
            <EventCard key={event.slug} {...event} />
          ))}
        </div>

      </div>
    </main>
  );
}
