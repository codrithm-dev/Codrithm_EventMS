export type RegistrationStatus =
  | "approved"
  | "pending"
  | "rejected"
  | "waitlisted"
  | "cancelled"
  | "Approved"
  | "Pending"
  | "Rejected"
  | "Waitlisted"
  | "Cancelled";

interface Props {
  status: RegistrationStatus;
}

function normalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

const STYLES: Record<string, string> = {
  Approved:   "bg-emerald-500/10 text-emerald-400",
  Pending:    "bg-amber-500/10   text-amber-400",
  Rejected:   "bg-red-500/10     text-red-400",
  Waitlisted: "bg-blue-500/10    text-blue-400",
  Cancelled:  "bg-neutral-500/10 text-neutral-400",
};

export default function RegistrationStatusBadge({ status }: Props) {
  const label = normalize(status);
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        rounded-full text-xs font-semibold
        ${STYLES[label] || "bg-neutral-500/10 text-neutral-400"}
      `}
    >
      {label}
    </span>
  );
}
