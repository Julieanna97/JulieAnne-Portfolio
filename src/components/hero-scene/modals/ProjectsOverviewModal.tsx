"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
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

const PROJECT_FILTERS = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "fullstack",
    label: "Fullstack",
  },
  {
    id: "embedded",
    label: "Embedded",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
  },
  {
    id: "wordpress",
    label: "WordPress",
  },
  {
    id: "backend",
    label: "Backend / API",
  },
] as const;

type ProjectFilterId =
  (typeof PROJECT_FILTERS)[number]["id"];

function getProjectFilterIds(
  project: ProjectCaseStudy,
): ProjectFilterId[] {
  const searchableText = [
    project.title,
    project.type,
    project.role,
    project.summary,
    ...(Array.isArray(
      project.technologies,
    )
      ? project.technologies
      : []),
  ]
    .join(" ")
    .toLowerCase();

  const filters =
    new Set<ProjectFilterId>(["all"]);

  if (
    searchableText.includes(
      "embedded",
    ) ||
    searchableText.includes(
      "robotics",
    ) ||
    searchableText.includes(
      "arduino",
    ) ||
    searchableText.includes(
      "autonomous",
    )
  ) {
    filters.add("embedded");
  }

  if (
    searchableText.includes(
      "e-commerce",
    ) ||
    searchableText.includes(
      "ecommerce",
    ) ||
    searchableText.includes(
      "woocommerce",
    ) ||
    searchableText.includes(
      "store",
    ) ||
    searchableText.includes(
      "shopping",
    ) ||
    searchableText.includes(
      "stripe",
    )
  ) {
    filters.add("ecommerce");
  }

  if (
    searchableText.includes(
      "wordpress",
    ) ||
    searchableText.includes(
      "woocommerce",
    ) ||
    searchableText.includes(
      "php",
    )
  ) {
    filters.add("wordpress");
  }

  if (
    searchableText.includes(
      "backend",
    ) ||
    searchableText.includes(
      "rest api",
    ) ||
    searchableText.includes(
      "api",
    ) ||
    searchableText.includes(
      "fastapi",
    ) ||
    searchableText.includes(
      "express",
    )
  ) {
    filters.add("backend");
  }

  if (
    searchableText.includes(
      "fullstack",
    ) ||
    searchableText.includes(
      "next.js",
    ) ||
    searchableText.includes(
      "react",
    ) ||
    searchableText.includes(
      "mongodb",
    ) ||
    searchableText.includes(
      "mysql",
    ) ||
    searchableText.includes(
      "node.js",
    )
  ) {
    filters.add("fullstack");
  }

  return Array.from(filters);
}

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

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<ProjectFilterId>(
    "all",
  );

  const projects =
    useMemo(
      () =>
        Object.values(
          PROJECT_CASE_STUDIES,
        ) as ProjectCaseStudy[],
      [],
    );

  const filteredProjects =
    useMemo(() => {
      if (activeFilter === "all") {
        return projects;
      }

      return projects.filter((project) =>
        getProjectFilterIds(
          project,
        ).includes(activeFilter),
      );
    }, [
      activeFilter,
      projects,
    ]);

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
  }, [onClose, open]);

  useEffect(() => {
    if (!open) {
      setActiveFilter("all");
    }
  }, [open]);

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
            className="adventure-project-index-modal adventure-project-index-modal--archive"
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
              <div className="adventure-project-archive-shell">
                <header className="adventure-project-index-header adventure-project-index-header--archive">
                  <p>
                    Selected work
                  </p>

                  <h2 id="adventure-project-index-title">
                    Projects
                  </h2>

                  <span className="adventure-project-index-subtitle">
                    Archive
                  </span>

                  <p className="adventure-project-index-intro">
                    A collection of
                    fullstack apps,
                    embedded systems,
                    e-commerce builds,
                    and creative
                    development work.
                    Choose a project to
                    open its full case
                    study.
                  </p>
                </header>

                <section className="adventure-project-filter-bar">
                  <div
                    className="adventure-project-filter-row"
                    aria-label="Project filters"
                    role="tablist"
                  >
                    {PROJECT_FILTERS.map(
                      (
                        filter,
                      ) => {
                        const isActive =
                          activeFilter ===
                          filter.id;

                        return (
                          <button
                            key={filter.id}
                            type="button"
                            role="tab"
                            aria-selected={
                              isActive
                            }
                            className={[
                              "adventure-project-filter-tab",
                              isActive
                                ? "is-active"
                                : "",
                            ]
                              .filter(
                                Boolean,
                              )
                              .join(" ")}
                            onClick={() => {
                              setActiveFilter(
                                filter.id,
                              );
                            }}
                          >
                            {
                              filter.label
                            }
                          </button>
                        );
                      },
                    )}
                  </div>

                  <p className="adventure-project-filter-status">
                    Showing{" "}
                    <strong>
                      {
                        filteredProjects.length
                      }
                    </strong>{" "}
                    of{" "}
                    <strong>
                      {projects.length}
                    </strong>{" "}
                    projects
                  </p>
                </section>

                <section
                  className="adventure-project-archive-grid"
                  aria-label="Project list"
                >
                  {filteredProjects.length >
                  0 ? (
                    filteredProjects.map(
                      (
                        project,
                        index,
                      ) => {
                        const coverImage =
                          project
                            .images?.[0];

                        const projectFilters =
                          getProjectFilterIds(
                            project,
                          ).filter(
                            (
                              id,
                            ) =>
                              id !==
                              "all",
                          );

                        return (
                          <motion.button
                            key={
                              project.id
                            }
                            type="button"
                            className="adventure-project-archive-card"
                            onClick={() => {
                              onProjectSelect(
                                project.id,
                              );
                            }}
                            whileHover={
                              reduceMotion
                                ? undefined
                                : {
                                    y: -6,
                                    scale:
                                      1.01,
                                  }
                            }
                            whileTap={
                              reduceMotion
                                ? undefined
                                : {
                                    scale:
                                      0.99,
                                  }
                            }
                            transition={{
                              type: "spring",
                              stiffness: 340,
                              damping: 28,
                            }}
                            aria-label={`Open case study for ${project.title}`}
                          >
                            <div className="adventure-project-archive-image-wrap">
                              {coverImage ? (
                                <img
                                  src={
                                    coverImage
                                  }
                                  alt={`${project.title} preview`}
                                  className="adventure-project-archive-image"
                                />
                              ) : (
                                <div className="adventure-project-archive-placeholder">
                                  <span>
                                    JA
                                  </span>
                                </div>
                              )}

                              <span className="adventure-project-archive-number">
                                {String(
                                  index +
                                    1,
                                ).padStart(
                                  2,
                                  "0",
                                )}
                              </span>
                            </div>

                            <div className="adventure-project-archive-copy">
                              <div className="adventure-project-archive-meta">
                                <span>
                                  {
                                    project.period
                                  }
                                </span>

                                <strong>
                                  {
                                    project.role
                                  }
                                </strong>
                              </div>

                              <p className="adventure-project-archive-type">
                                {
                                  project.type
                                }
                              </p>

                              <h3>
                                {
                                  project.title
                                }
                              </h3>

                              <p className="adventure-project-archive-summary">
                                {
                                  project.summary
                                }
                              </p>

                              <div className="adventure-project-archive-tags">
                                {projectFilters
                                  .slice(
                                    0,
                                    2,
                                  )
                                  .map(
                                    (
                                      filterId,
                                    ) => {
                                      const filterLabel =
                                        PROJECT_FILTERS.find(
                                          (
                                            item,
                                          ) =>
                                            item.id ===
                                            filterId,
                                        )
                                          ?.label ??
                                        filterId;

                                      return (
                                        <span
                                          key={
                                            filterId
                                          }
                                        >
                                          {
                                            filterLabel
                                          }
                                        </span>
                                      );
                                    },
                                  )}

                                {project.technologies
                                  .slice(
                                    0,
                                    3,
                                  )
                                  .map(
                                    (
                                      tech,
                                    ) => (
                                      <span
                                        key={
                                          tech
                                        }
                                      >
                                        {
                                          tech
                                        }
                                      </span>
                                    ),
                                  )}
                              </div>

                              <strong className="adventure-project-archive-open">
                                Open case study
                                <span aria-hidden="true">
                                  →
                                </span>
                              </strong>
                            </div>
                          </motion.button>
                        );
                      },
                    )
                  ) : (
                    <div className="adventure-project-empty-state">
                      <p>
                        No projects are
                        currently shown
                        for this filter.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </motion.div>
          </motion.article>

          <style jsx global>{`
            .adventure-project-index-backdrop {
              position: fixed;
              inset: 0;
              z-index: 220;

              display: grid;

              background: rgba(
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
            }

            .adventure-project-index-modal--archive {
              color: #f4eeff;

              background:
                radial-gradient(
                  circle at 88% 10%,
                  rgba(
                    255,
                    63,
                    159,
                    0.14
                  ),
                  transparent 24%
                ),
                radial-gradient(
                  circle at 8% 90%,
                  rgba(
                    154,
                    92,
                    255,
                    0.18
                  ),
                  transparent 30%
                ),
                radial-gradient(
                  circle at 52% 110%,
                  rgba(
                    105,
                    223,
                    255,
                    0.07
                  ),
                  transparent 28%
                ),
                linear-gradient(
                  180deg,
                  #0b081a 0%,
                  #080612 48%,
                  #03030a 100%
                );
            }

            .adventure-project-index-modal--archive::before {
              content: "";

              position: absolute;
              inset:
                0
                0
                auto
                0;
              z-index: 0;

              height: 8px;

              background: linear-gradient(
                90deg,
                #9a5cff,
                #ff4fb1,
                #ff8ec9,
                #69dfff
              );

              box-shadow:
                0 0 24px
                  rgba(
                    255,
                    79,
                    177,
                    0.34
                  ),
                0 0 46px
                  rgba(
                    154,
                    92,
                    255,
                    0.14
                  );
            }

            .adventure-project-index-body {
              position: relative;
              z-index: 1;

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
                  5vw,
                  78px
                )
                92px;

              scrollbar-color:
                #ff68b7
                transparent;
            }

            .adventure-project-archive-shell {
              width: min(
                100%,
                1320px
              );
              margin: 0 auto;
            }

            .adventure-project-index-header--archive {
              width: min(
                840px,
                100%
              );
              margin:
                0 auto
                clamp(
                  40px,
                  6vh,
                  72px
                );

              text-align: center;
            }

            .adventure-project-index-header--archive
              > p:first-child {
              margin: 0;

              color: #ff91c7;

              font-size: 12px;
              font-weight: 900;
              letter-spacing: 0.18em;
              text-transform: uppercase;
            }

            .adventure-project-index-header--archive
              h2 {
              margin:
                76px 0 0;

              color: #f4eeff;

              font-family:
                var(
                  --font-display
                ),
                Arial,
                sans-serif;
              font-size: clamp(
                3.3rem,
                8vw,
                7.2rem
              );
              font-weight: 880;
              letter-spacing: -0.07em;
              line-height: 0.92;

              text-shadow:
                0 0 28px
                  rgba(
                    255,
                    63,
                    159,
                    0.12
                  ),
                0 0 46px
                  rgba(
                    154,
                    92,
                    255,
                    0.08
                  );
            }

            .adventure-project-index-subtitle {
              display: block;

              margin-top: 18px;

              color: rgba(
                244,
                238,
                255,
                0.48
              );

              font-size: 12px;
              font-weight: 800;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }

            .adventure-project-index-intro {
              max-width: 760px;

              margin:
                28px auto 0;

              color: rgba(
                244,
                238,
                255,
                0.74
              );

              font-size: 15px;
              line-height: 1.85;
            }

            .adventure-project-filter-bar {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 16px;

              margin-bottom: 52px;
            }

            .adventure-project-filter-row {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 12px 14px;
            }

            .adventure-project-filter-tab {
              border: none;
              border-bottom: 2px solid
                transparent;

              background: transparent;
              padding:
                6px
                4px
                10px;

              color: rgba(
                202,
                168,
                255,
                0.72
              );

              font-family: inherit;
              font-size: clamp(
                0.95rem,
                1.5vw,
                1.18rem
              );
              font-weight: 800;
              letter-spacing: 0.01em;

              cursor: pointer;
              transition:
                color 180ms ease,
                border-color
                  180ms ease,
                text-shadow
                  180ms ease;
            }

            .adventure-project-filter-tab:hover,
            .adventure-project-filter-tab:focus-visible {
              color: #f4eeff;
            }

            .adventure-project-filter-tab.is-active {
              border-bottom-color:
                #ff68b7;

              color: #ff9ed0;

              text-shadow:
                0 0 16px
                  rgba(
                    255,
                    99,
                    180,
                    0.28
                  );
            }

            .adventure-project-filter-status {
              margin: 0;

              color: rgba(
                244,
                238,
                255,
                0.62
              );

              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.06em;
              text-transform: uppercase;
            }

            .adventure-project-filter-status
              strong {
              color: #f4eeff;
            }

            .adventure-project-archive-grid {
              display: grid;
              grid-template-columns:
                repeat(
                  2,
                  minmax(0, 1fr)
                );
              gap:
                32px
                36px;
            }

            .adventure-project-archive-card {
              display: flex;
              flex-direction: column;

              border:
                1px solid
                rgba(
                  232,
                  144,
                  255,
                  0.16
                );
              border-radius: 28px;

              background:
                radial-gradient(
                  circle at 100% 0,
                  rgba(
                    154,
                    92,
                    255,
                    0.18
                  ),
                  transparent 42%
                ),
                linear-gradient(
                  145deg,
                  rgba(
                    31,
                    21,
                    61,
                    0.9
                  ),
                  rgba(
                    11,
                    8,
                    28,
                    0.94
                  )
                );

              padding: 0;

              color: inherit;
              text-align: left;

              box-shadow:
                0 16px 42px
                  rgba(
                    0,
                    0,
                    0,
                    0.26
                  );

              cursor: pointer;
              overflow: hidden;

              transition:
                border-color
                  180ms ease,
                box-shadow
                  180ms ease,
                transform 180ms ease;
            }

            .adventure-project-archive-card:hover,
            .adventure-project-archive-card:focus-visible {
              border-color: rgba(
                255,
                104,
                183,
                0.46
              );

              box-shadow:
                0 0 28px
                  rgba(
                    255,
                    63,
                    159,
                    0.14
                  ),
                0 20px 46px
                  rgba(
                    0,
                    0,
                    0,
                    0.32
                  );
            }

            .adventure-project-archive-image-wrap {
              position: relative;
              overflow: hidden;

              aspect-ratio: 16 / 9;

              background:
                rgba(
                  255,
                  255,
                  255,
                  0.04
                );
            }

            .adventure-project-archive-image-wrap::after {
              content: "";

              position: absolute;
              inset: 0;

              background:
                linear-gradient(
                  180deg,
                  transparent 58%,
                  rgba(
                    8,
                    5,
                    20,
                    0.16
                  ) 100%
                );

              pointer-events: none;
            }

            .adventure-project-archive-image {
              width: 100%;
              height: 100%;

              object-fit: cover;
              display: block;

              transition:
                transform 280ms
                  ease;
            }

            .adventure-project-archive-card:hover
              .adventure-project-archive-image {
              transform: scale(
                1.025
              );
            }

            .adventure-project-archive-placeholder {
              display: grid;
              width: 100%;
              height: 100%;

              place-items: center;

              background:
                linear-gradient(
                  135deg,
                  rgba(
                    154,
                    92,
                    255,
                    0.18
                  ),
                  rgba(
                    255,
                    63,
                    159,
                    0.12
                  )
                );
            }

            .adventure-project-archive-placeholder
              span {
              color: #f4eeff;

              font-size: 2rem;
              font-weight: 900;
              letter-spacing: -0.05em;
            }

            .adventure-project-archive-number {
              position: absolute;
              left: 16px;
              bottom: 16px;
              z-index: 1;

              border:
                1px solid
                rgba(
                  255,
                  255,
                  255,
                  0.22
                );
              border-radius: 999px;

              background: rgba(
                13,
                9,
                31,
                0.74
              );

              padding:
                8px
                12px;

              color: #f4eeff;

              font-size: 11px;
              font-weight: 900;
              letter-spacing: 0.08em;

              backdrop-filter:
                blur(10px);
            }

            .adventure-project-archive-copy {
              display: flex;
              flex-direction: column;
              gap: 14px;

              padding:
                22px
                22px
                24px;
            }

            .adventure-project-archive-meta {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              gap: 10px;

              color: rgba(
                244,
                238,
                255,
                0.55
              );

              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.07em;
              text-transform: uppercase;
            }

            .adventure-project-archive-meta
              strong {
              color: #ff9ed0;
              font-weight: 800;
            }

            .adventure-project-archive-type {
              margin: 0;

              color: #ff7ebf;

              font-size: 11px;
              font-weight: 900;
              letter-spacing: 0.1em;
              text-transform: uppercase;
            }

            .adventure-project-archive-copy
              h3 {
              margin: 0;

              color: #f4eeff;

              font-family:
                var(
                  --font-display
                ),
                Arial,
                sans-serif;
              font-size: clamp(
                1.55rem,
                2.2vw,
                2.15rem
              );
              line-height: 1.08;
              letter-spacing: -0.04em;
            }

            .adventure-project-archive-summary {
              margin: 0;

              color: rgba(
                244,
                238,
                255,
                0.78
              );

              font-size: 14px;
              line-height: 1.8;

              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .adventure-project-archive-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;

              margin-top: 2px;
            }

            .adventure-project-archive-tags
              span {
              border:
                1px solid
                rgba(
                  232,
                  144,
                  255,
                  0.2
                );
              border-radius: 999px;

              background:
                linear-gradient(
                  120deg,
                  rgba(
                    154,
                    92,
                    255,
                    0.12
                  ),
                  rgba(
                    255,
                    63,
                    159,
                    0.06
                  )
                );

              padding:
                7px
                11px;

              color: rgba(
                244,
                238,
                255,
                0.84
              );

              font-size: 11px;
              font-weight: 700;
            }

            .adventure-project-archive-open {
              display: inline-flex;
              align-items: center;
              gap: 8px;

              margin-top: 4px;

              color: #f4eeff;

              font-size: 13px;
              font-weight: 900;
              letter-spacing: 0.03em;
            }

            .adventure-project-archive-open
              span {
              color: #69dfff;
            }

            .adventure-project-empty-state {
              grid-column: 1 / -1;

              border:
                1px solid
                rgba(
                  232,
                  144,
                  255,
                  0.16
                );
              border-radius: 24px;

              background:
                rgba(
                  18,
                  12,
                  40,
                  0.72
                );

              padding: 32px;

              text-align: center;
              color: rgba(
                244,
                238,
                255,
                0.72
              );
            }

            .adventure-project-index-modal--archive
              ::selection {
              background: rgba(
                255,
                104,
                183,
                0.34
              );
              color: #ffffff;
            }

            .adventure-project-index-modal--archive
              button:focus-visible {
              outline:
                2px solid
                #69dfff;
              outline-offset: 4px;
            }

            @media (max-width: 1100px) {
              .adventure-project-archive-grid {
                gap:
                  28px
                  28px;
              }
            }

            @media (max-width: 900px) {
              .adventure-project-archive-grid {
                grid-template-columns: 1fr;
              }
            }

            @media (max-width: 767px) {
              .adventure-project-index-body {
                padding:
                  88px
                  18px
                  calc(
                    74px +
                      env(
                        safe-area-inset-bottom
                      )
                  );
              }

              .adventure-project-index-header--archive {
                margin-bottom: 42px;
                text-align: left;
              }

              .adventure-project-index-header--archive
                h2 {
                margin-top: 42px;
                font-size: clamp(
                  3rem,
                  16vw,
                  4.9rem
                );
              }

              .adventure-project-index-intro {
                margin-left: 0;
                margin-right: 0;
              }

              .adventure-project-filter-bar {
                align-items: stretch;
                margin-bottom: 34px;
              }

              .adventure-project-filter-row {
                justify-content: flex-start;
                overflow-x: auto;
                flex-wrap: nowrap;
                padding-bottom: 4px;
              }

              .adventure-project-filter-status {
                text-align: left;
              }

              .adventure-project-archive-copy {
                padding:
                  18px
                  18px
                  22px;
              }

              .adventure-project-archive-copy
                h3 {
                font-size: 1.5rem;
              }

              .adventure-project-archive-summary {
                -webkit-line-clamp: 5;
              }
            }

            @media (
              prefers-reduced-motion: reduce
            ) {
              .adventure-project-archive-card,
              .adventure-project-archive-image,
              .adventure-project-filter-tab {
                transition: none;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}