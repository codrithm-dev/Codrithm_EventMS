"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  // Default to dark mode on first load
  const [isDark, setIsDark] = useState(true);

  // Apply the stored / default theme before first paint
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      stored === "dark" ||
      (!stored && true); // default to dark

    if (prefersDark) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);

    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        flex items-center justify-center
        w-9 h-9 rounded-full
        bg-[var(--color-surface)]
        border border-[var(--color-border)]
        text-[var(--color-text-secondary)]
        hover:text-[var(--color-text-primary)]
        hover:border-[var(--color-primary-blue)]
        transition-colors duration-200
        cursor-pointer
      "
    >
      {isDark ? (
        <Sun size={16} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Moon size={16} strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  );
}
