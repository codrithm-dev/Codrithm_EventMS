"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { PaginatedNotifications, NotificationResponse } from "@/types";

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const typeIcons: Record<string, string> = {
  registration_submitted: "📋",
  registration_approved: "✅",
  registration_rejected: "❌",
  event_reminder: "⏰",
  event_update: "📝",
  event_cancellation: "🚫",
  thank_you: "🙏",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<PaginatedNotifications>("/notifications?limit=50");
        setNotifications(data.items);
        setUnreadCount(data.unread_count);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {}
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col">
        <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-48 bg-[var(--color-surface)] rounded animate-pulse mb-8" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-[var(--color-surface)] rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-[var(--color-primary-blue)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)] bg-transparent transition duration-150 cursor-pointer"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
            <Bell size={40} className="mx-auto mb-4 text-[var(--color-text-secondary)]" strokeWidth={1.5} />
            <p className="text-[var(--color-text-secondary)] text-lg">No notifications yet</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              You&apos;ll see updates about your registrations here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markRead(n.id)}
                className={`
                  flex items-start gap-4 px-5 py-4 rounded-2xl border transition-colors duration-150 cursor-pointer
                  ${n.is_read
                    ? "bg-[var(--color-surface)] border-[var(--color-border)]"
                    : "bg-[var(--color-primary-blue)]/5 border-[var(--color-primary-blue)]/20 hover:border-[var(--color-primary-blue)]/40"
                  }
                `}
              >
                <span className="text-xl mt-0.5 shrink-0">{typeIcons[n.type] || "🔔"}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${n.is_read ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-primary)]"}`}>
                    {n.title}
                  </p>
                  <div
                    className="text-sm text-[var(--color-text-secondary)] mt-0.5 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: n.message }}
                  />
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && (
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary-blue)] mt-2 shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
