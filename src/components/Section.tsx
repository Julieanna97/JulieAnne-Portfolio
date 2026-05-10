"use client";

import { motion } from "framer-motion";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  children,
  className = ""
}: SectionProps) {
  return (
    <motion.section
      id={id}
      className={`mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10 ${className}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-110px" }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    >
      {(eyebrow || title) && (
        <div className="mb-7">
          {eyebrow && (
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-cocoa/40">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-3xl font-black tracking-tight text-cocoa sm:text-4xl">
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </motion.section>
  );
}