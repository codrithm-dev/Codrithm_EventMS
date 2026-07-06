"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Pencil, Trash2, X } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { User } from "@/types";

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-400",
  user: "bg-emerald-500/10 text-emerald-400",
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
const ROLES = ["All", "admin", "user"];
const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface EditModalProps {
  user: User;
  onSave: (id: string, data: { full_name?: string; email?: string; role?: string }) => void;
  onClose: () => void;
  saving: boolean;
}

function EditUserModal({ user, onSave, onClose, saving }: EditModalProps) {
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<string>(user.role);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Edit user</h3>
          <button onClick={onClose} className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Full name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Role</label>
            <div className="relative">
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full appearance-none pl-4 pr-9 py-2.5 rounded-xl text-sm bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40 cursor-pointer">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)] transition-colors duration-150 cursor-pointer">Cancel</button>
          <button onClick={() => onSave(user.id, { full_name: fullName, email, role })} disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 disabled:opacity-50 transition duration-150 cursor-pointer">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(PAGE_SIZE));
        const data = await api.get<{ items: User[]; total: number; page: number; pages: number }>(`/admin/users?${params.toString()}`);
        if (!cancelled) {
          setUsers(data.items);
          setTotal(data.total);
          setPages(data.pages);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiClientError) setError(err.detail);
          else setError("Failed to load users");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole as User["role"] } : u)));
    } catch (err) {
      if (err instanceof ApiClientError) alert(err.detail);
      else alert("Failed to update role");
    }
  };

  const handleEdit = async (userId: string, data: { full_name?: string; email?: string; role?: string }) => {
    setSaving(true);
    try {
      const result = await api.put<{ user: User }>(`/admin/users/${userId}`, data);
      setUsers((prev) => prev.map((u) => (u.id === userId ? result.user : u)));
      setEditingUser(null);
    } catch (err) {
      if (err instanceof ApiClientError) alert(err.detail);
      else alert("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    setDeleting(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setTotal((prev) => prev - 1);
    } catch (err) {
      if (err instanceof ApiClientError) alert(err.detail);
      else alert("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch = !search || u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
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
            <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40" />
          </div>
          <div className="relative">
            <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
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
                      <div className="flex items-center justify-end gap-1">
                        <div className="relative">
                          <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40 cursor-pointer">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                        </div>
                        <button onClick={() => setEditingUser(u)} title="Edit user"
                          className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)]/10 transition-colors duration-150 cursor-pointer">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(u.id)} disabled={deleting === u.id} title="Delete user"
                          className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors duration-150 cursor-pointer disabled:opacity-50">
                          <Trash2 size={14} />
                        </button>
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
                <div className="flex items-center gap-2 pt-1">
                  <div className="relative">
                    <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none cursor-pointer">
                      <option value="user">User</option><option value="admin">Admin</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                  </div>
                  <button onClick={() => setEditingUser(u)} className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-blue)] cursor-pointer">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(u.id)} disabled={deleting === u.id} className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-red-500 cursor-pointer disabled:opacity-50">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--color-primary-blue)] hover:text-[var(--color-text-primary)] transition-colors duration-150 cursor-pointer"
            >Prev</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} type="button" onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold border transition-colors duration-150 cursor-pointer ${p === page ? "bg-[var(--color-primary-blue)] border-[var(--color-primary-blue)] text-white" : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-text-primary)]"}`}
              >{p}</button>
            ))}
            <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--color-primary-blue)] hover:text-[var(--color-text-primary)] transition-colors duration-150 cursor-pointer"
            >Next</button>
          </div>
        )}

        <p className="text-xs text-[var(--color-text-secondary)] text-center mt-4">
          Showing {filtered.length} of {total} users
        </p>
      </div>

      {editingUser && (
        <EditUserModal user={editingUser} onSave={handleEdit} onClose={() => setEditingUser(null)} saving={saving} />
      )}
    </main>
  );
}
