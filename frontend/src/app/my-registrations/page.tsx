import Link from "next/link";
import RegistrationStatusBadge, { type RegistrationStatus } from "@/components/RegistrationStatusBadge";

interface Registration {
  id: string;
  eventTitle: string;
  date: string;
  status: RegistrationStatus;
}

const REGISTRATIONS: Registration[] = [
  { id: "reg-001", eventTitle: "Full-Stack Web Dev Workshop",      date: "Sat, Jul 12, 2026",  status: "Approved"   },
  { id: "reg-002", eventTitle: "AI & Machine Learning Meetup",     date: "Wed, Jul 16, 2026",  status: "Pending"    },
  { id: "reg-003", eventTitle: "Tech Career Fair 2026",            date: "Fri, Jul 18, 2026",  status: "Waitlisted" },
  { id: "reg-004", eventTitle: "Startup Pitch Night",              date: "Tue, Jul 22, 2026",  status: "Rejected"   },
  { id: "reg-005", eventTitle: "Open Source Summit Pakistan",      date: "Sat, Jul 26, 2026",  status: "Approved"   },
  { id: "reg-006", eventTitle: "Codrithm Hackathon 2026",          date: "Fri, Aug 1, 2026",   status: "Cancelled"  },
];

export default function MyRegistrationsPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-12">

        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">
          My registrations
        </h1>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">Event</th>
                <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="bg-[var(--color-background)] divide-y divide-[var(--color-border)]">
              {REGISTRATIONS.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--color-surface)] transition-colors duration-100">
                  <td className="px-5 py-4 font-medium text-[var(--color-text-primary)]">{r.eventTitle}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)] whitespace-nowrap">{r.date}</td>
                  <td className="px-5 py-4">
                    <RegistrationStatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/tickets/${r.id}`}
                      className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline whitespace-nowrap"
                    >
                      View ticket →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="sm:hidden flex flex-col gap-3">
          {REGISTRATIONS.map((r) => (
            <div
              key={r.id}
              className="
                bg-[var(--color-surface)]
                border border-[var(--color-border)]
                rounded-2xl px-4 py-4
                flex flex-col gap-2
              "
            >
              <p className="font-semibold text-[var(--color-text-primary)] text-sm">{r.eventTitle}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{r.date}</p>
              <div className="flex items-center justify-between pt-1">
                <RegistrationStatusBadge status={r.status} />
                <Link
                  href={`/tickets/${r.id}`}
                  className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline"
                >
                  View ticket →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
