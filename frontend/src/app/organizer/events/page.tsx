import Link from "next/link";
import EventStatusBadge, { type EventStatus } from "@/components/EventStatusBadge";

interface OrgEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  registered: number;
  capacity: number;
  status: EventStatus;
}

const EVENTS: OrgEvent[] = [
  { id: "1", title: "Full-Stack Web Dev Workshop",    category: "Workshop",    date: "Jul 12, 2026", registered: 42,  capacity: 60,  status: "Published" },
  { id: "2", title: "AI & Machine Learning Meetup",   category: "Meetup",      date: "Jul 16, 2026", registered: 78,  capacity: 100, status: "Published" },
  { id: "3", title: "Tech Career Fair 2026",           category: "Career",      date: "Jul 18, 2026", registered: 210, capacity: 300, status: "Published" },
  { id: "4", title: "Startup Pitch Night",             category: "Networking",  date: "Jul 22, 2026", registered: 55,  capacity: 80,  status: "Published" },
  { id: "5", title: "Open Source Summit Pakistan",     category: "Conference",  date: "Jul 26, 2026", registered: 180, capacity: 250, status: "Published" },
  { id: "6", title: "Codrithm Hackathon 2026",         category: "Hackathon",   date: "Aug 1, 2026",  registered: 0,   capacity: 120, status: "Draft"     },
  { id: "7", title: "UI/UX Design Bootcamp",           category: "Workshop",    date: "Aug 9, 2026",  registered: 40,  capacity: 40,  status: "Archived"  },
  { id: "8", title: "National Coding Competition",     category: "Competition", date: "Aug 23, 2026", registered: 320, capacity: 500, status: "Published" },
];

const thCls = "text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]";
const tdCls = "px-5 py-4 text-sm";

export default function OrganizerEventsPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">

        {/* Heading row */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">My events</h1>
          <Link
            href="/organizer/events/create"
            className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.2)]"
          >
            + Create event
          </Link>
        </div>

        {/* Desktop table */}
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
              {EVENTS.map((e) => (
                <tr key={e.id} className="hover:bg-[var(--color-surface)] transition-colors duration-100">
                  <td className={`${tdCls} font-medium text-[var(--color-text-primary)]`}>{e.title}</td>
                  <td className={`${tdCls} text-[var(--color-text-secondary)]`}>{e.category}</td>
                  <td className={`${tdCls} text-[var(--color-text-secondary)] whitespace-nowrap`}>{e.date}</td>
                  <td className={`${tdCls} text-[var(--color-text-secondary)]`}>{e.registered}/{e.capacity}</td>
                  <td className={tdCls}><EventStatusBadge status={e.status} /></td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/events/${e.id}`} className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline">View</Link>
                      <Link href={`/organizer/events/${e.id}/edit`} className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline">Edit</Link>
                      <Link href={`/organizer/events/${e.id}/registrations`} className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline">Registrations</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="sm:hidden flex flex-col gap-3">
          {EVENTS.map((e) => (
            <div key={e.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm text-[var(--color-text-primary)]">{e.title}</p>
                <EventStatusBadge status={e.status} />
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">{e.category} · {e.date} · {e.registered}/{e.capacity}</p>
              <div className="flex items-center gap-4 pt-1">
                <Link href={`/events/${e.id}`} className="text-xs font-semibold text-[var(--color-text-secondary)] hover:underline">View</Link>
                <Link href={`/organizer/events/${e.id}/edit`} className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline">Edit</Link>
                <Link href={`/organizer/events/${e.id}/registrations`} className="text-xs font-semibold text-[var(--color-text-secondary)] hover:underline">Registrations</Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
