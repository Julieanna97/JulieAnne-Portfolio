"use client";

import { Html } from "@react-three/drei";
import { motion } from "framer-motion";

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
    id: "about" | "credits",
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
      zIndexRange={[40, 0]}
      style={{
        pointerEvents: "auto",
      }}
    >
      <div
        className={[
          "adventure-annotation-wrap",
          "adventure-hotspot-wrap",
          `is-${section.id}`,
          selected ? "is-open" : "",
          disabled ? "is-disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span
          className="adventure-hotspot-tooltip"
          aria-hidden="true"
        >
          <span className="adventure-hotspot-tooltip__heart">
            ♥
          </span>

          <span>{section.title}</span>
        </span>

        <span
          className="adventure-hotspot-floating-heart"
          aria-hidden="true"
        >
          ♥
        </span>

        <motion.button
          type="button"
          className={[
            "adventure-number",
            selected ? "is-selected" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={disabled}
          aria-label={`Focus ${section.title}`}
          aria-pressed={selected}
          aria-expanded={false}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();

            if (!disabled) {
              onSelect(section);
            }
          }}
          whileHover={
            disabled
              ? undefined
              : {
                  scale: 1.05,
                  rotate: -2,
                }
          }
          whileTap={
            disabled
              ? undefined
              : {
                  scale: 0.96,
                  rotate: 2,
                }
          }
          animate={
            selected
              ? {
                  scale: 1.04,
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
            damping: 25,
            mass: 0.65,
          }}
        >
          <span
            className="adventure-number-ripple"
            aria-hidden="true"
          />

          <span
            className="adventure-number-ripple ripple-two"
            aria-hidden="true"
          />

          <span className="adventure-number-core">
            {section.markerNumber ?? section.number}
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
         * Key fix:
         * - overall hotspot stays small
         * - white ring gets thicker
         * - purple middle becomes smaller
         */
        .adventure-hotspot-wrap .adventure-number {
          position: relative;
          display: grid;
          width: 34px;
          height: 34px;
          box-sizing: border-box;
          place-items: center;

          margin: 0;
          padding: 0;

          border: 7px solid rgba(255, 255, 255, 0.97);
          border-radius: 50%;
          outline: none;

          appearance: none;
          -webkit-appearance: none;

          background: linear-gradient(
            135deg,
            #9a5cff 0%,
            #ff4aa9 100%
          );

          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 0 10px rgba(255, 75, 174, 0.28),
            0 6px 14px rgba(0, 0, 0, 0.42);

          color: #ffffff;
          cursor: pointer;

          pointer-events: auto;
          transform-origin: center;
          will-change: transform;

          transition:
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        /*
         * Smaller number so it fits the smaller purple center.
         */
        .adventure-hotspot-wrap .adventure-number-core {
          position: relative;
          z-index: 4;
          display: block;

          font-size: 7px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0;
          text-align: center;

          pointer-events: none;
        }

        .adventure-hotspot-wrap .adventure-number-ripple {
          position: absolute;
          inset: -3px;
          z-index: 1;

          box-sizing: border-box;

          border: 1px solid rgba(255, 104, 183, 0.5);
          border-radius: 50%;

          box-shadow: 0 0 8px rgba(255, 95, 183, 0.18);

          pointer-events: none;

          animation: editorial-hotspot-ripple 2.6s ease-out infinite;
        }

        .adventure-hotspot-wrap .adventure-number-ripple.ripple-two {
          animation-delay: 1.3s;
        }

        .adventure-hotspot-wrap .adventure-number:hover,
        .adventure-hotspot-wrap .adventure-number.is-selected {
          border-color: #ffffff;
          background: linear-gradient(
            135deg,
            #aa73ff 0%,
            #ff53ae 100%
          );
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.14) inset,
            0 0 14px rgba(255, 75, 174, 0.42),
            0 7px 16px rgba(0, 0, 0, 0.46);
        }

        .adventure-hotspot-wrap .adventure-number:focus-visible {
          border-color: #ffffff;
          box-shadow:
            0 0 0 3px rgba(105, 223, 255, 0.82),
            0 0 14px rgba(255, 75, 174, 0.42),
            0 7px 16px rgba(0, 0, 0, 0.46);
        }

        .adventure-hotspot-wrap .adventure-number:disabled {
          cursor: wait;
          opacity: 0.68;
          pointer-events: none;
        }

        .adventure-hotspot-tooltip {
          position: absolute;
          bottom: calc(100% + 22px);
          left: 50%;
          z-index: 12;

          display: inline-flex;
          min-height: 29px;
          align-items: center;
          justify-content: center;
          gap: 6px;

          box-sizing: border-box;

          border: 1px solid rgba(255, 139, 211, 0.38);
          border-radius: 999px;

          background: linear-gradient(
            135deg,
            rgba(46, 15, 62, 0.97),
            rgba(21, 9, 38, 0.97)
          );

          box-shadow:
            0 0 17px rgba(255, 75, 174, 0.18),
            0 9px 23px rgba(0, 0, 0, 0.42);

          padding: 0 11px;

          color: #fff7fd;

          font-family: var(--font-body), Arial, sans-serif;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          white-space: nowrap;

          opacity: 0;
          pointer-events: none;

          transform: translateX(-50%) translateY(7px) scale(0.92);
          transform-origin: center bottom;

          transition:
            opacity 180ms ease,
            transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .adventure-hotspot-tooltip::after {
          content: "";

          position: absolute;
          top: 100%;
          left: 50%;

          width: 0;
          height: 0;

          border-right: 5px solid transparent;
          border-left: 5px solid transparent;
          border-top: 6px solid rgba(30, 10, 46, 0.98);

          transform: translateX(-50%);
        }

        .adventure-hotspot-tooltip__heart {
          color: #ff71bc;
          font-size: 9px;
          line-height: 1;
          filter: drop-shadow(0 0 5px rgba(255, 104, 183, 0.7));
        }

        .adventure-hotspot-floating-heart {
          position: absolute;
          bottom: calc(100% + 2px);
          left: 50%;
          z-index: 11;

          color: #ff75be;

          font-size: 13px;
          line-height: 1;

          opacity: 0;
          pointer-events: none;

          filter: drop-shadow(0 0 6px rgba(255, 104, 183, 0.7));

          transform: translateX(-50%) translateY(6px) rotate(-12deg) scale(0.35);

          transition:
            opacity 170ms ease,
            transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .adventure-hotspot-wrap:not(.is-disabled):hover
          .adventure-hotspot-tooltip,
        .adventure-hotspot-wrap:not(.is-disabled):focus-within
          .adventure-hotspot-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
        }

        .adventure-hotspot-wrap:not(.is-disabled):hover
          .adventure-hotspot-floating-heart,
        .adventure-hotspot-wrap:not(.is-disabled):focus-within
          .adventure-hotspot-floating-heart {
          opacity: 1;
          transform: translateX(-50%) translateY(-4px) rotate(7deg) scale(1);
        }

        @media (max-width: 767px) {
          .adventure-hotspot-wrap .adventure-number {
            width: 32px;
            height: 32px;
            border-width: 7px;
          }

          .adventure-hotspot-wrap .adventure-number-core {
            font-size: 7px;
          }

          .adventure-hotspot-wrap .adventure-number-ripple {
            inset: -3px;
          }

          .adventure-hotspot-tooltip {
            bottom: calc(100% + 20px);
            min-height: 27px;
            padding: 0 9px;
            font-size: 7px;
          }

          .adventure-hotspot-floating-heart {
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .adventure-hotspot-tooltip,
          .adventure-hotspot-floating-heart {
            transition-duration: 0.01ms;
          }

          .adventure-hotspot-wrap .adventure-number-ripple {
            animation: none;
            opacity: 0.35;
          }
        }
      `}</style>
    </Html>
  );
}