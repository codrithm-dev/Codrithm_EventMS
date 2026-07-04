import { CheckCircle } from "lucide-react";

const STATS = [
  { label: "Total registered", value: "100" },
  { label: "Checked in",       value: "68"  },
  { label: "Not checked in",   value: "32"  },
];

const RECENT = [
  { name: "Alex Rivera",    time: "10:04 AM" },
  { name: "Aisha Malik",    time: "10:07 AM" },
  { name: "Sara Khan",      time: "10:11 AM" },
  { name: "Ahmed Siddiqui", time: "10:15 AM" },
  { name: "Bilal Ahmed",    time: "10:19 AM" },
];

export default function CheckInStatsPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-12">

        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">Check-in stats</h1>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {STATS.map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-1">
              <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
              <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{value}</span>
            </div>
          ))}
        </div>

        {/* Check-in rate */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Check-in rate</span>
            <span className="text-2xl font-extrabold text-[var(--color-text-primary)]">68%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[var(--color-border)] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "68%", background: "linear-gradient(90deg, #0066ff, #87ffbc)" }} />
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">68 of 100 registered attendees have checked in</p>
        </div>

        {/* Recently checked in */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">Recently checked in</p>
          <div className="flex flex-col gap-2">
            {RECENT.map(({ name, time }) => (
              <div key={name} className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" strokeWidth={2} />
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">{name}</span>
                </div>
                <span className="text-xs text-[var(--color-text-secondary)]">{time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
