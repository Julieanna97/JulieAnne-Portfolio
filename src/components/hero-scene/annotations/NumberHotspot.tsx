"use client";

import { Html } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import type { PortfolioSection, ProjectId } from "../types";
import AnnotationCard from "./AnnotationCard";

export default function NumberHotspot({
  section,
  disabled,
  selected,
  showCard,
  onSelect,
  onClose,
  onProjectSelect,
  onOpenSectionDetail,
}: {
  section: PortfolioSection;
  disabled: boolean;
  selected: boolean;
  showCard: boolean;
  onSelect: (section: PortfolioSection) => void;
  onClose: () => void;
  onProjectSelect: (id: ProjectId) => void;
  onOpenSectionDetail: (id: "about" | "credits") => void;
}) {
  return (
    <Html position={section.hotspot} center zIndexRange={[40, 0]} style={{ pointerEvents: "auto" }}>
      <div className={`adventure-annotation-wrap ${selected ? "is-open" : ""}`}>
        <motion.button
          type="button"
          className={`adventure-number ${selected ? "is-selected" : ""}`}
          disabled={disabled}
          whileHover={{ scale: 1.14 }}
          whileTap={{ scale: 0.84, rotate: -5 }}
          animate={selected ? { scale: [1, 1.28, 1.1] } : { scale: 1 }}
          transition={{ duration: selected ? 0.42 : 0.18, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(section);
          }}
          aria-label={`Open ${section.title}`}
        >
          <span className="adventure-number-ripple" />
          <span className="adventure-number-ripple ripple-two" />
          <span className="adventure-number-core">{section.markerNumber ?? section.number}</span>
        </motion.button>

        <AnimatePresence mode="wait">
          {selected && showCard && (
            <AnnotationCard
              key={section.id}
              section={section}
              onClose={onClose}
              onProjectSelect={onProjectSelect}
              onOpenSectionDetail={onOpenSectionDetail}
            />
          )}
        </AnimatePresence>
      </div>
    </Html>
  );
}
