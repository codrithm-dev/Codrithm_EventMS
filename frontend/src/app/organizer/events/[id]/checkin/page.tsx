"use client";

import { useState } from "react";
import { use } from "react";
import { ScanLine, CheckCircle } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { CheckinResponse } from "@/types";

const inputCls = "flex-1 px-4 py-2.5 rounded-xl text-sm bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-primary-blue)] focus:ring-2 focus:ring-[rgba(0,102,255,0.2)] transition-colors duration-150";

interface RecentCheckin {
  name: string;
  time: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function CheckInPage({ params }: Props) {
  const { id } = use(params);
  const [ticketId, setTicketId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<RecentCheckin[]>([]);

  const handleCheckin = async () => {
    if (!ticketId.trim()) return;
    setError("");
    setLoading(true);

    try {
      const result = await api.post<CheckinResponse>("/tickets/checkin", { ticket_id: ticketId });
      if (result.success) {
        setRecent((prev) => [{ name: result.attendee_name || "Attendee", time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) }, ...prev].slice(0, 10));
        setTicketId("");
      } else {
        setError(result.message);
      }
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.detail);
      else setError("Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-10">Check-in</h1>

        <div className="w-full aspect-square max-w-xs mx-auto mb-8 rounded-2xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-4 text-[var(--color-text-secondary)]">
          <ScanLine size={48} strokeWidth={1.5} />
          <p className="text-sm font-medium text-center px-4">Point camera at ticket QR code</p>
        </div>

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">Manual entry</p>
          <div className="flex gap-3">
            <input type="text" placeholder="Enter ticket ID (e.g. REG-001-2026)" className={inputCls} value={ticketId} onChange={(e) => setTicketId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCheckin()} />
            <button type="button" onClick={handleCheckin} disabled={loading || !ticketId.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 transition duration-150 cursor-pointer whitespace-nowrap disabled:opacity-50"
            >{loading ? "..." : "Check in"}</button>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        {recent.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">Recently checked in</p>
            <div className="flex flex-col gap-2">
              {recent.map(({ name, time }, i) => (
                <div key={`${name}-${i}`} className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-emerald-400 shrink-0" strokeWidth={2} />
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{name}</span>
                  </div>
                  <span className="text-xs text-[var(--color-text-secondary)]">{time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
