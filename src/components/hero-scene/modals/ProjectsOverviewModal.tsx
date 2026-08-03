"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import type {
  ProjectCaseStudy,
  ProjectId,
} from "../types";

import {
  PROJECT_CASE_STUDIES,
} from "../portfolioData";

import SceneReturnButton from "./SceneReturnButton";

type ProjectsOverviewModalProps = {
  open: boolean;
  onClose: () => void;
  onProjectSelect: (
    id: ProjectId,
  ) => void;
};

export default function ProjectsOverviewModal({
  open,
  onClose,
  onProjectSelect,
}: ProjectsOverviewModalProps) {
  const reduceMotion =
    useReducedMotion();

  const returnButtonRef =
    useRef<HTMLButtonElement | null>(
      null,
    );

  const projects =
    Object.values(
      PROJECT_CASE_STUDIES,
    ) as ProjectCaseStudy[];

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    const focusTimer =
      window.setTimeout(() => {
        returnButtonRef.current?.focus();
      }, 100);

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      window.clearTimeout(
        focusTimer,
      );
    };
  }, [
    onClose,
    open,
  ]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className="adventure-project-index-backdrop"
          role="presentation"
          initial={{
            opacity: 0,
            backdropFilter:
              "blur(0px)",
          }}
          animate={{
            opacity: 1,
            backdropFilter:
              "blur(16px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter:
              "blur(0px)",
          }}
          transition={{
            duration: reduceMotion
              ? 0.12
              : 0.32,
          }}
          onClick={onClose}
        >
          <motion.article
            className="adventure-project-index-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="adventure-project-index-title"
            initial={
              reduceMotion
                ? {
                    opacity: 0,
                  }
                : {
                    opacity: 0,
                    scale: 0.95,
                    y: 42,
                    borderRadius: 36,
                    clipPath:
                      "inset(6% 6% 6% 6% round 36px)",
                  }
            }
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              borderRadius: 0,
              clipPath:
                "inset(0% 0% 0% 0% round 0px)",
            }}
            exit={
              reduceMotion
                ? {
                    opacity: 0,
                  }
                : {
                    opacity: 0,
                    scale: 0.95,
                    y: 34,
                    borderRadius: 36,
                    clipPath:
                      "inset(6% 6% 6% 6% round 36px)",
                  }
            }
            transition={
              reduceMotion
                ? {
                    duration: 0.12,
                  }
                : {
                    opacity: {
                      duration: 0.25,
                    },
                    scale: {
                      type: "spring",
                      stiffness: 230,
                      damping: 28,
                      mass: 0.9,
                    },
                    y: {
                      type: "spring",
                      stiffness: 230,
                      damping: 28,
                      mass: 0.9,
                    },
                    borderRadius: {
                      duration: 0.55,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    },
                    clipPath: {
                      duration: 0.62,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    },
                  }
            }
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <SceneReturnButton
              buttonRef={
                returnButtonRef
              }
              onClick={onClose}
              ariaLabel="Return to the 3D model from Projects"
            />

            <motion.div
              className="adventure-project-index-body"
              initial={
                reduceMotion
                  ? {
                      opacity: 0,
                    }
                  : {
                      opacity: 0,
                      y: 22,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 12,
              }}
              transition={{
                duration: reduceMotion
                  ? 0.12
                  : 0.48,
                delay: reduceMotion
                  ? 0
                  : 0.16,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <header className="adventure-project-index-header">
                <p>
                  Selected work
                </p>

                <h2 id="adventure-project-index-title">
                  Projects
                </h2>

                <strong>
                  Fullstack · Embedded
                  · Creative Development
                </strong>

                <p className="adventure-project-index-intro">
                  Explore applications,
                  experiments, embedded
                  systems, and production
                  work. Select a project
                  to open its full case
                  study.
                </p>
              </header>

              <section
                className="adventure-project-index-grid"
                aria-label="Project list"
              >
                {projects.map(
                  (
                    project,
                    index,
                  ) => {
                    const coverImage =
                      project.images[0];

                    return (
                      <motion.button
                        key={project.id}
                        type="button"
                        className="adventure-project-index-card"
                        onClick={() => {
                          onProjectSelect(
                            project.id,
                          );
                        }}
                        whileHover={{
                          y: -6,
                          scale: 1.012,
                        }}
                        whileTap={{
                          scale: 0.985,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 340,
                          damping: 26,
                        }}
                      >
                        <div className="adventure-project-index-image-wrap">
                          {coverImage ? (
                            <img
                              src={
                                coverImage
                              }
                              alt=""
                              className="adventure-project-index-image"
                            />
                          ) : (
                            <div className="adventure-project-index-placeholder">
                              <span>
                                ♥
                              </span>
                            </div>
                          )}

                          <span className="adventure-project-index-number">
                            {String(
                              index + 1,
                            ).padStart(
                              2,
                              "0",
                            )}
                          </span>
                        </div>

                        <div className="adventure-project-index-copy">
                          <p>
                            {
                              project.type
                            }
                          </p>

                          <h3>
                            {
                              project.title
                            }
                          </h3>

                          <span className="adventure-project-index-summary">
                            {
                              project.summary
                            }
                          </span>

                          <div className="adventure-project-index-tags">
                            {project.technologies
                              .slice(
                                0,
                                4,
                              )
                              .map(
                                (
                                  technology,
                                ) => (
                                  <span
                                    key={
                                      technology
                                    }
                                  >
                                    {
                                      technology
                                    }
                                  </span>
                                ),
                              )}
                          </div>

                          <strong className="adventure-project-index-open">
                            Open case study

                            <span
                              aria-hidden="true"
                            >
                              →
                            </span>
                          </strong>
                        </div>
                      </motion.button>
                    );
                  },
                )}
              </section>
            </motion.div>
          </motion.article>

          <style jsx global>{`
            .adventure-project-index-backdrop {
              position: fixed;
              inset: 0;
              z-index: 220;

              display: grid;

              background:
                rgba(
                  4,
                  2,
                  12,
                  0.76
                );

              place-items: center;
            }

            .adventure-project-index-modal {
              position: absolute;
              inset: 0;

              overflow: hidden;

              background:
                radial-gradient(
                  circle at 82% 14%,
                  rgba(
                    255,
                    75,
                    174,
                    0.16
                  ),
                  transparent 32%
                ),
                radial-gradient(
                  circle at 15% 86%,
                  rgba(
                    140,
                    91,
                    255,
                    0.14
                  ),
                  transparent 36%
                ),
                linear-gradient(
                  145deg,
                  #160b24,
                  #080713 58%,
                  #11091d
                );

              color: #fff7fd;
            }

            .adventure-project-index-body {
              width: 100%;
              height: 100%;

              box-sizing: border-box;

              overflow-x: hidden;
              overflow-y: auto;

              padding:
                clamp(
                  92px,
                  11vh,
                  132px
                )
                clamp(
                  22px,
                  6vw,
                  96px
                )
                80px;

              scrollbar-color:
                #ff68b7
                transparent;
            }

            .adventure-project-index-header {
              width: min(
                850px,
                100%
              );

              margin:
                0 auto
                clamp(
                  34px,
                  6vh,
                  64px
                );

              text-align: center;
            }

            .adventure-project-index-header
              > p:first-child {
              margin: 0 0 12px;

              color: #ff79bf;

              font-size: 10px;
              font-weight: 900;

              letter-spacing: 0.18em;
              text-transform: uppercase;
            }

            .adventure-project-index-header
              h2 {
              margin: 0;

              font-family:
                var(
                  --font-display
                ),
                Arial,
                sans-serif;

              font-size: clamp(
                3rem,
                8vw,
                7rem
              );

              font-weight: 880;
              letter-spacing: -0.065em;
              line-height: 0.92;
            }

            .adventure-project-index-header
              > strong {
              display: block;

              margin-top: 20px;

              color: #e5b5ff;

              font-size: clamp(
                0.72rem,
                1.2vw,
                0.92rem
              );

              letter-spacing: 0.08em;
              text-transform: uppercase;
            }

            .adventure-project-index-intro {
              max-width: 620px;

              margin: 20px auto 0;

              color:
                rgba(
                  244,
                  238,
                  255,
                  0.72
                );

              font-size: clamp(
                0.92rem,
                1.4vw,
                1.06rem
              );

              line-height: 1.75;
            }

            .adventure-project-index-grid {
              display: grid;

              width: min(
                1320px,
                100%
              );

              grid-template-columns:
                repeat(
                  3,
                  minmax(
                    0,
                    1fr
                  )
                );

              gap: clamp(
                16px,
                2.2vw,
                30px
              );

              margin: 0 auto;
            }

            .adventure-project-index-card {
              display: flex;
              min-width: 0;
              flex-direction: column;

              overflow: hidden;

              border:
                1px solid
                rgba(
                  232,
                  144,
                  255,
                  0.2
                );

              border-radius: 24px;
              outline: none;

              background:
                linear-gradient(
                  145deg,
                  rgba(
                    37,
                    15,
                    57,
                    0.92
                  ),
                  rgba(
                    13,
                    9,
                    31,
                    0.94
                  )
                );

              box-shadow:
                0 22px 60px
                rgba(
                  0,
                  0,
                  0,
                  0.34
                );

              padding: 0;

              color: #fff7fd;
              cursor: pointer;
              text-align: left;

              transition:
                border-color
                  180ms ease,
                box-shadow
                  180ms ease;
            }

            .adventure-project-index-card:hover {
              border-color:
                rgba(
                  255,
                  112,
                  194,
                  0.56
                );

              box-shadow:
                0 0 30px
                  rgba(
                    255,
                    75,
                    174,
                    0.16
                  ),
                0 28px 70px
                  rgba(
                    0,
                    0,
                    0,
                    0.46
                  );
            }

            .adventure-project-index-card:focus-visible {
              outline: 3px solid
                #69dfff;

              outline-offset: 4px;
            }

            .adventure-project-index-image-wrap {
              position: relative;

              aspect-ratio: 16 / 10;
              overflow: hidden;

              background: #100b1e;
            }

            .adventure-project-index-image {
              display: block;

              width: 100%;
              height: 100%;

              object-fit: cover;

              transition:
                filter 380ms ease,
                transform 380ms ease;
            }

            .adventure-project-index-card:hover
              .adventure-project-index-image {
              filter:
                saturate(1.12)
                brightness(1.05);

              transform: scale(1.045);
            }

            .adventure-project-index-placeholder {
              display: grid;

              width: 100%;
              height: 100%;

              background:
                radial-gradient(
                  circle,
                  rgba(
                    255,
                    102,
                    188,
                    0.24
                  ),
                  transparent 65%
                );

              color: #ff78c1;
              font-size: 35px;

              place-items: center;
            }

            .adventure-project-index-number {
              position: absolute;
              top: 14px;
              left: 14px;

              display: inline-flex;

              min-width: 38px;
              min-height: 27px;

              align-items: center;
              justify-content: center;

              border:
                1px solid
                rgba(
                  255,
                  255,
                  255,
                  0.18
                );

              border-radius: 999px;

              background:
                rgba(
                  14,
                  8,
                  28,
                  0.74
                );

              color: #ff8acb;

              font-size: 9px;
              font-weight: 900;

              backdrop-filter: blur(10px);
            }

            .adventure-project-index-copy {
              display: flex;

              min-height: 260px;
              flex: 1;
              flex-direction: column;

              padding: 24px;
            }

            .adventure-project-index-copy
              > p {
              margin: 0 0 8px;

              color: #ff79bf;

              font-size: 8px;
              font-weight: 900;

              letter-spacing: 0.11em;
              text-transform: uppercase;
            }

            .adventure-project-index-copy
              h3 {
              margin: 0;

              font-family:
                var(
                  --font-display
                ),
                Arial,
                sans-serif;

              font-size: clamp(
                1.25rem,
                2vw,
                1.65rem
              );

              line-height: 1.08;
            }

            .adventure-project-index-summary {
              display: -webkit-box;

              margin-top: 14px;
              overflow: hidden;

              color:
                rgba(
                  244,
                  238,
                  255,
                  0.68
                );

              font-size: 12px;
              line-height: 1.65;

              -webkit-box-orient:
                vertical;

              -webkit-line-clamp: 4;
            }

            .adventure-project-index-tags {
              display: flex;
              flex-wrap: wrap;

              gap: 6px;
              margin-top: 18px;
            }

            .adventure-project-index-tags
              span {
              border:
                1px solid
                rgba(
                  232,
                  144,
                  255,
                  0.18
                );

              border-radius: 999px;

              background:
                rgba(
                  154,
                  92,
                  255,
                  0.08
                );

              padding: 5px 8px;

              color:
                rgba(
                  255,
                  241,
                  251,
                  0.72
                );

              font-size: 8px;
              font-weight: 800;
            }

            .adventure-project-index-open {
              display: inline-flex;

              align-items: center;
              justify-content:
                space-between;

              gap: 12px;

              margin-top: auto;
              padding-top: 22px;

              color: #ff86c8;

              font-size: 10px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }

            .adventure-project-index-open
              span {
              font-size: 17px;

              transition:
                transform
                  180ms ease;
            }

            .adventure-project-index-card:hover
              .adventure-project-index-open
              span {
              transform:
                translateX(4px);
            }

            @media (
              max-width: 980px
            ) {
              .adventure-project-index-grid {
                grid-template-columns:
                  repeat(
                    2,
                    minmax(
                      0,
                      1fr
                    )
                  );
              }
            }

            @media (
              max-width: 620px
            ) {
              .adventure-project-index-body {
                padding:
                  92px
                  14px
                  54px;
              }

              .adventure-project-index-grid {
                grid-template-columns:
                  1fr;
              }

              .adventure-project-index-copy {
                min-height: 235px;
                padding: 20px;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}