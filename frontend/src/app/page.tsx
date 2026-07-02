import Link from "next/link";
import { Calendar, Users, Ticket, Code, Brain, Briefcase, Mic, Globe, Zap } from "lucide-react";
import EventCard, { type EventCardProps } from "@/components/EventCard";

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

const EVENTS: EventCardProps[] = [
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
    slug: "career-fair-2026",
    title: "Tech Career Fair 2026",
    category: "Career",
    categoryColor: "#f59e0b",
    date: "Fri, Jul 18 · 9:00 AM",
    venue: "FAST University, Islamabad",
    registeredCount: 210,
    capacity: 300,
    bannerIcon: Briefcase,
    bannerGradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
  },
  {
    slug: "startup-pitch-night",
    title: "Startup Pitch Night",
    category: "Networking",
    categoryColor: "#ec4899",
    date: "Tue, Jul 22 · 7:00 PM",
    venue: "Plan9, Lahore",
    registeredCount: 55,
    capacity: 80,
    bannerIcon: Mic,
    bannerGradient: "linear-gradient(135deg, #ec4899 0%, #9d174d 100%)",
  },
  {
    slug: "open-source-summit",
    title: "Open Source Summit Pakistan",
    category: "Conference",
    categoryColor: "#8b5cf6",
    date: "Sat, Jul 26 · 9:00 AM",
    venue: "NUST, Islamabad",
    registeredCount: 180,
    capacity: 250,
    bannerIcon: Globe,
    bannerGradient: "linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)",
  },
  {
    slug: "hackathon-Codrithm-2026",
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

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Hero */}
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

      {/* Upcoming events */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-8">
            Upcoming events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {EVENTS.map((event) => (
              <EventCard key={event.slug} {...event} />
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href="/events"
              className="
                inline-flex items-center
                px-7 py-3
                text-base font-semibold
                text-[var(--color-text-primary)]
                border border-[var(--color-border)]
                hover:border-[var(--color-primary-blue)]
                hover:text-[var(--color-primary-blue)]
                bg-transparent rounded-full
                transition duration-150
              "
            >
              View all events →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


