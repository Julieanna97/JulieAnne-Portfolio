"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import type {
  PortfolioSection,
  ProjectId,
} from "../types";

import AnnotationContent from "./AnnotationContent";

type AnnotationCardProps = {
  section: PortfolioSection;
  mobile?: boolean;
  onClose: () => void;
  onProjectSelect: (
    id: ProjectId,
  ) => void;
  onOpenSectionDetail: (
    id: "about" | "credits",
  ) => void;
};

export default function AnnotationCard({
  section,
  mobile = false,
  onClose,
  onProjectSelect,
  onOpenSectionDetail,
}: AnnotationCardProps) {
  const reduceMotion =
    useReducedMotion();

  const cardSide =
    section.id === "projects"
      ? "right"
      : "left";

  const hotspotOffset =
    cardSide === "left"
      ? 38
      : -38;

  const cardVariants =
    reduceMotion
      ? {
          closed: {
            opacity: 0,
          },

          open: {
            opacity: 1,
          },
        }
      : {
          closed: mobile
            ? {
                opacity: 0,
                y: 52,
                scale: 0.82,
                rotateX: 7,
                filter:
                  "blur(7px)",
              }
            : {
                opacity: 0,
                x: hotspotOffset,
                y: 15,
                scale: 0.62,

                rotate:
                  cardSide ===
                  "left"
                    ? 5
                    : -5,

                filter:
                  "blur(8px)",
              },

          open: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            rotateX: 0,
            filter:
              "blur(0px)",
          },
        };

  const contentVariants =
    reduceMotion
      ? {
          closed: {
            opacity: 0,
          },

          open: {
            opacity: 1,
          },
        }
      : {
          closed: {
            opacity: 0,
            y: 12,
          },

          open: {
            opacity: 1,
            y: 0,

            transition: {
              duration: 0.32,
              delay: 0.09,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            },
          },
        };

  return (
    <motion.section
      className={`adventure-annotation-card is-${cardSide} ${
        mobile
          ? "adventure-annotation-card--mobile"
          : ""
      }`}
      data-card-side={
        cardSide
      }
      role="dialog"
      aria-modal={
        mobile
          ? true
          : undefined
      }
      aria-labelledby={`annotation-title-${section.id}`}
      variants={cardVariants}
      initial="closed"
      animate="open"
      exit="closed"
      whileHover={
        reduceMotion ||
        mobile
          ? undefined
          : {
              y: -6,
              scale: 1.012,

              rotate:
                cardSide ===
                "left"
                  ? -0.35
                  : 0.35,

              transition: {
                type: "spring",
                stiffness: 390,
                damping: 24,
                mass: 0.65,
              },
            }
      }
      transition={
        reduceMotion
          ? {
              duration: 0.1,
            }
          : {
              opacity: {
                duration: 0.18,
              },

              x: {
                type: "spring",
                stiffness: 430,
                damping: 23,
                mass: 0.72,
              },

              y: {
                type: "spring",
                stiffness: 430,
                damping: 23,
                mass: 0.72,
              },

              scale: {
                type: "spring",
                stiffness: 430,
                damping: 21,
                mass: 0.72,
              },

              rotate: {
                type: "spring",
                stiffness: 390,
                damping: 24,
                mass: 0.72,
              },

              rotateX: {
                type: "spring",
                stiffness: 360,
                damping: 24,
                mass: 0.75,
              },

              filter: {
                duration: 0.22,

                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              },
            }
      }
      style={{
        transformOrigin:
          mobile
            ? "center bottom"
            : cardSide ===
                "left"
              ? "right 48px"
              : "left 48px",

        perspective: 900,
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

          /*
           * Remove the card immediately from the
           * selected state. AnimatePresence performs
           * the single exit animation.
           */
          onClose();
        }}
        aria-label={`Close ${section.title}`}
      >
        <span aria-hidden="true">
          ×
        </span>
      </button>

      <motion.div
        className="adventure-annotation-card-inner"
        variants={
          contentVariants
        }
      >
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

          <h2
            id={`annotation-title-${section.id}`}
          >
            {section.title}
          </h2>
        </header>

        <div
          className={`adventure-annotation-card-copy is-${section.id}`}
        >
          <AnnotationContent
            id={section.id}
            onProjectSelect={
              onProjectSelect
            }
            onOpenSectionDetail={
              onOpenSectionDetail
            }
          />
        </div>
      </motion.div>
    </motion.section>
  );
}