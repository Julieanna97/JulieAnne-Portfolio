"use client";

import { useEffect, useState } from "react";
import type { ProjectId } from "../types";
import { PROJECT_CASE_STUDIES } from "../portfolioData";

export default function ProjectCaseStudyModal({
  projectId,
  onClose,
}: {
  projectId:
    | ProjectId
    | null;

  onClose:
    () => void;
}) {
  const [
    activeImageIndex,
    setActiveImageIndex,
  ] =
    useState(
      0
    );

  useEffect(() => {
    setActiveImageIndex(
      0
    );
  }, [
    projectId,
  ]);

  if (
    !projectId
  ) {
    return null;
  }

  const project =
    PROJECT_CASE_STUDIES[
      projectId
    ];

  const activeImage =
    project.images[
      activeImageIndex
    ];

  return (
    <div
      className="adventure-case-study-backdrop"
      role="presentation"
      onClick={
        onClose
      }
    >
      <article
        className="adventure-case-study-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} case study`}
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="adventure-case-study-close"
          onClick={
            onClose
          }
          aria-label="Close case study"
        >
          ×
        </button>

        <header className="adventure-case-study-header">
          <p>
            {
              project.type
            }
          </p>

          <h2>
            {
              project.title
            }
          </h2>

          <div className="adventure-case-study-meta">
            <span>
              <b>
                Role
              </b>

              {
                project.role
              }
            </span>

            <span>
              <b>
                Period
              </b>

              {
                project.period
              }
            </span>
          </div>
        </header>

        <div className="adventure-case-study-grid">
          <section className="adventure-case-study-gallery">
            {activeImage ? (
              <img
                src={
                  activeImage
                }
                alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                className="adventure-case-study-main-image"
              />
            ) : (
              <div className="adventure-case-study-empty-gallery">
                <strong>
                  Screenshots coming soon
                </strong>

                <p>
                  Add PracticePal screenshots inside{" "}
                  <code>
                    public/projects/practicepal
                  </code>{" "}
                  when they are ready.
                </p>
              </div>
            )}

            {project.images.length >
              1 && (
              <div className="adventure-case-study-thumbnails">
                {project.images.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      key={
                        image
                      }
                      type="button"
                      className={
                        activeImageIndex ===
                        index
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setActiveImageIndex(
                          index
                        )
                      }
                      aria-label={`Show screenshot ${index + 1}`}
                    >
                      <img
                        src={
                          image
                        }
                        alt=""
                      />
                    </button>
                  )
                )}
              </div>
            )}

            {project.video && (
              <video
                className="adventure-case-study-video"
                controls
                preload="metadata"
                poster={
                  project.images[
                    0
                  ]
                }
              >
                <source
                  src={
                    project.video
                  }
                  type="video/mp4"
                />

                Your browser does not support the video tag.
              </video>
            )}
          </section>

          <section className="adventure-case-study-content">
            <p className="adventure-case-study-summary">
              {
                project.summary
              }
            </p>

            {(project.externalUrl || project.githubUrl) && (
              <div className="adventure-project-links">
                {project.externalUrl && (
                  <a
                    className="adventure-project-external-link"
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.externalLabel ?? "Open live site ↗"}
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    className="adventure-project-external-link"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.githubLabel ?? "View GitHub repo ↗"}
                  </a>
                )}
              </div>
            )}

            {project.overview && (
              <div>
                <h3>
                  Overview
                </h3>

                <div className="adventure-case-study-overview">
                  {project.overview.map(
                    (
                      paragraph
                    ) => (
                      <p
                        key={
                          paragraph
                        }
                      >
                        {
                          paragraph
                        }
                      </p>
                    )
                  )}
                </div>
              </div>
            )}

            {project.highlights && (
              <div>
                <h3>
                  Highlights
                </h3>

                <div className="adventure-project-highlight-list">
                  {project.highlights.map(
                    (
                      highlight
                    ) => (
                      <article
                        key={
                          highlight.title
                        }
                      >
                        <h4>
                          {
                            highlight.title
                          }
                        </h4>

                        <p>
                          {
                            highlight.text
                          }
                        </p>
                      </article>
                    )
                  )}
                </div>
              </div>
            )}

            <div>
              <h3>
                What I worked on
              </h3>

              <ul>
                {project.contributions.map(
                  (
                    contribution
                  ) => (
                    <li
                      key={
                        contribution
                      }
                    >
                      {
                        contribution
                      }
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3>
                Technologies
              </h3>

              <div className="adventure-case-study-tags">
                {project.technologies.map(
                  (
                    technology
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
                  )
                )}
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
