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

  const initialState =
    reduceMotion
      ? {
          opacity: 0,
        }
      : mobile
        ? {
            opacity: 0,
            y: 46,
            scale: 0.84,
            rotateX: 6,
            filter:
              "blur(6px)",
          }
        : {
            opacity: 0,
            x: hotspotOffset,
            y: 14,
            scale: 0.7,

            rotate:
              cardSide ===
              "left"
                ? 4
                : -4,

            filter:
              "blur(7px)",
          };

  const openState =
    reduceMotion
      ? {
          opacity: 1,
        }
      : {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          rotateX: 0,
          filter:
            "blur(0px)",
        };

  /*
   * Exit deliberately does not return to the opening
   * spring state. It simply fades away, preventing the
   * small bouncing box that appeared after closing.
   */
  const exitState =
    reduceMotion
      ? {
          opacity: 0,

          transition: {
            duration: 0.01,
          },
        }
      : {
          opacity: 0,
          y: 3,
          scale: 0.98,
          filter:
            "blur(2px)",

          transition: {
            duration: 0.14,

            ease: [
              0.4,
              0,
              1,
              1,
            ] as const,
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
      initial={initialState}
      animate={openState}
      exit={exitState}
      transition={
        reduceMotion
          ? {
              duration: 0.01,
            }
          : {
              opacity: {
                duration: 0.18,
              },

              x: {
                type: "spring",
                stiffness: 430,
                damping: 25,
                mass: 0.72,
              },

              y: {
                type: "spring",
                stiffness: 430,
                damping: 25,
                mass: 0.72,
              },

              scale: {
                type: "spring",
                stiffness: 430,
                damping: 23,
                mass: 0.72,
              },

              rotate: {
                type: "spring",
                stiffness: 390,
                damping: 25,
                mass: 0.72,
              },

              rotateX: {
                type: "spring",
                stiffness: 360,
                damping: 25,
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
           * Remove mouse focus before AnimatePresence
           * begins the exit. Otherwise :focus-within
           * keeps the large outline visible.
           */
          event.currentTarget.blur();

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
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: 12,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={
          reduceMotion
            ? {
                duration: 0,
              }
            : {
                duration: 0.3,
                delay: 0.08,

                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }
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