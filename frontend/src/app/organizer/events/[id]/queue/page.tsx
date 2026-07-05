"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { api, ApiClientError } from "@/lib/api";
import type { PaginatedRegistrations, RegistrationResponse } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ApprovalQueuePage({ params }: Props) {
  const { id } = use(params);
  const [applicants, setApplicants] = useState<RegistrationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<PaginatedRegistrations>(`/registrations/events/${id}/queue`);
        setApplicants(data.items);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load queue");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAction = async (registrationId: string, action: "approve" | "reject") => {
    setProcessing(registrationId);
    try {
      await api.patch(`/registrations/${registrationId}/${action}`);
      setApplicants((prev) => prev.filter((a) => a.id !== registrationId));
    } catch (err) {
      if (err instanceof ApiClientError) alert(err.detail);
      else alert("Action failed");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col">
        <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-8 w-48 bg-[var(--color-surface)] rounded animate-pulse mb-8" />
          <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-32 bg-[var(--color-surface)] rounded-2xl animate-pulse" />)}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-10">
        <Link href={`/organizer/events/${id}/registrations`} className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6">← Back to registrations</Link>

        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1">Approval queue</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">{applicants.length} registrations awaiting review</p>

        {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2 mb-4">{error}</p>}

        {applicants.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
            <p className="text-[var(--color-text-secondary)] text-lg">All caught up!</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">No pending registrations.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {applicants.map((a) => (
              <div key={a.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="font-semibold text-[var(--color-text-primary)]">{a.full_name}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{a.email} · Registered {formatDate(a.registered_at)}</p>
                    {a.dynamic_responses && typeof a.dynamic_responses === "object" && Object.keys(a.dynamic_responses).length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Additional info</p>
                        <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{JSON.stringify(a.dynamic_responses)}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex sm:flex-col gap-3 shrink-0">
                    <button type="button" onClick={() => handleAction(a.id, "approve")} disabled={processing === a.id}
                      className="px-5 py-2 rounded-full text-sm font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition duration-150 cursor-pointer whitespace-nowrap disabled:opacity-50"
                    >{processing === a.id ? "..." : "Approve"}</button>
                    <button type="button" onClick={() => handleAction(a.id, "reject")} disabled={processing === a.id}
                      className="px-5 py-2 rounded-full text-sm font-semibold text-red-400 border border-red-400/30 hover:border-red-400 hover:bg-red-400/5 bg-transparent transition duration-150 cursor-pointer whitespace-nowrap disabled:opacity-50"
                    >{processing === a.id ? "..." : "Reject"}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
