"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Events", href: "/events" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Login", href: "/login" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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

          {/* ── Left: Logo + Wordmark ─────────────────────────────── */}
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

          {/* ── Center: Pill nav (desktop) ────────────────────────── */}
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  px-4 py-1.5
                  text-sm font-medium
                  text-[var(--color-text-secondary)]
                  hover:text-[var(--color-text-primary)]
                  hover:bg-[var(--color-surface)]
                  rounded-full
                  transition-colors duration-150
                "
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right: Theme toggle + Sign Up ────────────────────── */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/register"
              className="
                hidden sm:inline-flex items-center
                px-4 py-2
                text-sm font-semibold text-white
                bg-[var(--color-primary-blue)]
                hover:opacity-90
                rounded-full
                transition-opacity duration-150
              "
            >
              Sign Up
            </Link>

            {/* Mobile hamburger */}
            <button
              className="
                md:hidden
                flex items-center justify-center
                w-9 h-9 rounded-full
                bg-[var(--color-surface)]
                border border-[var(--color-border)]
                text-[var(--color-text-secondary)]
                hover:text-[var(--color-text-primary)]
                transition-colors duration-150
                cursor-pointer
              "
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile nav drawer ──────────────────────────────────── */}
        {mobileOpen && (
          <nav
            className="
              md:hidden
              py-3 pb-5
              border-t border-[var(--color-border)]
              flex flex-col gap-1
            "
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="
                  px-3 py-2.5
                  text-sm font-medium
                  text-[var(--color-text-secondary)]
                  hover:text-[var(--color-text-primary)]
                  hover:bg-[var(--color-surface)]
                  rounded-lg
                  transition-colors duration-150
                "
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 px-3">
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="
                  flex items-center justify-center w-full
                  px-4 py-2.5
                  text-sm font-semibold text-white
                  bg-[var(--color-primary-blue)]
                  hover:opacity-90
                  rounded-full
                  transition-opacity duration-150
                "
              >
                Sign Up
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}


