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
    mobile
      ? {
          opacity: 0,
          y: 46,
          scale: 0.84,
          rotateX: 6,
          filter: "blur(6px)",
        }
      : {
          opacity: 0,
          x: hotspotOffset,
          y: 14,
          scale: 0.7,
          rotate:
            cardSide === "left"
              ? 4
              : -4,
          filter: "blur(7px)",
        };

  return (
    <>
      <motion.section
        className={[
          "adventure-annotation-card",
          `is-${cardSide}`,
          mobile
            ? "adventure-annotation-card--mobile"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-card-side={cardSide}
        role="dialog"
        aria-modal={
          mobile
            ? true
            : undefined
        }
        aria-labelledby={`annotation-title-${section.id}`}
        initial={
          reduceMotion
            ? false
            : initialState
        }
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          rotateX: 0,
          filter: "blur(0px)",
        }}
        transition={
          reduceMotion
            ? {
                duration: 0,
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
                  ] as const,
                },
              }
        }
        style={{
          transformOrigin:
            mobile
              ? "center bottom"
              : cardSide === "left"
                ? "right 48px"
                : "left 48px",

          perspective: 900,
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <span
          className="adventure-card-pin"
          aria-hidden="true"
        />

        <span
          className="adventure-annotation-card-dot"
          aria-hidden="true"
        />

        <button
          type="button"
          className="adventure-annotation-close"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
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
                  ] as const,
                }
          }
        >
          <header className="adventure-annotation-card-header">
            <p className="adventure-annotation-card-eyebrow">
              {section.eyebrow}
            </p>

            <h2
              id={`annotation-title-${section.id}`}
            >
              {section.title}
            </h2>
          </header>

          <div
            className={[
              "adventure-annotation-card-copy",
              `is-${section.id}`,
            ].join(" ")}
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

      <style jsx global>{`
        /*
         * Main card spacing.
         *
         * The content is inset farther from the edges to
         * follow the clean editorial layout in the reference.
         */
        .adventure-annotation-card {
          position: relative;

          box-sizing: border-box;

          padding:
            40px
            34px
            32px;
        }

        /*
         * Remove the old number and separator even if older
         * global styles or markup are still cached.
         */
        .adventure-annotation-card-number,
        .adventure-annotation-card-label {
          display: none !important;
        }

        /*
         * Small decorative dot in the upper-right corner.
         */
        .adventure-annotation-card-dot {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 2;

          display: block;
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background:
            var(
              --portfolio-orange,
              #ff68b7
            );

          box-shadow:
            0 0 9px
              rgba(
                255,
                104,
                183,
                0.5
              );

          pointer-events: none;
        }

        /*
         * Keep the close button separate from the decorative
         * dot and aligned with the card edge.
         */
        .adventure-annotation-card
          .adventure-annotation-close {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 5;
        }

        /*
         * Main inner content arrangement.
         */
        .adventure-annotation-card-inner {
          display: flex;
          min-width: 0;
          height: 100%;
          flex-direction: column;
          align-items: stretch;
        }

        /*
         * Eyebrow first, followed directly by the title.
         */
        .adventure-annotation-card-header {
          display: flex;
          min-width: 0;
          flex: 0 0 auto;
          flex-direction: column;
          align-items: flex-start;
        }

        .adventure-annotation-card-header
          .adventure-annotation-card-eyebrow {
          margin: 0;

          color:
            var(
              --portfolio-orange,
              #ff68b7
            );

          font-family:
            var(
              --font-body
            ),
            Arial,
            sans-serif;

          font-size: 0.73rem;
          font-weight: 850;
          line-height: 1.25;
          letter-spacing: 0.045em;
          text-transform: uppercase;
        }

        .adventure-annotation-card-header
          h2 {
          max-width: 100%;

          margin:
            8px
            0
            0;

          color:
            var(
              --portfolio-ink,
              #fff7fd
            );

          font-family:
            var(
              --font-display
            ),
            Arial,
            sans-serif;

          font-size:
            clamp(
              1.75rem,
              3vw,
              2.35rem
            );

          font-weight: 850;
          line-height: 1.05;
          letter-spacing: -0.045em;

          overflow-wrap: anywhere;
        }

        /*
         * Body content sits lower than the heading, matching
         * the reference card hierarchy.
         */
        .adventure-annotation-card-copy {
          display: flex;
          min-width: 0;
          min-height: 0;
          flex: 1;
          flex-direction: column;
          align-items: flex-start;

          margin-top: 28px;
          padding-right: 4px;

          overflow-x: hidden;
          overflow-y: auto;

          overscroll-behavior: contain;
          scrollbar-width: thin;
        }

        /*
         * Strong introductory paragraph.
         */
        .adventure-annotation-card-copy
          .adventure-annotation-lead {
          margin: 0;

          color:
            var(
              --portfolio-ink,
              #fff7fd
            );

          font-size: 1rem;
          font-weight: 760;
          line-height: 1.65;
        }

        /*
         * Supporting body copy.
         */
        .adventure-annotation-card-copy
          p {
          margin:
            16px
            0
            0;

          color:
            var(
              --portfolio-ink-soft,
              rgba(
                244,
                238,
                255,
                0.76
              )
            );

          font-size: 0.86rem;
          line-height: 1.75;
        }

        /*
         * Prevent the lead paragraph from receiving the
         * normal body paragraph top margin.
         */
        .adventure-annotation-card-copy
          .adventure-annotation-lead:first-child {
          margin-top: 0;
        }

        /*
         * Place action links and buttons lower in the card.
         */
        .adventure-annotation-card-copy
          button,
        .adventure-annotation-card-copy
          a {
          margin-top: 24px;
        }

        /*
         * Mobile card spacing.
         */
        .adventure-annotation-card--mobile {
          padding:
            38px
            26px
            28px;
        }

        .adventure-annotation-card--mobile
          .adventure-annotation-card-header
          h2 {
          font-size:
            clamp(
              1.65rem,
              8vw,
              2.15rem
            );
        }

        .adventure-annotation-card--mobile
          .adventure-annotation-card-copy {
          margin-top: 24px;
          padding-right: 0;
        }

        @media (
          max-width: 767px
        ) {
          .adventure-annotation-card {
            padding:
              38px
              24px
              26px;
          }

          .adventure-annotation-card-dot {
            top: 16px;
            right: 16px;

            width: 7px;
            height: 7px;
          }

          .adventure-annotation-card-header
            .adventure-annotation-card-eyebrow {
            font-size: 0.68rem;
          }

          .adventure-annotation-card-header
            h2 {
            margin-top: 7px;

            font-size:
              clamp(
                1.55rem,
                8vw,
                2rem
              );
          }

          .adventure-annotation-card-copy {
            margin-top: 23px;
          }

          .adventure-annotation-card-copy
            .adventure-annotation-lead {
            font-size: 0.94rem;
            line-height: 1.6;
          }

          .adventure-annotation-card-copy
            p {
            font-size: 0.82rem;
            line-height: 1.7;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .adventure-annotation-card,
          .adventure-annotation-card-inner {
            transition-duration:
              0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}