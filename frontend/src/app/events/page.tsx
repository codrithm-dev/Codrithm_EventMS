import { Search } from "lucide-react";
import { Code, Brain, Briefcase, Mic, Globe, Zap, BookOpen, Coffee, Award } from "lucide-react";
import EventCard, { type EventCardProps } from "@/components/EventCard";

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
  {
    slug: "ui-ux-bootcamp",
    title: "UI/UX Design Bootcamp",
    category: "Workshop",
    categoryColor: "#0066ff",
    date: "Sat, Aug 9 · 10:00 AM",
    venue: "LUMS, Lahore",
    registeredCount: 28,
    capacity: 40,
    bannerIcon: BookOpen,
    bannerGradient: "linear-gradient(135deg, #6366f1 0%, #312e81 100%)",
  },
  {
    slug: "dev-chai-aug",
    title: "Dev & Chai — August Edition",
    category: "Meetup",
    categoryColor: "#87ffbc",
    date: "Thu, Aug 14 · 6:30 PM",
    venue: "Kickstart Café, Karachi",
    registeredCount: 34,
    capacity: 50,
    bannerIcon: Coffee,
    bannerGradient: "linear-gradient(135deg, #92400e 0%, #451a03 100%)",
  },
  {
    slug: "coding-competition-2026",
    title: "National Coding Competition",
    category: "Competition",
    categoryColor: "#f59e0b",
    date: "Sat, Aug 23 · 9:00 AM",
    venue: "Virtual · Online",
    registeredCount: 320,
    capacity: 500,
    bannerIcon: Award,
    bannerGradient: "linear-gradient(135deg, #f59e0b 0%, #0066ff 100%)",
  },
];

const PAGES = [1, 2, 3];
const CURRENT_PAGE = 1;

export default function EventsPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">
          Browse events
        </h1>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
            />
            <input
              type="search"
              placeholder="Search events…"
              className={`${inputCls} w-full pl-10`}
            />
          </div>

          {/* Category */}
          <select className={`${inputCls} sm:w-44 cursor-pointer`} defaultValue="">
            <option value="" disabled>Category</option>
            <option>Workshop</option>
            <option>Meetup</option>
            <option>Conference</option>
            <option>Hackathon</option>
            <option>Career</option>
            <option>Networking</option>
            <option>Competition</option>
          </select>

          {/* Event type */}
          <select className={`${inputCls} sm:w-44 cursor-pointer`} defaultValue="">
            <option value="" disabled>Event type</option>
            <option>In-person</option>
            <option>Virtual</option>
            <option>Hybrid</option>
          </select>

          {/* Date */}
          <select className={`${inputCls} sm:w-44 cursor-pointer`} defaultValue="">
            <option value="" disabled>Date</option>
            <option>This week</option>
            <option>This month</option>
            <option>Next month</option>
          </select>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {EVENTS.map((event) => (
            <EventCard key={event.slug} {...event} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled
            className="
              px-4 py-2 rounded-xl text-sm font-medium
              border border-[var(--color-border)]
              text-[var(--color-text-secondary)]
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:border-[var(--color-primary-blue)]
              hover:text-[var(--color-text-primary)]
              transition-colors duration-150
              cursor-pointer
            "
          >
            ← Previous
          </button>

          {PAGES.map((page) => (
            <button
              key={page}
              type="button"
              className={`
                w-10 h-10 rounded-xl text-sm font-semibold
                border transition-colors duration-150 cursor-pointer
                ${page === CURRENT_PAGE
                  ? "bg-[var(--color-primary-blue)] border-[var(--color-primary-blue)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-text-primary)]"
                }
              `}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="
              px-4 py-2 rounded-xl text-sm font-medium
              border border-[var(--color-border)]
              text-[var(--color-text-secondary)]
              hover:border-[var(--color-primary-blue)]
              hover:text-[var(--color-text-primary)]
              transition-colors duration-150
              cursor-pointer
            "
          >
            Next →
          </button>
        </div>

      </div>
    </main>
  );
}
