"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { Search, Download } from "lucide-react";
import RegistrationStatusBadge, { type RegistrationStatus } from "@/components/RegistrationStatusBadge";
import { api, ApiClientError } from "@/lib/api";
import type { PaginatedRegistrations, RegistrationResponse } from "@/types";

const inputCls = "px-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-primary-blue)] focus:ring-2 focus:ring-[rgba(0,102,255,0.2)] transition-colors duration-150";
const thCls = "text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]";
const tdCls = "px-5 py-4 text-sm";

interface Props {
  params: Promise<{ id: string }>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RegistrationsPage({ params }: Props) {
  const { id } = use(params);
  const [registrations, setRegistrations] = useState<RegistrationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (search) params.set("search", search);
        const data = await api.get<PaginatedRegistrations>(`/registrations/events/${id}?${params.toString()}`);
        setRegistrations(data.items);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, search, statusFilter]);

  const handleExport = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/dashboard/export/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `registrations-${id}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export registrations");
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-64 bg-[var(--color-surface)] rounded-2xl animate-pulse" />
        </div>
      </main>
    );
  }

  const filtered = registrations.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search && !r.full_name.toLowerCase().includes(search.toLowerCase()) && !r.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/organizer/events" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6">← Back to my events</Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">Registrations</h1>
          <button type="button" onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)] bg-transparent transition duration-150 cursor-pointer"
          ><Download size={14} /> Export CSV</button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
            <input type="search" placeholder="Search by name or email…" className={`${inputCls} w-full pl-10`} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputCls} sm:w-48 cursor-pointer`}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
            <p className="text-[var(--color-text-secondary)]">No registrations found</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-hidden rounded-2xl border border-[var(--color-border)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className={thCls}>Name</th>
                    <th className={thCls}>Email</th>
                    <th className={thCls}>Registered</th>
                    <th className={thCls}>Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="bg-[var(--color-background)] divide-y divide-[var(--color-border)]">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-[var(--color-surface)] transition-colors duration-100">
                      <td className={`${tdCls} font-medium text-[var(--color-text-primary)]`}>{r.full_name}</td>
                      <td className={`${tdCls} text-[var(--color-text-secondary)]`}>{r.email}</td>
                      <td className={`${tdCls} text-[var(--color-text-secondary)] whitespace-nowrap`}>{formatDate(r.registered_at)}</td>
                      <td className={tdCls}><RegistrationStatusBadge status={r.status as RegistrationStatus} /></td>
                      <td className="px-5 py-4 text-right">
                        {r.status === "pending" && (
                          <Link href={`/organizer/events/${id}/queue`} className="text-xs font-semibold text-[var(--color-primary-blue)] hover:underline">Review →</Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden flex flex-col gap-3">
              {filtered.map((r) => (
                <div key={r.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-[var(--color-text-primary)]">{r.full_name}</p>
                    <RegistrationStatusBadge status={r.status as RegistrationStatus} />
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">{r.email} · {formatDate(r.registered_at)}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
