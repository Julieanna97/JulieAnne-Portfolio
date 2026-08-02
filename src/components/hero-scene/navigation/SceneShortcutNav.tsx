"use client";

import {
  motion,
} from "framer-motion";

import type {
  SectionId,
} from "../types";

type SceneShortcutNavProps = {
  disabled?: boolean;

  onSelect: (
    id: SectionId,
  ) => void;
};

type ShortcutItem = {
  id: SectionId;
  label: string;
};

const SHORTCUT_ITEMS:
  ShortcutItem[] = [
    {
      id: "projects",
      label: "Projects",
    },
    {
      id: "credits",
      label: "Credits",
    },
    {
      id: "about",
      label: "About Me",
    },
  ];

export default function SceneShortcutNav({
  disabled = false,
  onSelect,
}: SceneShortcutNavProps) {
  return (
    <motion.nav
      className="adventure-shortcut-nav"
      aria-label="Portfolio navigation"
      initial={{
        opacity: 0,
        y: -18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.48,
        delay: 0.12,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
    >
      <div className="adventure-shortcut-nav__links">
        {SHORTCUT_ITEMS.map(
          (item) => (
            <button
              key={item.id}
              type="button"
              className="adventure-shortcut-nav__button"
              disabled={disabled}
              aria-label={`Open ${item.label}`}
              onClick={() => {
                onSelect(
                  item.id,
                );
              }}
            >
              <span className="adventure-shortcut-nav__label">
                {item.label}
              </span>
            </button>
          ),
        )}
      </div>

      <style jsx global>{`
        .adventure-shortcut-nav {
          position: absolute;

          top: max(
            20px,
            env(
              safe-area-inset-top
            )
          );

          right: clamp(
            20px,
            3vw,
            48px
          );

          z-index: 88;

          display: flex;

          max-width:
            calc(
              100vw - 40px
            );

          align-items: center;
          justify-content: center;

          border:
            1px solid
            rgba(
              232,
              144,
              255,
              0.24
            );

          border-radius: 999px;

          background:
            linear-gradient(
              135deg,
              rgba(
                37,
                15,
                57,
                0.94
              ),
              rgba(
                14,
                9,
                35,
                0.94
              )
            );

          box-shadow:
            0 0 0 1px
              rgba(
                255,
                255,
                255,
                0.035
              )
              inset,
            0 0 30px
              rgba(
                255,
                80,
                179,
                0.13
              ),
            0 18px 48px
              rgba(
                0,
                0,
                0,
                0.42
              );

          padding:
            0 13px;

          color: #fff7fd;

          pointer-events: auto;

          backdrop-filter:
            blur(18px)
            saturate(1.25);
        }

        .adventure-shortcut-nav__links {
          display: flex;

          align-items: center;

          gap: 4px;
        }

        /*
         * Plain navigation-link appearance.
         *
         * There is no individual pill, heart, border, or
         * active-hotspot highlighting.
         */
        .adventure-shortcut-nav__button {
          position: relative;

          display: inline-flex;

          min-height: 58px;

          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 0;
          outline: none;

          background: transparent;

          padding:
            0 17px;

          color:
            rgba(
              255,
              247,
              253,
              0.76
            );

          cursor: pointer;

          font-family:
            var(--font-body),
            Arial,
            sans-serif;

          font-size: 10px;
          font-weight: 850;
          letter-spacing:
            0.075em;

          text-transform:
            uppercase;

          white-space: nowrap;

          transition:
            color 180ms ease;
        }

        /*
         * Animated underline based on the reference.
         */
        .adventure-shortcut-nav__button::after {
          content: "";

          position: absolute;

          right: 17px;
          bottom: 0;
          left: 17px;

          height: 3px;

          border-radius:
            999px 999px 0 0;

          background:
            linear-gradient(
              90deg,
              #b96dff,
              #ff4fa9
            );

          box-shadow:
            0 0 12px
              rgba(
                255,
                79,
                169,
                0.48
              );

          opacity: 0;

          transform:
            scaleX(0);

          transform-origin:
            center;

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

        .adventure-shortcut-nav__button:hover:not(
            :disabled
          ),
        .adventure-shortcut-nav__button:focus-visible {
          color: #ff8acb;
        }

        .adventure-shortcut-nav__button:hover:not(
            :disabled
          )::after,
        .adventure-shortcut-nav__button:focus-visible::after {
          opacity: 1;

          transform:
            scaleX(1);
        }

        .adventure-shortcut-nav__button:focus-visible {
          outline:
            2px solid
            rgba(
              105,
              223,
              255,
              0.9
            );

          outline-offset:
            -5px;
        }

        .adventure-shortcut-nav__button:disabled {
          cursor: default;

          opacity: 0.42;
        }

        @media (
          max-width: 767px
        ) {
          .adventure-shortcut-nav {
            top: max(
              10px,
              env(
                safe-area-inset-top
              )
            );

            right: 10px;
            left: 10px;

            max-width: none;

            overflow-x: auto;

            padding:
              0 5px;

            scrollbar-width:
              none;
          }

          .adventure-shortcut-nav::-webkit-scrollbar {
            display: none;
          }

          .adventure-shortcut-nav__links {
            width: 100%;

            justify-content: center;
          }

          .adventure-shortcut-nav__button {
            min-height: 48px;

            flex:
              1 1 0;

            padding:
              0 8px;

            font-size: 9px;
          }

          .adventure-shortcut-nav__button::after {
            right: 9px;
            left: 9px;

            height: 2px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .adventure-shortcut-nav__button,
          .adventure-shortcut-nav__button::after {
            transition-duration:
              0.01ms !important;
          }
        }
      `}</style>
    </motion.nav>
  );
}