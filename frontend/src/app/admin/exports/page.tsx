"use client";

import { useState, useEffect } from "react";
import { Download, ChevronDown, Check } from "lucide-react";
import { api } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface EventOption {
  id: string;
  title: string;
  slug: string;
}

const ALL_FIELDS = [
  { key: "full_name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "ticket_id", label: "Ticket ID" },
  { key: "registered_at", label: "Registered At" },
  { key: "university", label: "University" },
  { key: "company", label: "Company" },
  { key: "job_title", label: "Job Title" },
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "github_url", label: "GitHub" },
  { key: "portfolio_url", label: "Portfolio" },
];

export default function AdminExportsPage() {
  const [events, setEvents] = useState<EventOption[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set(ALL_FIELDS.map((f) => f.key)));
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<EventOption[]>("/admin/dashboard/organizer/events");
        setEvents(data);
        if (data.length > 0) setSelectedEvent(data[0].id);
      } catch (e) {
        console.error("Failed to load events", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleField = (key: string) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const selectAll = () => setSelectedFields(new Set(ALL_FIELDS.map((f) => f.key)));
  const selectNone = () => setSelectedFields(new Set());

  const handleExport = async () => {
    if (!selectedEvent || selectedFields.size === 0) return;
    setExporting(true);

    try {
      const fields = Array.from(selectedFields).join(",");
      const url = `${BASE_URL}/admin/dashboard/export/${selectedEvent}?fields=${encodeURIComponent(fields)}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `registrations_${selectedEvent}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch {
      alert("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">Export registrations</h1>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 sm:px-8 py-8">
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">Select event</label>
              {loading ? (
                <div className="h-11 bg-[var(--color-background)] rounded-xl animate-pulse" />
              ) : events.length === 0 ? (
                <p className="text-sm text-[var(--color-text-secondary)]">No events available</p>
              ) : (
                <div className="relative">
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full appearance-none pl-4 pr-9 py-2.5 rounded-xl text-sm bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40 cursor-pointer"
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-[var(--color-text-primary)]">Fields to export</label>
                <div className="flex gap-3">
                  <button type="button" onClick={selectAll} className="text-xs font-medium text-[var(--color-primary-blue)] hover:underline cursor-pointer">Select all</button>
                  <button type="button" onClick={selectNone} className="text-xs font-medium text-[var(--color-text-secondary)] hover:underline cursor-pointer">Clear</button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_FIELDS.map((field) => (
                  <button
                    key={field.key}
                    type="button"
                    onClick={() => toggleField(field.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-colors duration-150 cursor-pointer ${
                      selectedFields.has(field.key)
                        ? "bg-[var(--color-primary-blue)]/10 border-[var(--color-primary-blue)]/40 text-[var(--color-primary-blue)]"
                        : "bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-blue)]/30"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      selectedFields.has(field.key)
                        ? "bg-[var(--color-primary-blue)] border-[var(--color-primary-blue)]"
                        : "border-[var(--color-border)]"
                    }`}>
                      {selectedFields.has(field.key) && <Check size={10} className="text-white" />}
                    </div>
                    {field.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">{selectedFields.size} of {ALL_FIELDS.length} fields selected</p>
            </div>

            <button
              type="button"
              onClick={handleExport}
              disabled={!selectedEvent || selectedFields.size === 0 || exporting}
              className="w-full py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.2)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download size={16} />
              {exporting ? "Exporting..." : "Download CSV"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
