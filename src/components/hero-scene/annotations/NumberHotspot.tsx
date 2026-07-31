"use client";

import {
  Html,
} from "@react-three/drei";

import {
  motion,
} from "framer-motion";

import type {
  PortfolioSection,
  ProjectId,
} from "../types";

export type NumberHotspotProps = {
  section: PortfolioSection;
  disabled: boolean;
  selected: boolean;
  showCard: boolean;

  onSelect: (
    section: PortfolioSection,
  ) => void;

  onClose: () => void;

  onProjectSelect: (
    id: ProjectId,
  ) => void;

  onOpenSectionDetail: (
    id:
      | "about"
      | "credits",
  ) => void;
};

export default function NumberHotspot({
  section,
  disabled,
  selected,
  onSelect,
}: NumberHotspotProps) {
  return (
    <Html
      position={section.hotspot}
      center
      zIndexRange={[
        40,
        0,
      ]}
      style={{
        pointerEvents: "auto",
      }}
    >
      <div
        className={`adventure-annotation-wrap ${
          selected
            ? "is-open"
            : ""
        }`}
      >
        <motion.button
          type="button"
          className={`adventure-number ${
            selected
              ? "is-selected"
              : ""
          }`}
          disabled={disabled}
          onPointerDown={(event) => {
            /*
             * Prevent the marker click from also starting
             * an OrbitControls drag.
             */
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();

            if (!disabled) {
              onSelect(section);
            }
          }}
          aria-label={`Focus ${section.title}`}
          aria-pressed={selected}
          aria-expanded={false}
          whileHover={
            disabled
              ? undefined
              : {
                  scale: 1.12,
                  rotate: -3,
                }
          }
          whileTap={
            disabled
              ? undefined
              : {
                  scale: 0.84,
                  rotate: 3,
                }
          }
          animate={
            selected
              ? {
                  scale: 1.1,
                  rotate: 0,
                }
              : {
                  scale: 1,
                  rotate: 0,
                }
          }
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 24,
            mass: 0.7,
          }}
        >
          <span className="adventure-number-ripple" />

          <span className="adventure-number-ripple ripple-two" />

          <span className="adventure-number-core">
            {section.markerNumber ??
              section.number}
          </span>
        </motion.button>
      </div>

      <style jsx global>{`
        .adventure-number {
          pointer-events: auto;
        }

        .adventure-number:disabled {
          pointer-events: none;
          cursor: wait;
        }
      `}</style>
    </Html>
  );
}