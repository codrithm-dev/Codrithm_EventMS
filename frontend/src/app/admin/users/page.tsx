"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { User } from "@/types";

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-400",
  organizer: "bg-blue-500/10 text-blue-400",
  user: "bg-emerald-500/10 text-emerald-400",
  guest: "bg-neutral-500/10 text-neutral-400",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_STYLES[role] || ROLE_STYLES.user}`}>
      {role}
    </span>
  );
}

const thCls = "text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]";
const tdCls = "px-5 py-4 text-sm text-[var(--color-text-primary)]";
const ROLES = ["All", "admin", "organizer", "user", "guest"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [changing, setChanging] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<{ items: User[]; total: number }>("/admin/users");
        setUsers(data.items);
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.detail);
        else setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setChanging(userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole as User["role"] } : u)));
    } catch (err) {
      if (err instanceof ApiClientError) alert(err.detail);
      else alert("Failed to update role");
    } finally {
      setChanging(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <main className="flex-1 flex flex-col">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-48 bg-[var(--color-surface)] rounded animate-pulse mb-8" />
          <div className="h-64 bg-[var(--color-surface)] rounded-2xl animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">User management</h1>

        {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2 mb-6">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
            <input type="text" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40" />
          </div>
          <div className="relative">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40 cursor-pointer">
              {ROLES.map((r) => (<option key={r} value={r}>{r === "All" ? "All roles" : r}</option>))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
          </div>
        </div>

        <div className="hidden sm:block overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <tr>
                <th className={thCls}>Name</th>
                <th className={thCls}>Email</th>
                <th className={thCls}>Role</th>
                <th className={thCls}>Joined</th>
                <th className={`${thCls} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--color-background)] divide-y divide-[var(--color-border)]">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[var(--color-text-secondary)]">No users match your filters.</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--color-surface)] transition-colors duration-100">
                    <td className={`${tdCls} font-medium`}>{u.full_name}</td>
                    <td className={`${tdCls} text-[var(--color-text-secondary)]`}>{u.email}</td>
                    <td className={tdCls}><RoleBadge role={u.role} /></td>
                    <td className={`${tdCls} text-[var(--color-text-secondary)] whitespace-nowrap`}>{formatDate(u.created_at)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block">
                        <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} disabled={changing === u.id}
                          className="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40 cursor-pointer disabled:opacity-50">
                          <option value="guest">Guest</option>
                          <option value="user">User</option>
                          <option value="organizer">Organizer</option>
                          <option value="admin">Admin</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-[var(--color-text-secondary)] py-10">No users match your filters.</p>
          ) : (
            filtered.map((u) => (
              <div key={u.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-[var(--color-text-primary)]">{u.full_name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{u.email}</p>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">Joined {formatDate(u.created_at)}</p>
                <div className="pt-1">
                  <div className="relative inline-block">
                    <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} disabled={changing === u.id}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none cursor-pointer disabled:opacity-50">
                      <option value="guest">Guest</option><option value="user">User</option>
                      <option value="organizer">Organizer</option><option value="admin">Admin</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
