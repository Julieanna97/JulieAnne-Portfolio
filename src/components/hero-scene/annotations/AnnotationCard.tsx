"use client";

import { motion } from "framer-motion";
import type { PortfolioSection, ProjectId } from "../types";
import AnnotationContent from "./AnnotationContent";

export default function AnnotationCard({
  section,
  mobile = false,
  onClose,
  onProjectSelect,
  onOpenSectionDetail,
}: {
  section: PortfolioSection;
  mobile?: boolean;
  onClose: () => void;
  onProjectSelect: (id: ProjectId) => void;
  onOpenSectionDetail: (id: "about" | "credits") => void;
}) {
  return (
    <motion.section
      className={`adventure-annotation-card ${mobile ? "adventure-annotation-card--mobile" : ""}`}
      role={mobile ? "dialog" : undefined}
      aria-modal={mobile ? true : undefined}
      aria-label={mobile ? section.title : undefined}
      initial={{ opacity: 0, x: -22, y: 12, scale: 0.92, rotateY: -8 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, x: -16, y: 8, scale: 0.94, filter: "blur(5px)" }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "left center" }}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="adventure-annotation-close"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label={`Close ${section.title}`}
      >
        ×
      </button>

      <motion.p
        className="adventure-annotation-card-number"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        {section.number}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.42 }}
      >
        {section.title}
      </motion.h2>

      <motion.p
        className="adventure-annotation-card-eyebrow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {section.eyebrow}
      </motion.p>

      <motion.div
        className={`adventure-annotation-card-copy is-${section.id}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.45 }}
      >
        <AnnotationContent
          id={section.id}
          onProjectSelect={onProjectSelect}
          onOpenSectionDetail={onOpenSectionDetail}
        />
      </motion.div>
    </motion.section>
  );
}
