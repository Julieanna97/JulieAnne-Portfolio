"use client";

import {
  Html,
} from "@react-three/drei";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import type {
  PortfolioSection,
  ProjectId,
} from "../types";

import AnnotationCard from "./AnnotationCard";

type NumberHotspotProps = {
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
    id: "about" | "credits",
  ) => void;
};

export default function NumberHotspot({
  section,
  disabled,
  selected,
  showCard,
  onSelect,
  onClose,
  onProjectSelect,
  onOpenSectionDetail,
}: NumberHotspotProps) {
  const cardIsVisible =
    selected && showCard;

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
          onClick={(event) => {
            event.stopPropagation();

            onSelect(section);
          }}
          aria-label={`Open ${section.title}`}
          aria-expanded={
            cardIsVisible
          }
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
                  scale: 0.82,
                  rotate: 3,
                }
          }
          animate={
            selected
              ? {
                  scale: 1.08,
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

        <AnimatePresence
          initial={false}
          mode="wait"
        >
          {cardIsVisible && (
            <AnnotationCard
              key={section.id}
              section={section}
              onClose={
                onClose
              }
              onProjectSelect={
                onProjectSelect
              }
              onOpenSectionDetail={
                onOpenSectionDetail
              }
            />
          )}
        </AnimatePresence>
      </div>
    </Html>
  );
}