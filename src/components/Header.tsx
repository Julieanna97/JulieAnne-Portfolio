"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MoonStar, SunMedium, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Journal", "#journal"],
  ["Contact", "#contact"],
] as const;

export function Header({ onToggleTheme, ambientMode }: { onToggleTheme: () => void; ambientMode: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-full border px-4 py-3 shadow-[0_12px_40px_rgba(128,97,161,0.12)] backdrop-blur-xl" style={{ borderColor: "var(--page-border)", background: "var(--page-surface)" }}>
        <div className="flex items-center justify-between gap-3">
          <Link href="#home" className="font-display text-3xl transition" style={{ color: "var(--page-text)" }}>
            Julie ✦
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} className="text-sm font-medium transition" style={{ color: "var(--page-text-soft)" }}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--page-border)", background: "var(--page-surface-strong)", color: "var(--page-text-soft)" }}
              aria-label={ambientMode ? "Switch to daylight theme" : "Switch to twilight theme"}
            >
              {ambientMode ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
            </button>

            <Link
              href="#contact"
              className="hidden rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(141,103,207,0.28)] transition hover:-translate-y-0.5 sm:inline-flex"
              style={{ background: "var(--page-accent)" }}
            >
              Let’s Connect
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition hover:-translate-y-0.5 lg:hidden"
              style={{ borderColor: "var(--page-border)", background: "var(--page-surface-strong)", color: "var(--page-text-soft)" }}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-2 rounded-[1.5rem] border p-4 shadow-soft lg:hidden"
              style={{ borderColor: "var(--page-border)", background: "var(--page-surface-strong)" }}
            >
              {navItems.map(([label, href]) => (
                <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="block rounded-full px-4 py-3 text-sm font-medium transition" style={{ color: "var(--page-text-soft)" }}>
                  {label}
                </Link>
              ))}
              <Link href="#contact" onClick={() => setMenuOpen(false)} className="mt-2 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(141,103,207,0.28)]" style={{ background: "var(--page-accent)" }}>
                Let’s Connect
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}