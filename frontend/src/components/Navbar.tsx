"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { Menu, X, LayoutDashboard, Calendar, Ticket, User, LogOut, Shield } from "lucide-react";
import { isAuthenticated, getStoredUser, logout } from "@/lib/auth";
import type { User as UserType } from "@/types";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const authed = mounted && isAuthenticated();
  const user: UserType | null = mounted ? getStoredUser() : null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = authed
    ? [
        { label: "Home", href: "/" },
        { label: "Browse Events", href: "/events" },
        { label: "Dashboard", href: "/dashboard" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Browse Events", href: "/events" },
        { label: "Login", href: "/login" },
      ];

  if (authed && (user?.role === "organizer" || user?.role === "admin")) {
    navLinks.push({ label: "Organizer", href: "/organizer/dashboard" });
    navLinks.push({ label: "Create Event", href: "/organizer/events/create" });
  }
  if (authed && user?.role === "admin") {
    navLinks.push({ label: "Admin", href: "/admin/dashboard" });
  }

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        bg-[var(--color-surface)]
        border-b border-[var(--color-border)]
        backdrop-blur-sm
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/logo.svg"
              alt="Codrithm Events logo"
              width={32}
              height={32}
              className="shrink-0"
              priority
            />
            <span className="font-bold text-base tracking-tight text-[var(--color-text-primary)]">
              Codrithm <span className="text-[var(--color-primary-blue)]">Events</span>
            </span>
          </Link>

          <nav
            className="
              hidden md:flex
              items-center gap-1
              bg-[var(--color-background)]
              border border-[var(--color-border)]
              rounded-full px-2 py-1
            "
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-150
                  ${pathname === link.href
                    ? "text-[var(--color-primary-blue)] bg-[var(--color-surface)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {authed ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/profile"
                  className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
                >
                  {user?.full_name || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="
                    flex items-center gap-1.5 px-4 py-2 rounded-full
                    text-sm font-medium text-[var(--color-text-secondary)]
                    border border-[var(--color-border)]
                    hover:border-red-400 hover:text-red-500
                    transition-colors duration-150 cursor-pointer
                  "
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/register"
                className="
                  hidden sm:inline-flex items-center
                  px-4 py-2 text-sm font-semibold text-white
                  bg-[var(--color-primary-blue)]
                  hover:opacity-90 rounded-full
                  transition-opacity duration-150
                "
              >
                Sign Up
              </Link>
            )}

            <button
              className="
                md:hidden flex items-center justify-center
                w-9 h-9 rounded-full
                bg-[var(--color-surface)]
                border border-[var(--color-border)]
                text-[var(--color-text-secondary)]
                hover:text-[var(--color-text-primary)]
                transition-colors duration-150 cursor-pointer
              "
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav
            className="md:hidden py-3 pb-5 border-t border-[var(--color-border)] flex flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150
                  ${pathname === link.href
                    ? "text-[var(--color-primary-blue)] bg-[var(--color-surface)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}

            {authed ? (
              <>
                <div className="pt-2 px-3 flex items-center gap-2 text-sm text-[var(--color-text-secondary)] border-t border-[var(--color-border)] mt-1">
                  <User size={14} />
                  {user?.full_name || "User"}
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-[var(--color-surface)] rounded-lg transition-colors duration-150 cursor-pointer"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </>
            ) : (
              <div className="pt-2 px-3">
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 rounded-full transition-opacity duration-150"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
