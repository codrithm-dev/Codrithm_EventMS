import Link from "next/link";
import {
  Users,
  CalendarDays,
  UserCheck,
  Clock,
  CheckCircle2,
  PlusCircle,
  BarChart2,
  UserCog,
  AlertCircle,
  LogIn,
} from "lucide-react";

/* ─── Metric cards ───────────────────────────────────────────────────────── */
const METRICS = [
  { label: "Total users",        value: "3,842" },
  { label: "Total events",       value: "148"   },
  { label: "Total organizers",   value: "34"    },
  { label: "Pending approvals",  value: "7"     },
];

/* ─── Quick actions ──────────────────────────────────────────────────────── */
interface QuickAction {
  label: string;
  description: string;
  href: string;
  Icon: React.ElementType;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Manage users",
    description: "View, search, and change roles for all platform users.",
    href: "/admin/users",
    Icon: UserCog,
  },
  {
    label: "Platform analytics",
    description: "Explore platform-wide metrics, trends, and top organizers.",
    href: "/admin/analytics",
    Icon: BarChart2,
  },
  {
    label: "Manage events",
    description: "Browse and oversee all events published on the platform.",
    href: "/organizer/events",
    Icon: CalendarDays,
  },
];

/* ─── Recent activity ────────────────────────────────────────────────────── */
interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  Icon: React.ElementType;
  iconColor: string;
}

const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    message: "New organizer approved — Tariq Mahmood",
    timestamp: "2 minutes ago",
    Icon: CheckCircle2,
    iconColor: "text-emerald-400",
  },
  {
    id: "a2",
    message: "Event published: Full-Stack Web Dev Workshop",
    timestamp: "18 minutes ago",
    Icon: PlusCircle,
    iconColor: "text-blue-400",
  },
  {
    id: "a3",
    message: "50 new registrations today across all events",
    timestamp: "1 hour ago",
    Icon: Users,
    iconColor: "text-[var(--color-primary-blue)]",
  },
  {
    id: "a4",
    message: "Pending approval: Codrithm Hackathon 2026 by Bilal Chaudhry",
    timestamp: "3 hours ago",
    Icon: AlertCircle,
    iconColor: "text-amber-400",
  },
  {
    id: "a5",
    message: "New user registered — zainab@example.com",
    timestamp: "5 hours ago",
    Icon: LogIn,
    iconColor: "text-[var(--color-text-secondary)]",
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">
          Admin dashboard
        </h1>

        {/* ── Metric cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
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

        {/* ── Quick actions ─────────────────────────────────────────────────── */}
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {QUICK_ACTIONS.map(({ label, description, href, Icon }) => (
            <Link
              key={label}
              href={href}
              className="
                group bg-[var(--color-surface)] border border-[var(--color-border)]
                rounded-2xl px-6 py-5 flex flex-col gap-3
                hover:border-[var(--color-primary-blue)]/50
                hover:shadow-lg hover:shadow-[rgba(0,102,255,0.08)]
                transition duration-150
              "
            >
              <div className="
                w-10 h-10 rounded-xl flex items-center justify-center
                bg-[var(--color-primary-blue)]/10
                text-[var(--color-primary-blue)]
                group-hover:bg-[var(--color-primary-blue)]/20
                transition duration-150
              ">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">
                  {label}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Recent activity ───────────────────────────────────────────────── */}
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
          Recent activity
        </h2>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
          <ul className="divide-y divide-[var(--color-border)]">
            {RECENT_ACTIVITY.map(({ id, message, timestamp, Icon, iconColor }) => (
              <li
                key={id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-[var(--color-background)] transition-colors duration-100"
              >
                {/* Icon */}
                <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                  <Icon size={18} strokeWidth={1.75} />
                </div>

                {/* Message + timestamp */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-text-primary)]">{message}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 flex items-center gap-1">
                    <Clock size={11} />
                    {timestamp}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  );
}
