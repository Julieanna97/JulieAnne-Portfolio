"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PortfolioSection, ProjectId } from "../types";
import AnnotationContent from "./AnnotationContent";

type AnnotationCardProps = {
  section: PortfolioSection;
  mobile?: boolean;
  onClose: () => void;
  onProjectSelect: (id: ProjectId) => void;
  onOpenSectionDetail: (id: "about" | "credits") => void;
};

export default function AnnotationCard({
  section,
  mobile = false,
  onClose,
  onProjectSelect,
  onOpenSectionDetail,
}: AnnotationCardProps) {
  const reduceMotion = useReducedMotion();
  const [closing, setClosing] = useState(false);

  /*
    About and Credits open to the left of their hotspot.
    Projects opens to the right so the project list has more room.
  */
  const cardSide =
    section.id === "projects"
      ? "right"
      : "left";

  const horizontalOffset =
    cardSide === "left"
      ? 28
      : -28;

  const closedClipPath = mobile
    ? "inset(100% 0% 0% 0% round 28px)"
    : cardSide === "left"
      ? "inset(0% 0% 0% 100% round 28px)"
      : "inset(0% 100% 0% 0% round 28px)";

  const closedState = reduceMotion
    ? {
        opacity: 0,
      }
    : mobile
      ? {
          opacity: 0,
          y: 28,
          scale: 0.96,
          clipPath: closedClipPath,
        }
      : {
          opacity: 0,
          x: horizontalOffset,
          y: 8,
          scale: 0.9,
          clipPath: closedClipPath,
        };

  const openState = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0% round 28px)",
  };

  const requestClose = () => {
    if (!closing) {
      setClosing(true);
    }
  };

  return (
    <motion.section
      className={`adventure-annotation-card is-${cardSide} ${
        mobile ? "adventure-annotation-card--mobile" : ""
      } ${closing ? "is-closing" : ""}`}
      role="dialog"
      aria-modal={mobile ? true : undefined}
      aria-labelledby={`annotation-title-${section.id}`}
      initial={closedState}
      animate={closing ? closedState : openState}
      exit={closedState}
      transition={
        reduceMotion
          ? {
              duration: 0.12,
            }
          : {
              opacity: {
                duration: 0.2,
              },
              scale: {
                type: "spring",
                stiffness: 310,
                damping: 27,
                mass: 0.82,
              },
              x: {
                type: "spring",
                stiffness: 310,
                damping: 27,
                mass: 0.82,
              },
              y: {
                type: "spring",
                stiffness: 310,
                damping: 27,
                mass: 0.82,
              },
              clipPath: {
                duration: 0.44,
                ease: [0.22, 1, 0.36, 1],
              },
            }
      }
      style={{
        transformOrigin: mobile
          ? "center bottom"
          : cardSide === "left"
            ? "right 48px"
            : "left 48px",
      }}
      onAnimationComplete={() => {
        if (closing) {
          onClose();
        }
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <span
        className="adventure-card-pin"
        aria-hidden="true"
      />

      <button
        type="button"
        className="adventure-annotation-close"
        onClick={(event) => {
          event.stopPropagation();
          requestClose();
        }}
        disabled={closing}
        aria-label={`Close ${section.title}`}
      >
        <span aria-hidden="true">×</span>
      </button>

      <header className="adventure-annotation-card-header">
        <div className="adventure-annotation-card-label">
          <p className="adventure-annotation-card-number">
            {section.number}
          </p>

          <span aria-hidden="true" />

          <p className="adventure-annotation-card-eyebrow">
            {section.eyebrow}
          </p>
        </div>

        <h2 id={`annotation-title-${section.id}`}>
          {section.title}
        </h2>
      </header>

      <div
        className={`adventure-annotation-card-copy is-${section.id}`}
      >
        <AnnotationContent
          id={section.id}
          onProjectSelect={onProjectSelect}
          onOpenSectionDetail={onOpenSectionDetail}
        />
      </div>
    </motion.section>
  );
}