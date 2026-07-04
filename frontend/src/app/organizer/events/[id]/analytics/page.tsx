import { BarChart2 } from "lucide-react";

const METRICS = [
  { label: "Total registrations",  value: "100" },
  { label: "Approval rate",        value: "84%" },
  { label: "Attendance rate",      value: "68%" },
  { label: "Waitlist conversion",  value: "40%" },
];

const BREAKDOWN = [
  { label: "Workshop attendees", pct: 72 },
  { label: "First-time attendees", pct: 58 },
  { label: "Student registrations", pct: 65 },
  { label: "Industry professionals", pct: 35 },
];

export default function AnalyticsPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-12">

        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">Event analytics</h1>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {METRICS.map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-1">
              <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
              <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{value}</span>
            </div>
          ))}
        </div>

        {/* Chart placeholder */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl mb-10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Registration trend</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Daily registrations over time</p>
          </div>
          <div className="h-72 flex flex-col items-center justify-center gap-4 text-[var(--color-text-secondary)]">
            <BarChart2 size={48} strokeWidth={1.5} />
            <p className="text-sm font-medium">Registration trend chart</p>
            <p className="text-xs text-center max-w-xs">Chart will render here once charting library is wired up</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-6">
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-5">Registrations breakdown</p>
          <div className="flex flex-col gap-4">
            {BREAKDOWN.map(({ label, pct }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[var(--color-text-primary)]">{label}</span>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: "linear-gradient(90deg, #0066ff, #87ffbc)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
