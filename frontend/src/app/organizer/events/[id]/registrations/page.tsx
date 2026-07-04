import Link from "next/link";
import { Search, Download } from "lucide-react";
import RegistrationStatusBadge, { type RegistrationStatus } from "@/components/RegistrationStatusBadge";

interface Registrant {
  id: string;
  name: string;
  email: string;
  date: string;
  status: RegistrationStatus;
}

const ROWS: Registrant[] = [
  { id: "r01", name: "Alex Rivera",      email: "alex@example.com",     date: "Jul 2, 2026",  status: "Approved"   },
  { id: "r02", name: "Aisha Malik",      email: "aisha@example.com",    date: "Jul 2, 2026",  status: "Approved"   },
  { id: "r03", name: "Hassan Raza",      email: "hassan@example.com",   date: "Jul 3, 2026",  status: "Pending"    },
  { id: "r04", name: "Fatima Noor",      email: "fatima@example.com",   date: "Jul 3, 2026",  status: "Pending"    },
  { id: "r05", name: "Bilal Ahmed",      email: "bilal@example.com",    date: "Jul 3, 2026",  status: "Waitlisted" },
  { id: "r06", name: "Sara Khan",        email: "sara@example.com",     date: "Jul 4, 2026",  status: "Approved"   },
  { id: "r07", name: "Usman Tariq",      email: "usman@example.com",    date: "Jul 4, 2026",  status: "Rejected"   },
  { id: "r08", name: "Mariam Yousaf",    email: "mariam@example.com",   date: "Jul 5, 2026",  status: "Pending"    },
  { id: "r09", name: "Ahmed Siddiqui",   email: "ahmed@example.com",    date: "Jul 5, 2026",  status: "Approved"   },
  { id: "r10", name: "Zara Hussain",     email: "zara@example.com",     date: "Jul 6, 2026",  status: "Cancelled"  },
];

const inputCls = "px-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-primary-blue)] focus:ring-2 focus:ring-[rgba(0,102,255,0.2)] transition-colors duration-150";
const thCls = "text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]";
const tdCls = "px-5 py-4 text-sm";

interface Props { params: Promise<{ id: string }> }

export default async function RegistrationsPage({ params }: Props) {
  const { id } = await params;
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">

        <Link href="/organizer/events" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6">
          ← Back to my events
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">
            Registrations for Full-Stack Web Dev Workshop
          </h1>
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)] bg-transparent transition duration-150 cursor-pointer">
            <Download size={14} strokeWidth={2} />
            Export CSV
          </button>
        </div>

        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
            <input type="search" placeholder="Search by name or email…" className={`${inputCls} w-full pl-10`} />
          </div>
          <select defaultValue="all" className={`${inputCls} sm:w-48 cursor-pointer`}>
            <option value="all">All statuses</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Waitlisted</option>
            <option>Cancelled</option>
          </select>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <tr>
                <th className={thCls}>Name</th>
                <th className={thCls}>Email</th>
                <th className={thCls}>Registered</th>
                <th className={thCls}>Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="bg-[var(--color-background)] divide-y divide-[var(--color-border)]">
              {ROWS.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--color-surface)] transition-colors duration-100">
                  <td className={`${tdCls} font-medium text-[var(--color-text-primary)]`}>{r.name}</td>
                  <td className={`${tdCls} text-[var(--color-text-secondary)]`}>{r.email}</td>
                  <td className={`${tdCls} text-[var(--color-text-secondary)] whitespace-nowrap`}>{r.date}</td>
                  <td className={tdCls}><RegistrationStatusBadge status={r.status} /></td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/organizer/events/${id}/queue`} className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden flex flex-col gap-3">
          {ROWS.map((r) => (
            <div key={r.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm text-[var(--color-text-primary)]">{r.name}</p>
                <RegistrationStatusBadge status={r.status} />
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">{r.email} · {r.date}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
