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

  /*
   * This should be true only while this hotspot's
   * automatic popup card is open.
   */
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
}: NumberHotspotProps) {
  /*
   * The orange radar stays active for the entire time
   * this hotspot's automatic popup card is open.
   */
  const radarActive =
    selected && showCard;

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
          selected
            ? "is-open"
            : "",
          disabled
            ? "is-disabled"
            : "",
          radarActive
            ? "is-radar-active"
            : "",
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

          <span>
            {section.title}
          </span>
        </span>

        <motion.button
          type="button"
          className={[
            "adventure-number",
            selected
              ? "is-selected"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={disabled}
          aria-label={`Focus ${section.title}`}
          aria-pressed={selected}
          aria-expanded={radarActive}
          onPointerDown={(event) => {
            /*
             * Prevent the hotspot press from beginning an
             * OrbitControls drag.
             */
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
                  scale: 1.03,
                }
          }
          whileTap={
            disabled
              ? undefined
              : {
                  scale: 0.95,
                }
          }
          animate={{
            scale: 1,
            rotate: 0,
          }}
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
            className={[
              "adventure-number-ripple",
              "ripple-two",
            ].join(" ")}
            aria-hidden="true"
          />

          <span
            className="adventure-number-core"
            aria-hidden="true"
          />

          <span
            className="adventure-hotspot-search-icon"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              focusable="false"
            >
              <circle
                cx="10.5"
                cy="10.5"
                r="5.5"
              />

              <path d="M15 15l5 5" />
            </svg>
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
         * Large invisible click target.
         *
         * The visible hotspot is drawn by
         * adventure-number-core.
         */
        .adventure-hotspot-wrap
          .adventure-number {
          position: relative;

          display: grid;
          width: 40px;
          height: 40px;
          box-sizing: border-box;
          place-items: center;

          margin: 0;
          padding: 0;

          overflow: visible;

          border: 0 !important;
          border-radius: 50%;
          outline: none;

          appearance: none;
          -webkit-appearance: none;

          background:
            transparent !important;

          box-shadow:
            none !important;

          color: #ffffff;
          cursor: pointer;

          pointer-events: auto;

          transform-origin: center;
          will-change: transform;
        }

        /*
         * Prevent older global hover and selected styles
         * from drawing an extra circle.
         */
        .adventure-hotspot-wrap
          .adventure-number:hover,
        .adventure-hotspot-wrap
          .adventure-number.is-selected {
          border: 0 !important;

          background:
            transparent !important;

          box-shadow:
            none !important;

          animation:
            none !important;
        }

        /*
         * NORMAL STATE
         *
         * Small white ring with a purple center.
         */
        .adventure-hotspot-wrap
          .adventure-number-core {
          position: relative;
          z-index: 4;

          display: grid;
          width: 20px;
          height: 20px;
          box-sizing: border-box;
          place-items: center;

          border:
            4px solid
            rgba(
              255,
              255,
              255,
              0.98
            );

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #9a5cff 0%,
              #ff4aa9 100%
            );

          box-shadow:
            0 0 0 1px
              rgba(
                255,
                255,
                255,
                0.08
              )
              inset,
            0 0 6px
              rgba(
                255,
                75,
                174,
                0.18
              ),
            0 3px 8px
              rgba(
                0,
                0,
                0,
                0.3
              );

          opacity: 1;
          pointer-events: none;

          transform: scale(1);

          transition:
            width 260ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              ),
            height 260ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              ),
            border-width 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 240ms ease,
            transform 240ms ease;
        }

        /*
         * Magnifying glass.
         *
         * It appears only while hovering or keyboard
         * focusing the normal hotspot.
         */
        .adventure-hotspot-search-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 8;

          display: grid;
          width: 16px;
          height: 16px;
          place-items: center;

          color: #56305f;

          opacity: 0;
          pointer-events: none;

          transform:
            translate(
              -50%,
              -50%
            )
            scale(0.38)
            rotate(-14deg);

          transition:
            opacity 140ms ease,
            transform 270ms
              cubic-bezier(
                0.16,
                1.2,
                0.3,
                1
              );
        }

        .adventure-hotspot-search-icon
          svg {
          display: block;
          width: 100%;
          height: 100%;

          overflow: visible;

          fill: none;
          stroke: currentColor;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /*
         * LARGE HOVER STATE
         *
         * The small marker expands into a larger white
         * search button.
         */
        .adventure-hotspot-wrap:not(
            .is-disabled
          )
          .adventure-number:hover
          .adventure-number-core,
        .adventure-hotspot-wrap:not(
            .is-disabled
          )
          .adventure-number:focus-visible
          .adventure-number-core {
          width: 34px;
          height: 34px;

          border-width: 6px;

          border-color:
            rgba(
              255,
              255,
              255,
              0.99
            );

          background:
            radial-gradient(
              circle at 50% 42%,
              #ffffff 0%,
              #fffafd 64%,
              #f6dfef 100%
            );

          box-shadow:
            0 0 0 2px
              rgba(
                255,
                120,
                193,
                0.2
              ),
            0 0 17px
              rgba(
                255,
                76,
                174,
                0.56
              ),
            0 0 30px
              rgba(
                255,
                137,
                44,
                0.22
              ),
            0 7px 18px
              rgba(
                0,
                0,
                0,
                0.4
              );
        }

        .adventure-hotspot-wrap:not(
            .is-disabled
          )
          .adventure-number:hover
          .adventure-hotspot-search-icon,
        .adventure-hotspot-wrap:not(
            .is-disabled
          )
          .adventure-number:focus-visible
          .adventure-hotspot-search-icon {
          opacity: 1;

          transform:
            translate(
              -50%,
              -50%
            )
            scale(1)
            rotate(0deg);
        }

        /*
         * CARD-OPEN AUTOMATIC-ROTATION STATE
         *
         * The white ring disappears and the center becomes
         * a small purple dot.
         */
        .adventure-hotspot-wrap.is-radar-active
          .adventure-number-core {
          width: 9px;
          height: 9px;

          border-width: 0;
          border-color: transparent;

          background:
            radial-gradient(
              circle at 35% 28%,
              #dfc0ff 0%,
              #b675f5 35%,
              #873bd4 70%,
              #5a1999 100%
            );

          box-shadow:
            0 0 8px
              rgba(
                165,
                82,
                236,
                0.9
              ),
            0 0 4px
              rgba(
                255,
                143,
                48,
                0.45
              ),
            0 2px 5px
              rgba(
                0,
                0,
                0,
                0.45
              );

          transform: scale(1);
        }

        /*
         * Keep the persistent automatic radar state intact
         * even when the pointer passes over it.
         */
        .adventure-hotspot-wrap.is-radar-active
          .adventure-number:hover
          .adventure-number-core,
        .adventure-hotspot-wrap.is-radar-active
          .adventure-number:focus-visible
          .adventure-number-core {
          width: 9px;
          height: 9px;

          border-width: 0;
          border-color: transparent;

          background:
            radial-gradient(
              circle at 35% 28%,
              #dfc0ff 0%,
              #b675f5 35%,
              #873bd4 70%,
              #5a1999 100%
            );

          box-shadow:
            0 0 8px
              rgba(
                165,
                82,
                236,
                0.9
              ),
            0 0 4px
              rgba(
                255,
                143,
                48,
                0.45
              ),
            0 2px 5px
              rgba(
                0,
                0,
                0,
                0.45
              );
        }

        .adventure-hotspot-wrap.is-radar-active
          .adventure-hotspot-search-icon {
          opacity: 0;

          transform:
            translate(
              -50%,
              -50%
            )
            scale(0.38)
            rotate(-14deg);
        }

        /*
         * NORMAL PINK RIPPLE
         */
        .adventure-hotspot-wrap
          .adventure-number-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 2;

          width: 24px;
          height: 24px;
          box-sizing: border-box;

          border:
            1px solid
            rgba(
              255,
              104,
              183,
              0.44
            );

          border-radius: 50%;

          opacity: 0;

          box-shadow:
            0 0 6px
              rgba(
                255,
                95,
                183,
                0.15
              );

          pointer-events: none;

          transform:
            translate(
              -50%,
              -50%
            )
            scale(0.88);

          animation:
            adventure-default-hotspot-ripple
            2.6s
            ease-out
            infinite;

          transition:
            width 240ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              ),
            height 240ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              ),
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .adventure-hotspot-wrap
          .adventure-number-ripple.ripple-two {
          animation-delay: 1.3s;
        }

        @keyframes adventure-default-hotspot-ripple {
          0% {
            opacity: 0;

            transform:
              translate(
                -50%,
                -50%
              )
              scale(0.88);
          }

          14% {
            opacity: 0.46;
          }

          68% {
            opacity: 0.14;
          }

          100% {
            opacity: 0;

            transform:
              translate(
                -50%,
                -50%
              )
              scale(1.3);
          }
        }

        /*
         * Larger and faster ripple while hovering.
         */
        .adventure-hotspot-wrap:not(
            .is-disabled
          )
          .adventure-number:hover
          .adventure-number-ripple,
        .adventure-hotspot-wrap:not(
            .is-disabled
          )
          .adventure-number:focus-visible
          .adventure-number-ripple {
          width: 38px;
          height: 38px;

          border-color:
            rgba(
              255,
              126,
              190,
              0.72
            );

          box-shadow:
            0 0 10px
              rgba(
                255,
                85,
                176,
                0.34
              );

          animation-duration: 1.45s;
        }

        /*
         * PERSISTENT ORANGE RADAR
         *
         * This remains active for the entire time the
         * matching automatic popup card is open.
         */
        .adventure-hotspot-wrap.is-radar-active
          .adventure-number-ripple {
          width: 12px;
          height: 12px;

          border:
            2px solid
            rgba(
              255,
              139,
              43,
              0.96
            );

          box-shadow:
            0 0 5px
              rgba(
                255,
                130,
                35,
                0.78
              ),
            0 0 11px
              rgba(
                255,
                153,
                57,
                0.32
              );

          transform:
            translate(
              -50%,
              -50%
            )
            scale(0.72);

          animation:
            adventure-orange-radar
            1.8s
            cubic-bezier(
              0.16,
              0.72,
              0.3,
              1
            )
            infinite;
        }

        .adventure-hotspot-wrap.is-radar-active
          .adventure-number-ripple.ripple-two {
          animation-delay: 0.9s;
        }

        /*
         * Prevent the general hover ripple from replacing
         * the orange automatic radar.
         */
        .adventure-hotspot-wrap.is-radar-active
          .adventure-number:hover
          .adventure-number-ripple,
        .adventure-hotspot-wrap.is-radar-active
          .adventure-number:focus-visible
          .adventure-number-ripple {
          width: 12px;
          height: 12px;

          border:
            2px solid
            rgba(
              255,
              139,
              43,
              0.96
            );

          box-shadow:
            0 0 5px
              rgba(
                255,
                130,
                35,
                0.78
              ),
            0 0 11px
              rgba(
                255,
                153,
                57,
                0.32
              );

          animation-duration: 1.8s;
        }

        @keyframes adventure-orange-radar {
          0% {
            opacity: 0;

            transform:
              translate(
                -50%,
                -50%
              )
              scale(0.72);
          }

          12% {
            opacity: 0.96;
          }

          62% {
            opacity: 0.34;
          }

          100% {
            opacity: 0;

            transform:
              translate(
                -50%,
                -50%
              )
              scale(3.1);
          }
        }

        /*
         * Keyboard focus.
         */
        .adventure-hotspot-wrap
          .adventure-number:focus-visible {
          border: 0 !important;
          outline: none;

          background:
            transparent !important;

          box-shadow:
            none !important;
        }

        .adventure-hotspot-wrap
          .adventure-number:disabled {
          cursor: wait;
          opacity: 0.68;
          pointer-events: none;
        }

        /*
         * Pop-out title label.
         */
        .adventure-hotspot-tooltip {
          position: absolute;
          bottom:
            calc(
              50% + 22px
            );
          left: 50%;
          z-index: 12;

          display: inline-flex;
          min-height: 29px;
          box-sizing: border-box;
          align-items: center;
          justify-content: center;
          gap: 6px;

          border:
            1px solid
            rgba(
              255,
              139,
              211,
              0.48
            );

          border-radius: 999px;

          background:
            linear-gradient(
              135deg,
              rgba(
                46,
                15,
                62,
                0.98
              ),
              rgba(
                21,
                9,
                38,
                0.98
              )
            );

          box-shadow:
            0 0 18px
              rgba(
                255,
                75,
                174,
                0.24
              ),
            0 10px 26px
              rgba(
                0,
                0,
                0,
                0.46
              );

          padding: 0 11px;

          color: #fff7fd;

          font-family:
            var(--font-body),
            Arial,
            sans-serif;

          font-size: 8px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          white-space: nowrap;

          opacity: 0;
          pointer-events: none;

          transform:
            translateX(-50%)
            translateY(11px)
            scale(0.7);

          transform-origin:
            center bottom;

          transition:
            opacity 150ms ease,
            transform 290ms
              cubic-bezier(
                0.16,
                1.24,
                0.3,
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

          font-size: 9px;
          line-height: 1;

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
         * Pop the title out above the expanded hotspot.
         */
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
            translateY(-6px)
            scale(1);
        }

        @media (
          max-width: 767px
        ) {
          .adventure-hotspot-wrap
            .adventure-number {
            width: 38px;
            height: 38px;
          }

          /*
           * Normal mobile marker.
           */
          .adventure-hotspot-wrap
            .adventure-number-core {
            width: 18px;
            height: 18px;

            border-width: 4px;
          }

          /*
           * Larger mobile hover state.
           */
          .adventure-hotspot-wrap:not(
              .is-disabled
            )
            .adventure-number:hover
            .adventure-number-core,
          .adventure-hotspot-wrap:not(
              .is-disabled
            )
            .adventure-number:focus-visible
            .adventure-number-core {
            width: 32px;
            height: 32px;

            border-width: 6px;
          }

          .adventure-hotspot-search-icon {
            width: 15px;
            height: 15px;
          }

          /*
           * Active automatic-card marker.
           */
          .adventure-hotspot-wrap.is-radar-active
            .adventure-number-core,
          .adventure-hotspot-wrap.is-radar-active
            .adventure-number:hover
            .adventure-number-core,
          .adventure-hotspot-wrap.is-radar-active
            .adventure-number:focus-visible
            .adventure-number-core {
            width: 8px;
            height: 8px;

            border-width: 0;
          }

          .adventure-hotspot-wrap
            .adventure-number-ripple {
            width: 22px;
            height: 22px;
          }

          .adventure-hotspot-wrap:not(
              .is-disabled
            )
            .adventure-number:hover
            .adventure-number-ripple,
          .adventure-hotspot-wrap:not(
              .is-disabled
            )
            .adventure-number:focus-visible
            .adventure-number-ripple {
            width: 36px;
            height: 36px;
          }

          .adventure-hotspot-wrap.is-radar-active
            .adventure-number-ripple,
          .adventure-hotspot-wrap.is-radar-active
            .adventure-number:hover
            .adventure-number-ripple,
          .adventure-hotspot-wrap.is-radar-active
            .adventure-number:focus-visible
            .adventure-number-ripple {
            width: 11px;
            height: 11px;
          }

          .adventure-hotspot-tooltip {
            bottom:
              calc(
                50% + 20px
              );

            min-height: 27px;

            padding: 0 9px;

            font-size: 7px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .adventure-hotspot-wrap
            .adventure-number-ripple {
            animation: none;
            opacity: 0.28;

            transform:
              translate(
                -50%,
                -50%
              )
              scale(1);
          }

          .adventure-hotspot-wrap.is-radar-active
            .adventure-number-ripple {
            animation: none;
          }

          .adventure-hotspot-wrap.is-radar-active
            .adventure-number-ripple:not(
              .ripple-two
            ) {
            opacity: 0.78;

            transform:
              translate(
                -50%,
                -50%
              )
              scale(1.55);
          }

          .adventure-hotspot-wrap.is-radar-active
            .adventure-number-ripple.ripple-two {
            opacity: 0;
          }

          .adventure-hotspot-tooltip,
          .adventure-hotspot-search-icon,
          .adventure-number-core {
            transition-duration:
              0.01ms;
          }
        }
      `}</style>
    </Html>
  );
}