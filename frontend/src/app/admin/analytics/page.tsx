import Link from "next/link";
import { TrendingUp, PieChart } from "lucide-react";

/* ─── Metric cards data ──────────────────────────────────────────────────── */
const METRICS = [
  { label: "Total users",                value: "3,842" },
  { label: "Total events",               value: "148"   },
  { label: "Total registrations",        value: "12,470" },
  { label: "Platform-wide attendance",   value: "71%"   },
];

/* ─── Top organizers data ────────────────────────────────────────────────── */
interface Organizer {
  name: string;
  eventsHosted: number;
  totalRegistrations: number;
}

const TOP_ORGANIZERS: Organizer[] = [
  { name: "Bilal Chaudhry",   eventsHosted: 18, totalRegistrations: 2_340 },
  { name: "Usman Tariq",      eventsHosted: 14, totalRegistrations: 1_890 },
  { name: "Tariq Mahmood",    eventsHosted: 11, totalRegistrations: 1_412 },
  { name: "Fatima Siddiqui",  eventsHosted:  9, totalRegistrations:   983 },
  { name: "Zainab Ali",       eventsHosted:  7, totalRegistrations:   761 },
];

const thCls =
  "text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]";
const tdCls = "px-5 py-4 text-sm text-[var(--color-text-primary)]";

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function AdminAnalyticsPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">
          Platform analytics
        </h1>

        {/* ── Metric cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {METRICS.map(({ label, value }) => (
            <div
              key={label}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-1"
            >
              <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
              <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{value}</span>
            </div>
          ))}
        </div>

        {/* ── Chart placeholders ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* User growth chart placeholder */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">User growth</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                New registrations over time
              </p>
            </div>
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-[var(--color-text-secondary)]">
              <TrendingUp size={48} strokeWidth={1.5} />
              <p className="text-sm font-medium">User growth chart</p>
              <p className="text-xs text-center max-w-xs">
                Chart will render here once charting library is wired up
              </p>
            </div>
          </div>

          {/* Events by category chart placeholder */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Events by category</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Distribution across event categories
              </p>
            </div>
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-[var(--color-text-secondary)]">
              <PieChart size={48} strokeWidth={1.5} />
              <p className="text-sm font-medium">Events by category chart</p>
              <p className="text-xs text-center max-w-xs">
                Chart will render here once charting library is wired up
              </p>
            </div>
          </div>

        </div>

        {/* ── Top organizers table ──────────────────────────────────────────── */}
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
          Top organizers
        </h2>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <tr>
                <th className={thCls}>#</th>
                <th className={thCls}>Organizer</th>
                <th className={thCls}>Events hosted</th>
                <th className={thCls}>Total registrations</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--color-background)] divide-y divide-[var(--color-border)]">
              {TOP_ORGANIZERS.map((o, i) => (
                <tr
                  key={o.name}
                  className="hover:bg-[var(--color-surface)] transition-colors duration-100"
                >
                  <td className={`${tdCls} text-[var(--color-text-secondary)] w-12`}>
                    {i + 1}
                  </td>
                  <td className={`${tdCls} font-medium`}>{o.name}</td>
                  <td className={`${tdCls} text-[var(--color-text-secondary)]`}>
                    {o.eventsHosted}
                  </td>
                  <td className={`${tdCls} text-[var(--color-text-secondary)]`}>
                    {o.totalRegistrations.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="sm:hidden flex flex-col gap-3">
          {TOP_ORGANIZERS.map((o, i) => (
            <div
              key={o.name}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-4 flex items-center gap-4"
            >
              <span className="text-lg font-extrabold text-[var(--color-text-secondary)] w-6 shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[var(--color-text-primary)] truncate">
                  {o.name}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {o.eventsHosted} events · {o.totalRegistrations.toLocaleString()} registrations
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
