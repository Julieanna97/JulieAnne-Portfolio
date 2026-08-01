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
    section:
      PortfolioSection,
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
      position={
        section.hotspot
      }
      center
      zIndexRange={[
        40,
        0,
      ]}
      style={{
        pointerEvents:
          "auto",
      }}
    >
      <div
        className={`adventure-annotation-wrap adventure-hotspot-wrap is-${section.id} ${
          selected
            ? "is-open"
            : ""
        } ${
          disabled
            ? "is-disabled"
            : ""
        }`}
      >
        <span
          className="adventure-hotspot-tooltip"
          aria-hidden="true"
        >
          <span className="adventure-hotspot-tooltip__heart">
            ♥
          </span>

          <span>
            {section.title}
          </span>
        </span>

        <span
          className="adventure-hotspot-floating-heart"
          aria-hidden="true"
        >
          ♥
        </span>

        <motion.button
          type="button"
          className={`adventure-number ${
            selected
              ? "is-selected"
              : ""
          }`}
          disabled={
            disabled
          }
          onPointerDown={(
            event,
          ) => {
            /*
             * Prevent this pointer action from beginning
             * an OrbitControls drag.
             */
            event.stopPropagation();
          }}
          onClick={(
            event,
          ) => {
            event.stopPropagation();

            if (!disabled) {
              onSelect(
                section,
              );
            }
          }}
          aria-label={`Focus ${section.title}`}
          aria-pressed={
            selected
          }
          aria-expanded={
            false
          }
          whileHover={
            disabled
              ? undefined
              : {
                  scale:
                    1.34,

                  rotate:
                    -4,
                }
          }
          whileTap={
            disabled
              ? undefined
              : {
                  scale:
                    0.88,

                  rotate:
                    4,
                }
          }
          animate={
            selected
              ? {
                  scale:
                    1.15,

                  rotate:
                    0,
                }
              : {
                  scale:
                    1,

                  rotate:
                    0,
                }
          }
          transition={{
            type:
              "spring",

            stiffness:
              440,

            damping:
              23,

            mass:
              0.68,
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
        .adventure-hotspot-wrap {
          position: relative;

          display: grid;

          place-items: center;

          overflow: visible;
        }

        /*
         * Smaller resting marker.
         *
         * Framer Motion enlarges it when the mouse enters.
         */
        .adventure-hotspot-wrap
          .adventure-number {
          width: 34px;
          height: 34px;

          border-width: 4px;

          pointer-events: auto;

          will-change:
            transform;
        }

        .adventure-hotspot-wrap
          .adventure-number-core {
          font-size: 9px;
          line-height: 1;
        }

        .adventure-hotspot-wrap
          .adventure-number:disabled {
          pointer-events:
            none;

          cursor: wait;
        }

        /*
         * Section title pill inspired by the reference
         * hotspot label.
         */
        .adventure-hotspot-tooltip {
          position: absolute;

          bottom:
            calc(
              100% + 27px
            );

          left: 50%;
          z-index: 12;

          display: inline-flex;

          min-height: 31px;

          align-items: center;
          justify-content:
            center;

          gap: 7px;

          border:
            1px solid
            rgba(
              255,
              139,
              211,
              0.38
            );

          border-radius:
            999px;

          background:
            linear-gradient(
              135deg,
              rgba(
                46,
                15,
                62,
                0.97
              ),
              rgba(
                21,
                9,
                38,
                0.97
              )
            );

          box-shadow:
            0 0 20px
              rgba(
                255,
                75,
                174,
                0.2
              ),
            0 10px 26px
              rgba(
                0,
                0,
                0,
                0.44
              );

          padding:
            0 12px;

          color: #fff7fd;

          font-family:
            var(--font-body),
            Arial,
            sans-serif;

          font-size: 9px;
          font-weight: 900;
          letter-spacing:
            0.09em;

          text-transform:
            uppercase;

          white-space: nowrap;

          opacity: 0;

          pointer-events:
            none;

          transform:
            translateX(-50%)
            translateY(8px)
            scale(0.9);

          transform-origin:
            center bottom;

          transition:
            opacity 180ms ease,
            transform 220ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              );
        }

        .adventure-hotspot-tooltip::after {
          content: "";

          position: absolute;

          top: 100%;
          left: 50%;

          width: 0;
          height: 0;

          border-right:
            5px solid
            transparent;

          border-left:
            5px solid
            transparent;

          border-top:
            6px solid
            rgba(
              30,
              10,
              46,
              0.98
            );

          transform:
            translateX(-50%);
        }

        .adventure-hotspot-tooltip__heart {
          color: #ff71bc;

          font-size: 10px;

          filter:
            drop-shadow(
              0 0 5px
                rgba(
                  255,
                  104,
                  183,
                  0.7
                )
            );
        }

        /*
         * A second heart floats upward directly above the
         * circle.
         */
        .adventure-hotspot-floating-heart {
          position: absolute;

          bottom:
            calc(
              100% + 3px
            );

          left: 50%;
          z-index: 11;

          color: #ff75be;

          font-size: 15px;
          line-height: 1;

          opacity: 0;

          pointer-events:
            none;

          filter:
            drop-shadow(
              0 0 7px
                rgba(
                  255,
                  104,
                  183,
                  0.72
                )
            );

          transform:
            translateX(-50%)
            translateY(7px)
            rotate(-12deg)
            scale(0.35);

          transition:
            opacity 170ms ease,
            transform 260ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              );
        }

        .adventure-hotspot-wrap:not(
            .is-disabled
          ):hover
          .adventure-hotspot-tooltip,
        .adventure-hotspot-wrap:not(
            .is-disabled
          ):focus-within
          .adventure-hotspot-tooltip {
          opacity: 1;

          transform:
            translateX(-50%)
            translateY(0)
            scale(1);
        }

        .adventure-hotspot-wrap:not(
            .is-disabled
          ):hover
          .adventure-hotspot-floating-heart,
        .adventure-hotspot-wrap:not(
            .is-disabled
          ):focus-within
          .adventure-hotspot-floating-heart {
          opacity: 1;

          transform:
            translateX(-50%)
            translateY(-5px)
            rotate(8deg)
            scale(1);
        }

        .adventure-hotspot-wrap:not(
            .is-disabled
          ):hover
          .adventure-number {
          border-color:
            rgba(
              255,
              255,
              255,
              1
            );

          box-shadow:
            0 0 0 1px
              rgba(
                255,
                255,
                255,
                0.2
              )
              inset,
            0 0 33px
              rgba(
                255,
                75,
                174,
                0.82
              ),
            0 0 56px
              rgba(
                154,
                92,
                255,
                0.32
              ),
            0 15px 38px
              rgba(
                0,
                0,
                0,
                0.64
              );
        }

        @media (
          max-width: 767px
        ) {
          .adventure-hotspot-wrap
            .adventure-number {
            width: 31px;
            height: 31px;

            border-width: 4px;
          }

          .adventure-hotspot-tooltip {
            bottom:
              calc(
                100% + 24px
              );

            min-height: 28px;

            padding:
              0 10px;

            font-size: 8px;
          }

          .adventure-hotspot-floating-heart {
            font-size: 13px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .adventure-hotspot-tooltip,
          .adventure-hotspot-floating-heart {
            transition-duration:
              0.01ms;
          }
        }
      `}</style>
    </Html>
  );
}