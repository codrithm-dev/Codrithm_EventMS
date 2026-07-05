"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RegistrationStatusBadge, { type RegistrationStatus } from "@/components/RegistrationStatusBadge";
import { api, ApiClientError } from "@/lib/api";
import type { RegistrationResponse, PaginatedRegistrations } from "@/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<PaginatedRegistrations>("/registrations/mine");
        setRegistrations(data.items);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this registration?")) return;
    setCancelling(id);
    try {
      await api.put(`/registrations/${id}/cancel`);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "cancelled" as const } : r))
      );
    } catch (err) {
      if (err instanceof ApiClientError) alert(err.detail);
      else alert("Failed to cancel registration");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-48 bg-[var(--color-surface)] rounded animate-pulse mb-8" />
          <div className="h-64 bg-[var(--color-surface)] rounded-2xl animate-pulse" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <p className="text-red-500">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-[var(--color-primary-blue)] hover:underline text-sm">Try again</button>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">My registrations</h1>

        {registrations.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
            <p className="text-[var(--color-text-secondary)] text-lg">No registrations yet</p>
            <Link href="/events" className="mt-2 inline-block text-sm font-semibold text-[var(--color-primary-blue)] hover:underline">Browse events →</Link>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-hidden rounded-2xl border border-[var(--color-border)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">Registered As</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">Date</th>
                    <th className="text-left px-5 py-3 font-semibold text-[var(--color-text-secondary)]">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="bg-[var(--color-background)] divide-y divide-[var(--color-border)]">
                  {registrations.map((r) => (
                    <tr key={r.id} className="hover:bg-[var(--color-surface)] transition-colors duration-100">
                      <td className="px-5 py-4 font-medium text-[var(--color-text-primary)]">{r.full_name}</td>
                      <td className="px-5 py-4 text-[var(--color-text-secondary)] whitespace-nowrap">{formatDate(r.registered_at)}</td>
                      <td className="px-5 py-4"><RegistrationStatusBadge status={r.status as RegistrationStatus} /></td>
                      <td className="px-5 py-4 text-right flex gap-2 justify-end">
                        {r.status === "approved" && (
                          <Link href={`/tickets/${r.id}`} className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline whitespace-nowrap">
                            View ticket →
                          </Link>
                        )}
                        {(r.status === "pending" || r.status === "approved") && (
                          <button onClick={() => handleCancel(r.id)} disabled={cancelling === r.id}
                            className="text-xs font-semibold text-red-500 hover:underline whitespace-nowrap disabled:opacity-50 cursor-pointer"
                          >
                            {cancelling === r.id ? "Cancelling..." : "Cancel"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden flex flex-col gap-3">
              {registrations.map((r) => (
                <div key={r.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-4 flex flex-col gap-2">
                  <p className="font-semibold text-[var(--color-text-primary)] text-sm">{r.full_name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{formatDate(r.registered_at)}</p>
                  <div className="flex items-center justify-between pt-1">
                    <RegistrationStatusBadge status={r.status as RegistrationStatus} />
                    <div className="flex gap-2">
                      {r.status === "approved" && (
                        <Link href={`/tickets/${r.id}`} className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline">View ticket →</Link>
                      )}
                      {(r.status === "pending" || r.status === "approved") && (
                        <button onClick={() => handleCancel(r.id)} disabled={cancelling === r.id}
                          className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-50 cursor-pointer"
                        >{cancelling === r.id ? "..." : "Cancel"}</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
