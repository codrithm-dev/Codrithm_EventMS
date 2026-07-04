export type EventStatus = "Draft" | "Published" | "Archived";

const STYLES: Record<EventStatus, string> = {
  Published: "bg-emerald-500/10 text-emerald-400",
  Draft:     "bg-amber-500/10   text-amber-400",
  Archived:  "bg-neutral-500/10 text-neutral-400",
};

export default function EventStatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STYLES[status]}`}>
      {status}
    </span>
  );
}
