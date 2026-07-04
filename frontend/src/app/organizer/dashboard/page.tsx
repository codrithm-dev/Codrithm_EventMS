import Link from "next/link";
import EventStatusBadge, { type EventStatus } from "@/components/EventStatusBadge";

const STATS = [
  { label: "Total events",        value: "12"  },
  { label: "Total registrations", value: "847" },
  { label: "Pending approvals",   value: "23"  },
  { label: "Check-in rate",       value: "78%" },
];

interface OrgEvent {
  id: string;
  title: string;
  date: string;
  status: EventStatus;
  registered: number;
  capacity: number;
}

const EVENTS: OrgEvent[] = [
  { id: "1", title: "Full-Stack Web Dev Workshop",  date: "Jul 12, 2026", status: "Published", registered: 42,  capacity: 60  },
  { id: "2", title: "AI & Machine Learning Meetup", date: "Jul 16, 2026", status: "Published", registered: 78,  capacity: 100 },
  { id: "3", title: "Tech Career Fair 2026",         date: "Jul 18, 2026", status: "Published", registered: 210, capacity: 300 },
  { id: "4", title: "Codrithm Hackathon 2026",       date: "Aug 1, 2026",  status: "Draft",     registered: 0,   capacity: 120 },
  { id: "5", title: "UI/UX Design Bootcamp",         date: "Aug 9, 2026",  status: "Archived",  registered: 40,  capacity: 40  },
];

const thCls = "text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]";
const tdCls = "px-5 py-4 text-sm text-[var(--color-text-primary)]";

export default function OrganizerDashboardPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">

        {/* Heading row */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">
            Organizer dashboard
          </h1>
          <Link
            href="/organizer/events/create"
            className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.2)]"
          >
            + Create event
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {STATS.map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-1">
              <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
              <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{value}</span>
            </div>
          ))}
        </div>

        {/* Your events */}
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Your events</h2>
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <tr>
                <th className={thCls}>Event</th>
                <th className={thCls}>Date</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Registered</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="bg-[var(--color-background)] divide-y divide-[var(--color-border)]">
              {EVENTS.map((e) => (
                <tr key={e.id} className="hover:bg-[var(--color-surface)] transition-colors duration-100">
                  <td className={`${tdCls} font-medium`}>{e.title}</td>
                  <td className={`${tdCls} text-[var(--color-text-secondary)] whitespace-nowrap`}>{e.date}</td>
                  <td className={tdCls}><EventStatusBadge status={e.status} /></td>
                  <td className={`${tdCls} text-[var(--color-text-secondary)]`}>{e.registered}/{e.capacity}</td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/organizer/events/${e.id}/edit`} className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline">
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
