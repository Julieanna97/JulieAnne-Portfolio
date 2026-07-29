"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import styles from "./portfolioPages.module.css";

const HeroScene = dynamic(() => import("@/components/hero-scene/HeroScene"), {
  ssr: false,
  loading: () => <div style={{ height: "100%", background: "#000" }} />,
});

const links = [
  { href: "/", label: "Town" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/credits", label: "Credits" },
];

export default function PortfolioPageShell({
  index,
  eyebrow,
  title,
  intro,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          Julie Anne<span>.</span>
        </Link>
        <nav className={styles.nav} aria-label="Portfolio pages">
          {links.map((link) => {
            const active = link.href === "/projects"
              ? pathname.startsWith("/projects")
              : pathname === link.href;
            return (
              <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <motion.section
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        <motion.div
          className={styles.heroInner}
          initial={{ opacity: 0, y: 34, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.index}>{index} · {eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{intro}</p>
          <span className={styles.scrollCue}>Scroll to explore ↓</span>
        </motion.div>
      </motion.section>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 45 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      <section className={styles.townReveal} aria-label="Return to the interactive town">
        <div className={styles.townRevealLabel}>You reached the town again · choose another spot</div>
        <HeroScene />
      </section>
    </main>
  );
}
