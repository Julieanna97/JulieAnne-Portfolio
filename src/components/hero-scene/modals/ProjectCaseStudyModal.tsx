"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import type { ProjectId } from "../types";
import { PROJECT_CASE_STUDIES } from "../portfolioData";

type ProjectCaseStudyModalProps = {
  projectId: ProjectId | null;
  onClose: () => void;
};

export default function ProjectCaseStudyModal({
  projectId,
  onClose,
}: ProjectCaseStudyModalProps) {
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [
    activeImageIndex,
    setActiveImageIndex,
  ] = useState(0);

  const project = projectId
    ? PROJECT_CASE_STUDIES[projectId]
    : null;

  const safeImageIndex = project
    ? Math.min(
        activeImageIndex,
        Math.max(project.images.length - 1, 0),
      )
    : 0;

  const activeImage =
    project?.images[safeImageIndex];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [projectId, onClose]);

  const panelInitial = reduceMotion
    ? {
        opacity: 0,
      }
    : {
        opacity: 0,
        scale: 0.94,
        y: 44,
        borderRadius: 36,
        clipPath: "inset(7% 7% 7% 7% round 36px)",
      };

  const panelVisible = {
    opacity: 1,
    scale: 1,
    y: 0,
    borderRadius: 0,
    clipPath: "inset(0% 0% 0% 0% round 0px)",
  };

  const panelExit = reduceMotion
    ? {
        opacity: 0,
      }
    : {
        opacity: 0,
        scale: 0.95,
        y: 32,
        borderRadius: 36,
        clipPath: "inset(6% 6% 6% 6% round 36px)",
      };

  return (
    <AnimatePresence mode="wait">
      {project && (
        <motion.div
          key={project.id}
          className="adventure-case-study-backdrop"
          role="presentation"
          initial={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(14px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          transition={{
            duration: reduceMotion ? 0.12 : 0.32,
          }}
          onClick={onClose}
        >
          <motion.article
            className="adventure-case-study-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-title-${project.id}`}
            initial={panelInitial}
            animate={panelVisible}
            exit={panelExit}
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
                      ease: [0.22, 1, 0.36, 1],
                    },
                    clipPath: {
                      duration: 0.62,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }
            }
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="adventure-case-study-close"
              onClick={onClose}
              aria-label="Close case study"
            >
              <span aria-hidden="true">×</span>
            </button>

            <motion.div
              className="adventure-full-view-body"
              initial={
                reduceMotion
                  ? {
                      opacity: 0,
                    }
                  : {
                      opacity: 0,
                      y: 24,
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
                duration: reduceMotion ? 0.12 : 0.48,
                delay: reduceMotion ? 0 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <header className="adventure-case-study-header">
                <p>{project.type}</p>

                <h2 id={`project-title-${project.id}`}>
                  {project.title}
                </h2>

                <p className="adventure-case-study-summary">
                  {project.summary}
                </p>

                <div className="adventure-case-study-meta">
                  <span>
                    <b>Role</b>
                    {project.role}
                  </span>

                  <span>
                    <b>Period</b>
                    {project.period}
                  </span>
                </div>

                {(project.externalUrl ||
                  project.githubUrl) && (
                  <div className="adventure-project-links">
                    {project.externalUrl && (
                      <a
                        className="adventure-project-external-link"
                        href={project.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.externalLabel ??
                          "Open live site ↗"}
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        className="adventure-project-external-link"
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.githubLabel ??
                          "View GitHub repo ↗"}
                      </a>
                    )}
                  </div>
                )}
              </header>

              <div className="adventure-case-study-grid">
                <section className="adventure-case-study-gallery">
                  {activeImage ? (
                    <AnimatePresence
                      mode="wait"
                      initial={false}
                    >
                      <motion.img
                        key={activeImage}
                        src={activeImage}
                        alt={`${project.title} screenshot ${
                          safeImageIndex + 1
                        }`}
                        className="adventure-case-study-main-image"
                        initial={
                          reduceMotion
                            ? {
                                opacity: 0,
                              }
                            : {
                                opacity: 0,
                                scale: 0.97,
                                y: 12,
                              }
                        }
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.98,
                          y: -8,
                        }}
                        transition={{
                          duration: reduceMotion
                            ? 0.12
                            : 0.34,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </AnimatePresence>
                  ) : (
                    <div className="adventure-case-study-empty-gallery">
                      <strong>
                        Screenshots coming soon
                      </strong>

                      <p>
                        Add screenshots for this project inside its folder in{" "}
                        <code>public/projects</code>.
                      </p>
                    </div>
                  )}

                  {project.images.length > 1 && (
                    <div className="adventure-case-study-thumbnails">
                      {project.images.map((image, index) => (
                        <motion.button
                          key={image}
                          type="button"
                          className={
                            safeImageIndex === index
                              ? "is-active"
                              : ""
                          }
                          onClick={() => {
                            setActiveImageIndex(index);
                          }}
                          aria-label={`Show screenshot ${
                            index + 1
                          }`}
                          whileHover={{
                            y: -3,
                          }}
                          whileTap={{
                            scale: 0.96,
                          }}
                        >
                          <img
                            src={image}
                            alt=""
                          />
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {project.video && (
                    <video
                      className="adventure-case-study-video"
                      controls
                      preload="metadata"
                      poster={project.images[0]}
                    >
                      <source
                        src={project.video}
                        type="video/mp4"
                      />

                      Your browser does not support the video tag.
                    </video>
                  )}
                </section>

                <section className="adventure-case-study-content">
                  {project.overview && (
                    <div className="adventure-case-study-section">
                      <p className="adventure-detail-kicker">
                        Project
                      </p>

                      <h3>Overview</h3>

                      <div className="adventure-case-study-overview">
                        {project.overview.map((paragraph) => (
                          <p key={paragraph}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.highlights && (
                    <div className="adventure-case-study-section">
                      <p className="adventure-detail-kicker">
                        Details
                      </p>

                      <h3>Highlights</h3>

                      <div className="adventure-project-highlight-list">
                        {project.highlights.map(
                          (highlight, index) => (
                            <article key={highlight.title}>
                              <span>
                                {String(index + 1).padStart(
                                  2,
                                  "0",
                                )}
                              </span>

                              <div>
                                <h4>{highlight.title}</h4>
                                <p>{highlight.text}</p>
                              </div>
                            </article>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  <div className="adventure-case-study-section">
                    <p className="adventure-detail-kicker">
                      Contribution
                    </p>

                    <h3>What I worked on</h3>

                    <ul>
                      {project.contributions.map(
                        (contribution) => (
                          <li key={contribution}>
                            {contribution}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div className="adventure-case-study-section">
                    <p className="adventure-detail-kicker">
                      Stack
                    </p>

                    <h3>Technologies</h3>

                    <div className="adventure-case-study-tags">
                      {project.technologies.map(
                        (technology) => (
                          <span key={technology}>
                            {technology}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}