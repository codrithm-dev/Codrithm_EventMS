"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { Calendar, MapPin } from "lucide-react";
import RegistrationStatusBadge, { type RegistrationStatus } from "@/components/RegistrationStatusBadge";
import { api, ApiClientError } from "@/lib/api";
import type { TicketResponse } from "@/types";

interface Props {
  params: Promise<{ registrationId: string }>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function TicketPage({ params }: Props) {
  const { registrationId } = use(params);
  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<TicketResponse>(`/tickets/${registrationId}`);
        setTicket(data);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    })();
  }, [registrationId]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-8 py-10 flex flex-col items-center gap-6">
          <div className="w-48 h-48 rounded-xl bg-[var(--color-border)] animate-pulse" />
        </div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <p className="text-red-500">{error || "Ticket not found"}</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-8 py-10 flex flex-col items-center gap-6">
        {ticket.qr_code_url ? (
          <img src={ticket.qr_code_url} alt="Event QR Code" className="w-48 h-48 rounded-xl" />
        ) : (
          <div className="w-48 h-48 rounded-xl border-2 border-dashed border-[var(--color-border)] flex items-center justify-center text-sm font-medium text-[var(--color-text-secondary)]">
            QR Code
          </div>
        )}

        <div className="w-full flex flex-col gap-2 text-center">
          <h1 className="text-xl font-extrabold text-[var(--color-text-primary)] leading-snug">
            {ticket.event_title}
          </h1>
          <div className="flex flex-col items-center gap-1.5 mt-1">
            <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <Calendar size={14} strokeWidth={2} />
              <span>{formatDate(ticket.event_date)} · {formatTime(ticket.event_date)}</span>
            </div>
            {ticket.event_venue && (
              <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                <MapPin size={14} strokeWidth={2} />
                <span>{ticket.event_venue}</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full border-t border-dashed border-[var(--color-border)]" />

        <div className="w-full flex items-center justify-between">
          <span className="text-xs text-[var(--color-text-secondary)]">{ticket.attendee_name}</span>
          <RegistrationStatusBadge status={ticket.status as RegistrationStatus} />
        </div>

        <button
          type="button"
          onClick={() => {
            const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${ticket.event_title}\nDTSTART:${new Date(ticket.event_date).toISOString().replace(/[-:]/g, "").split(".")[0]}Z\nEND:VEVENT\nEND:VCALENDAR`;
            const blob = new Blob([ics], { type: "text/calendar" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${ticket.event_title.replace(/\s+/g, "_")}.ics`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="w-full py-2.5 rounded-full text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)] bg-transparent transition duration-150 cursor-pointer"
        >
          Add to calendar
        </button>
      </div>
    </main>
  );
}
