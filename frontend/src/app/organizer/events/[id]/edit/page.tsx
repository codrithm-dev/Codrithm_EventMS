"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { UploadCloud } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { EventDetail, EventUpdate } from "@/types";

const inputCls = `
  w-full px-4 py-2.5 rounded-xl text-sm
  bg-[var(--color-background)]
  border border-[var(--color-border)]
  text-[var(--color-text-primary)]
  placeholder:text-[var(--color-text-secondary)]
  outline-none
  focus:border-[var(--color-primary-blue)]
  focus:ring-2 focus:ring-[rgba(0,102,255,0.2)]
  transition-colors duration-150
`.trim();

const labelCls = "text-sm font-medium text-[var(--color-text-primary)]";
const fieldCls = "flex flex-col gap-1.5";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [eventType, setEventType] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [deadline, setDeadline] = useState("");
  const [approvalMode, setApprovalMode] = useState("auto");

  useEffect(() => {
    (async () => {
      try {
        const event = await api.get<EventDetail>(`/events/${id}`);
        setTitle(event.title);
        setDescription(event.description);
        setCategory(event.category);
        setEventType(event.event_type);
        setVenue(event.venue || "");
        setDate(new Date(event.date_time).toISOString().split("T")[0]);
        setTime(new Date(event.date_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
        setCapacity(String(event.capacity));
        setDeadline(new Date(event.registration_deadline).toISOString().split("T")[0]);
        setApprovalMode(event.approval_mode);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload: EventUpdate = {
        title,
        description,
        category,
        event_type: eventType,
        venue: venue || null,
        date_time: `${date}T${time}:00`,
        capacity: parseInt(capacity, 10),
        registration_deadline: `${deadline}T23:59:00`,
        approval_mode: approvalMode,
      };

      await api.put(`/events/${id}`, payload);
      router.push("/organizer/events");
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.detail);
      else setError("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    try {
      await api.delete(`/events/${id}`);
      router.push("/organizer/events");
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.detail);
      else setError("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="animate-pulse text-[var(--color-text-secondary)]">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">Edit event</h1>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 sm:px-8 py-8">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className={fieldCls}>
              <label className={labelCls} htmlFor="title">Event title</label>
              <input id="title" type="text" className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className={fieldCls}>
              <label className={labelCls} htmlFor="description">Description</label>
              <textarea id="description" rows={5} className={`${inputCls} resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className={fieldCls}>
              <span className={labelCls}>Banner image</span>
              <div className="w-full h-36 rounded-xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-2 text-[var(--color-text-secondary)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)] transition-colors duration-150 cursor-pointer">
                <UploadCloud size={28} strokeWidth={1.5} />
                <span className="text-sm font-medium">Click to replace banner</span>
                <span className="text-xs">Current banner will be replaced</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="category">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls} cursor-pointer`}>
                  <option>Workshop</option><option>Meetup</option><option>Conference</option>
                  <option>Hackathon</option><option>Career</option><option>Networking</option><option>Competition</option>
                </select>
              </div>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="event-type">Event type</label>
                <select id="event-type" value={eventType} onChange={(e) => setEventType(e.target.value)} className={`${inputCls} cursor-pointer`}>
                  <option value="in-person">In-person</option>
                  <option value="online">Virtual</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className={fieldCls}>
              <label className={labelCls} htmlFor="venue">Venue</label>
              <input id="venue" type="text" className={inputCls} value={venue} onChange={(e) => setVenue(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="event-date">Date</label>
                <input id="event-date" type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="event-time">Time</label>
                <input id="event-time" type="time" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="capacity">Capacity</label>
                <input id="capacity" type="number" min={1} className={inputCls} value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
              </div>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="deadline">Registration deadline</label>
                <input id="deadline" type="date" className={inputCls} value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
              </div>
            </div>

            <div className={fieldCls}>
              <span className={labelCls}>Approval mode</span>
              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                {[
                  { id: "auto", value: "auto", label: "Auto approval", desc: "Registrations are approved instantly" },
                  { id: "manual", value: "manual", label: "Manual approval", desc: "You review and approve each registration" },
                ].map(({ id, value, label, desc }) => (
                  <label key={id} htmlFor={id}
                    className="flex-1 flex items-start gap-3 p-4 rounded-xl cursor-pointer border border-[var(--color-border)] hover:border-[var(--color-primary-blue)] transition-colors duration-150"
                  >
                    <input id={id} type="radio" name="approval" value={value} checked={approvalMode === value} onChange={() => setApprovalMode(value)} className="mt-0.5 accent-[#0066ff]" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[var(--color-border)]">
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.2)] cursor-pointer disabled:opacity-50"
              >{saving ? "Saving..." : "Save changes"}</button>
              <button type="button" onClick={() => router.push("/organizer/events")}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)] bg-transparent transition duration-150 cursor-pointer"
              >Cancel</button>
              <button type="button" onClick={handleDelete}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold text-red-400 border border-red-400/30 hover:border-red-400 hover:bg-red-400/5 bg-transparent transition duration-150 cursor-pointer"
              >Delete event</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
