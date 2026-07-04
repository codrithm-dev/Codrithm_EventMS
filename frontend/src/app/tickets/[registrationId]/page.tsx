import { Calendar, MapPin } from "lucide-react";
import RegistrationStatusBadge from "@/components/RegistrationStatusBadge";

export default function TicketPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div
        className="
          w-full max-w-[420px]
          bg-[var(--color-surface)]
          border border-[var(--color-border)]
          rounded-2xl px-8 py-10
          flex flex-col items-center gap-6
        "
      >
        {/* QR code placeholder */}
        <div
          className="
            w-48 h-48 rounded-xl
            border-2 border-dashed border-[var(--color-border)]
            flex items-center justify-center
            text-sm font-medium text-[var(--color-text-secondary)]
          "
          aria-label="QR code placeholder"
        >
          QR Code
        </div>

        {/* Event info */}
        <div className="w-full flex flex-col gap-2 text-center">
          <h1 className="text-xl font-extrabold text-[var(--color-text-primary)] leading-snug">
            Full-Stack Web Dev Workshop
          </h1>

          <div className="flex flex-col items-center gap-1.5 mt-1">
            <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <Calendar size={14} strokeWidth={2} />
              <span>Saturday, Jul 12, 2026 · 10:00 AM</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <MapPin size={14} strokeWidth={2} />
              <span>Tech Hub, Lahore</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-dashed border-[var(--color-border)]" />

        {/* Ticket ID + status */}
        <div className="w-full flex items-center justify-between">
          <span className="font-mono text-xs text-[var(--color-text-secondary)]">
            #REG-001-2026
          </span>
          <RegistrationStatusBadge status="Approved" />
        </div>

        {/* Add to calendar button */}
        <button
          type="button"
          className="
            w-full py-2.5 rounded-full
            text-sm font-semibold
            text-[var(--color-text-primary)]
            border border-[var(--color-border)]
            hover:border-[var(--color-primary-blue)]
            hover:text-[var(--color-primary-blue)]
            bg-transparent
            transition duration-150
            cursor-pointer
          "
        >
          Add to calendar
        </button>

      </div>
    </main>
  );
}
