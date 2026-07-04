import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, MessageCircle } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Login", href: "/login" },
];

const SOCIAL_LINKS = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: MessageCircle, label: "Discord", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-surface)] border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Top row — three columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Left: brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image
                src="/logo.svg"
                alt="Codrithm Events logo"
                width={24}
                height={24}
                className="shrink-0"
              />
              <span className="font-bold text-sm text-[var(--color-text-primary)]">
                Codrithm <span className="text-[var(--color-primary-blue)]">Events</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
              Discover and register for Codrithm&apos;s community events.
            </p>
          </div>

          {/* Middle: quick links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Quick links
            </h3>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: connect */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Connect
            </h3>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="
                    flex items-center justify-center
                    w-9 h-9 rounded-full
                    bg-[var(--color-background)]
                    border border-[var(--color-border)]
                    text-[var(--color-text-secondary)]
                    hover:text-[var(--color-text-primary)]
                    hover:border-[var(--color-primary-blue)]
                    transition-colors duration-150
                  "
                >
                  <Icon size={16} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-[var(--color-border)]">
          <p className="text-center text-xs text-[var(--color-text-secondary)]">
            © 2026 Codrithm. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

