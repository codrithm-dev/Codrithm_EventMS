"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type UserRole = "Guest" | "Registered User" | "Organizer" | "Admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joined: string;
}

/* ─── Hardcoded data ─────────────────────────────────────────────────────── */
const USERS: User[] = [
  { id: "u1",  name: "Ayesha Khan",       email: "ayesha@example.com",     role: "Admin",           joined: "Jan 4, 2026"  },
  { id: "u2",  name: "Bilal Chaudhry",    email: "bilal@example.com",      role: "Organizer",       joined: "Jan 18, 2026" },
  { id: "u3",  name: "Sana Mirza",        email: "sana@example.com",       role: "Registered User", joined: "Feb 2, 2026"  },
  { id: "u4",  name: "Usman Tariq",       email: "usman@example.com",      role: "Organizer",       joined: "Feb 14, 2026" },
  { id: "u5",  name: "Rabia Noor",        email: "rabia@example.com",      role: "Registered User", joined: "Mar 3, 2026"  },
  { id: "u6",  name: "Hamza Sheikh",      email: "hamza@example.com",      role: "Guest",            joined: "Mar 20, 2026" },
  { id: "u7",  name: "Fatima Siddiqui",   email: "fatima@example.com",     role: "Registered User", joined: "Apr 5, 2026"  },
  { id: "u8",  name: "Omar Farooq",       email: "omar@example.com",       role: "Guest",            joined: "Apr 22, 2026" },
  { id: "u9",  name: "Zainab Ali",        email: "zainab@example.com",     role: "Registered User", joined: "May 8, 2026"  },
  { id: "u10", name: "Tariq Mahmood",     email: "tariq@example.com",      role: "Organizer",       joined: "May 30, 2026" },
];

/* ─── Role badge ─────────────────────────────────────────────────────────── */
const ROLE_STYLES: Record<UserRole, string> = {
  Admin:           "bg-purple-500/10 text-purple-400",
  Organizer:       "bg-blue-500/10   text-blue-400",
  "Registered User": "bg-emerald-500/10 text-emerald-400",
  Guest:           "bg-neutral-500/10 text-neutral-400",
};

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_STYLES[role]}`}
    >
      {role}
    </span>
  );
}

/* ─── Shared table class constants ───────────────────────────────────────── */
const thCls =
  "text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]";
const tdCls = "px-5 py-4 text-sm text-[var(--color-text-primary)]";

const ROLES: ("All" | UserRole)[] = [
  "All",
  "Guest",
  "Registered User",
  "Organizer",
  "Admin",
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");

  const filtered = USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">
          User management
        </h1>

        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full pl-9 pr-4 py-2.5 rounded-xl text-sm
                bg-[var(--color-surface)] border border-[var(--color-border)]
                text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40
              "
            />
          </div>

          {/* Role dropdown */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as "All" | UserRole)}
              className="
                appearance-none pl-4 pr-9 py-2.5 rounded-xl text-sm
                bg-[var(--color-surface)] border border-[var(--color-border)]
                text-[var(--color-text-primary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40
                cursor-pointer
              "
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r === "All" ? "All roles" : r}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
            />
          </div>
        </div>

        {/* ── Desktop table ────────────────────────────────────────────────── */}
        <div className="hidden sm:block overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <tr>
                <th className={thCls}>Name</th>
                <th className={thCls}>Email</th>
                <th className={thCls}>Role</th>
                <th className={thCls}>Joined</th>
                <th className={thCls + " text-right"}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--color-background)] divide-y divide-[var(--color-border)]">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-[var(--color-text-secondary)]"
                  >
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-[var(--color-surface)] transition-colors duration-100"
                  >
                    <td className={`${tdCls} font-medium`}>{u.name}</td>
                    <td className={`${tdCls} text-[var(--color-text-secondary)]`}>{u.email}</td>
                    <td className={tdCls}>
                      <RoleBadge role={u.role} />
                    </td>
                    <td className={`${tdCls} text-[var(--color-text-secondary)] whitespace-nowrap`}>
                      {u.joined}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ChangeRoleButton />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile stacked cards ─────────────────────────────────────────── */}
        <div className="sm:hidden flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-[var(--color-text-secondary)] py-10">
              No users match your filters.
            </p>
          ) : (
            filtered.map((u) => (
              <div
                key={u.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-4 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                      {u.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{u.email}</p>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">Joined {u.joined}</p>
                <div className="pt-1">
                  <ChangeRoleButton />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}

/* ─── Change role button (static, no logic yet) ──────────────────────────── */
function ChangeRoleButton() {
  return (
    <div className="relative inline-block">
      <select
        defaultValue=""
        className="
          appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-medium
          bg-[var(--color-surface)] border border-[var(--color-border)]
          text-[var(--color-text-primary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]/40
          cursor-pointer
        "
      >
        <option value="" disabled>Change role</option>
        <option value="Guest">Guest</option>
        <option value="Registered User">Registered User</option>
        <option value="Organizer">Organizer</option>
        <option value="Admin">Admin</option>
      </select>
      <ChevronDown
        size={12}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
      />
    </div>
  );
}
