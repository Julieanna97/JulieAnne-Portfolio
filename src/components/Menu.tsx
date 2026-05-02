"use client";

import Link from "next/link";
import { Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["01", "Home", "/"],
  ["02", "About Me", "/about"],
  ["03", "Projects", "/projects"],
  ["04", "Skills", "/skills"],
  ["05", "Journey", "/journey"],
  ["06", "Journal", "/journal"],
  ["07", "Contact", "/contact"]
];

export function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed right-7 top-7 z-50 grid h-13 w-13 place-items-center rounded-full bg-black/90 text-paper shadow-soft transition hover:scale-105"
      >
        <MenuIcon size={27} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] bg-black/85 p-6 text-paper backdrop-blur-md">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute right-7 top-7 grid h-12 w-12 place-items-center rounded-full bg-paper text-ink"
          >
            <X />
          </button>

          <nav className="mx-auto mt-20 grid max-w-2xl gap-3 font-hand text-4xl sm:text-6xl">
            {links.map(([num, label, href]) => (
              <Link
                href={href}
                key={href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-5 border-b border-white/15 py-5"
              >
                <span className="font-mono text-sm text-lavender">{num}</span>
                <span className="transition group-hover:translate-x-2 group-hover:text-lavender">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
