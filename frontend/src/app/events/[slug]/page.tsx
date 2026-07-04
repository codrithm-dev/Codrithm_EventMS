import Link from "next/link";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailsPage({ params }: Props) {
  const { slug } = await params;
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Banner */}
        <div
          className="w-full h-56 sm:h-72 rounded-2xl mb-8 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0066ff 0%, #87ffbc 100%)" }}
          aria-hidden="true"
        />

        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Left: Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(0,102,255,0.12)", color: "#0066ff" }}>
                Workshop
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(135,255,188,0.12)", color: "#87ffbc" }}>
                In-person
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] mb-6 leading-tight">
              Full-Stack Web Dev Workshop
            </h1>

            {/* Info row */}
            <div className="flex flex-wrap gap-6 pb-6 mb-6 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Calendar size={15} strokeWidth={2} />
                <span>Saturday, Jul 12, 2026</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Clock size={15} strokeWidth={2} />
                <span>10:00 AM – 4:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <MapPin size={15} strokeWidth={2} />
                <span>Tech Hub, Lahore</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Users size={15} strokeWidth={2} />
                <span>60 capacity</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">About this event</h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                Join us for a full-day hands-on workshop covering the modern full-stack development landscape. Whether you&apos;re a beginner looking to break into web development or an intermediate developer wanting to level up, this workshop is designed to give you practical, real-world skills you can use immediately.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                We&apos;ll cover everything from setting up your development environment and building a REST API with Node.js and Express, to connecting a React front-end and deploying your finished project to the cloud. Each section includes live coding sessions, Q&amp;A, and dedicated lab time with mentors on hand to help you through any roadblocks.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Attendees are encouraged to bring their own laptops. Lunch and refreshments will be provided throughout the day. Seats are limited — register early to secure your spot and receive the pre-workshop reading materials ahead of time.
              </p>
            </div>
          </div>

          {/* ── Right: Register sidebar ── */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">

                {/* Capacity */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">Registered</span>
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">42 / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: "42%", background: "linear-gradient(90deg, #0066ff, #87ffbc)" }}
                    />
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">58 spots remaining</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-2xl font-extrabold text-[var(--color-text-primary)]">Free</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">· open registration</span>
                </div>

                {/* CTA */}
                <Link
                  href={`/events/${slug}/register`}
                  className="inline-flex items-center justify-center w-full py-3 px-6 rounded-full text-base font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 active:scale-[0.98] transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.25)]"
                >
                  Register now
                </Link>

                {/* Organizer */}
                <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">Organizer</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #0066ff, #87ffbc)" }}
                    >
                      CE
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">Codrithm Events</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">Verified organizer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
