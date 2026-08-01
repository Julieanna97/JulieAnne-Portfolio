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
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
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
            <motion.button
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
              whileHover={
                disabled
                  ? undefined
                  : {
                      y: -2,
                      scale: 1.035,
                    }
              }
              whileTap={
                disabled
                  ? undefined
                  : {
                      scale: 0.95,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 430,
                damping: 25,
              }}
            >
              <span className="adventure-shortcut-nav__label">
                {item.label}
              </span>

              <span
                className="adventure-shortcut-nav__heart"
                aria-hidden="true"
              >
                ♥
              </span>
            </motion.button>
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
              0.26
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

          padding: 7px;

          color: #fff7fd;

          pointer-events: auto;

          backdrop-filter:
            blur(18px)
            saturate(1.25);
        }

        .adventure-shortcut-nav__links {
          display: flex;

          align-items: center;

          gap: 3px;
        }

        .adventure-shortcut-nav__button {
          position: relative;

          display: inline-flex;

          min-height: 42px;

          align-items: center;
          justify-content: center;

          gap: 7px;

          overflow: hidden;

          border:
            1px solid
            transparent;

          border-radius: 999px;
          outline: none;

          background:
            transparent;

          padding:
            0 18px;

          color:
            rgba(
              255,
              247,
              253,
              0.78
            );

          cursor: pointer;

          font-family:
            var(--font-body),
            Arial,
            sans-serif;

          transition:
            color 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        /*
         * The navigation is standalone.
         *
         * There is intentionally no active style connected
         * to hotspot detection or card selection.
         */
        .adventure-shortcut-nav__button:hover:not(
            :disabled
          ) {
          border-color:
            rgba(
              255,
              118,
              194,
              0.36
            );

          background:
            linear-gradient(
              135deg,
              rgba(
                255,
                85,
                173,
                0.19
              ),
              rgba(
                154,
                92,
                255,
                0.17
              )
            );

          color: #ffffff;

          box-shadow:
            0 0 18px
              rgba(
                255,
                75,
                174,
                0.18
              );
        }

        .adventure-shortcut-nav__button:focus-visible {
          outline:
            2px solid
            #69dfff;

          outline-offset: 3px;
        }

        .adventure-shortcut-nav__button:disabled {
          cursor: default;

          opacity: 0.45;
        }

        .adventure-shortcut-nav__label {
          font-size: 10px;
          font-weight: 850;
          letter-spacing:
            0.075em;

          text-transform:
            uppercase;

          white-space: nowrap;
        }

        .adventure-shortcut-nav__heart {
          display: inline-block;

          max-width: 0;

          overflow: hidden;

          color: #ff82c7;

          font-size: 10px;

          opacity: 0;

          transform:
            translateX(-4px)
            scale(0.5);

          transition:
            max-width 180ms ease,
            opacity 180ms ease,
            transform 180ms ease;
        }

        .adventure-shortcut-nav__button:hover:not(
            :disabled
          )
          .adventure-shortcut-nav__heart,
        .adventure-shortcut-nav__button:focus-visible
          .adventure-shortcut-nav__heart {
          max-width: 16px;

          opacity: 1;

          transform:
            translateX(0)
            scale(1);
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

            padding: 5px;

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
            min-height: 38px;

            flex: 1 1 auto;

            padding:
              0 11px;
          }

          .adventure-shortcut-nav__label {
            font-size: 9px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .adventure-shortcut-nav__button,
          .adventure-shortcut-nav__heart {
            transition-duration:
              0.01ms !important;
          }
        }
      `}</style>
    </motion.nav>
  );
}