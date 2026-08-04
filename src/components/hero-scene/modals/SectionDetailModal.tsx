"use client";

import Image from "next/image";
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

import {
  ABOUT_EXPERIENCE,
  ABOUT_SKILL_GROUPS,
  CREDIT_GROUPS,
} from "@/components/hero-scene/portfolioData";

const ABOUT_PORTRAIT_SRC =
  "/about/julie-anne.jpg";

const ABOUT_NAV_ITEMS = [
  {
    id: "about-profile",
    label: "Profile",
  },
  {
    id: "about-journey",
    label: "Journey",
  },
  {
    id: "about-skills",
    label: "Skills",
  },
  {
    id: "about-contact",
    label: "Contact",
  },
] as const;

type AboutSectionId =
  (typeof ABOUT_NAV_ITEMS)[number]["id"];

const aboutExperienceItems = Array.isArray(
  ABOUT_EXPERIENCE,
)
  ? ABOUT_EXPERIENCE
  : [];

const aboutSkillGroups = Array.isArray(
  ABOUT_SKILL_GROUPS,
)
  ? ABOUT_SKILL_GROUPS
  : [];

const creditGroups = Array.isArray(
  CREDIT_GROUPS,
)
  ? CREDIT_GROUPS
  : [];

type SectionDetailModalProps = {
  detailId: "about" | "credits" | null;
  onClose: () => void;
};

export default function SectionDetailModal({
  detailId,
  onClose,
}: SectionDetailModalProps) {
  const reduceMotion = useReducedMotion();

  const modalRef =
    useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!detailId) {
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
        modalRef.current?.focus();
      }, 100);

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      window.clearTimeout(focusTimer);
    };
  }, [detailId, onClose]);

  const isAbout =
    detailId === "about";

  const titleId = detailId
    ? `section-detail-title-${detailId}`
    : undefined;

  const panelInitial = reduceMotion
    ? {
        opacity: 0,
      }
    : {
        opacity: 0,
        scale: 0.94,
        y: 44,
        borderRadius: 36,
        clipPath:
          "inset(7% 7% 7% 7% round 36px)",
      };

  const panelVisible = {
    opacity: 1,
    scale: 1,
    y: 0,
    borderRadius: 0,
    clipPath:
      "inset(0% 0% 0% 0% round 0px)",
  };

  const panelExit = reduceMotion
    ? {
        opacity: 0,
      }
    : {
        opacity: 0,
        scale: 0.95,
        y: 30,
        borderRadius: 36,
        clipPath:
          "inset(6% 6% 6% 6% round 36px)",
      };

  return (
    <AnimatePresence mode="wait">
      {detailId && (
        <motion.div
          key={detailId}
          className="adventure-section-detail-backdrop"
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
            duration: reduceMotion
              ? 0.12
              : 0.32,
          }}
          onClick={onClose}
        >
          <motion.article
            ref={modalRef}
            tabIndex={-1}
            className={[
              "adventure-section-detail-modal",
              isAbout
                ? "adventure-section-detail-modal--about"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
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
                duration: reduceMotion
                  ? 0.12
                  : 0.48,
                delay: reduceMotion
                  ? 0
                  : 0.18,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              {isAbout ? (
                <AboutDetail
                  titleId={titleId}
                />
              ) : (
                <CreditsDetail
                  titleId={titleId}
                />
              )}
            </motion.div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AboutDetail({
  titleId,
}: {
  titleId?: string;
}) {
  const reduceMotion = useReducedMotion();

  const aboutLayoutRef =
    useRef<HTMLDivElement | null>(null);

  const [
    activeSection,
    setActiveSection,
  ] =
    useState<AboutSectionId>(
      "about-profile",
    );

  useEffect(() => {
    const layout =
      aboutLayoutRef.current;

    const scrollRoot =
      layout?.closest<HTMLElement>(
        ".adventure-section-detail-modal",
      );

    if (!layout || !scrollRoot) {
      return;
    }

    const sections =
      ABOUT_NAV_ITEMS.flatMap(
        ({ id }) => {
          const element =
            layout.querySelector<HTMLElement>(
              `#${id}`,
            );

          return element
            ? [
                {
                  id,
                  element,
                },
              ]
            : [];
        },
      );

    if (sections.length === 0) {
      return;
    }

    let animationFrame = 0;

    const updateActiveSection = () => {
      window.cancelAnimationFrame(
        animationFrame,
      );

      animationFrame =
        window.requestAnimationFrame(
          () => {
            const rootRect =
              scrollRoot.getBoundingClientRect();

            /*
             * A section becomes active after
             * its heading reaches roughly the
             * upper third of the modal.
             */
            const activationLine =
              rootRect.top +
              Math.min(
                rootRect.height * 0.34,
                260,
              );

            let nextSection:
              | AboutSectionId
              | undefined =
              sections[0]?.id;

            for (const section of sections) {
              const sectionRect =
                section.element.getBoundingClientRect();

              if (
                sectionRect.top <=
                activationLine
              ) {
                nextSection =
                  section.id;
              } else {
                break;
              }
            }

            /*
             * Contact should become active
             * when the visitor reaches the
             * very bottom of the modal.
             */
            const isAtBottom =
              scrollRoot.scrollTop +
                scrollRoot.clientHeight >=
              scrollRoot.scrollHeight -
                8;

            if (isAtBottom) {
              nextSection =
                sections[
                  sections.length - 1
                ]?.id;
            }

            if (nextSection) {
              setActiveSection(
                (currentSection) =>
                  currentSection ===
                  nextSection
                    ? currentSection
                    : nextSection,
              );
            }
          },
        );
    };

    updateActiveSection();

    scrollRoot.addEventListener(
      "scroll",
      updateActiveSection,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      updateActiveSection,
    );

    const resizeObserver =
      typeof ResizeObserver !==
      "undefined"
        ? new ResizeObserver(
            updateActiveSection,
          )
        : null;

    resizeObserver?.observe(layout);

    return () => {
      window.cancelAnimationFrame(
        animationFrame,
      );

      scrollRoot.removeEventListener(
        "scroll",
        updateActiveSection,
      );

      window.removeEventListener(
        "resize",
        updateActiveSection,
      );

      resizeObserver?.disconnect();
    };
  }, []);

  const scrollToAboutSection = (
    sectionId: AboutSectionId,
  ) => {
    const layout =
      aboutLayoutRef.current;

    const scrollRoot =
      layout?.closest<HTMLElement>(
        ".adventure-section-detail-modal",
      );

    const section =
      layout?.querySelector<HTMLElement>(
        `#${sectionId}`,
      );

    if (
      !layout ||
      !scrollRoot ||
      !section
    ) {
      return;
    }

    const rootRect =
      scrollRoot.getBoundingClientRect();

    const sectionRect =
      section.getBoundingClientRect();

    const nextScrollTop =
      scrollRoot.scrollTop +
      sectionRect.top -
      rootRect.top -
      36;

    setActiveSection(sectionId);

    scrollRoot.scrollTo({
      top: Math.max(
        0,
        nextScrollTop,
      ),
      behavior: reduceMotion
        ? "auto"
        : "smooth",
    });
  };

  const firstEducationIndex =
    aboutExperienceItems.length + 1;

  return (
    <div
      ref={aboutLayoutRef}
      className="haruni-about-layout"
    >
      <nav
        className="haruni-about-rail"
        aria-label="About page sections"
      >
        {ABOUT_NAV_ITEMS.map(
          (item) => {
            const isActive =
              activeSection === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={
                  isActive
                    ? "is-active"
                    : undefined
                }
                aria-current={
                  isActive
                    ? "location"
                    : undefined
                }
                onClick={(event) => {
                  event.preventDefault();

                  scrollToAboutSection(
                    item.id,
                  );
                }}
              >
                <span
                  className="haruni-about-rail-dot"
                  aria-hidden="true"
                />

                {item.label}
              </a>
            );
          },
        )}
      </nav>

      <div className="haruni-about-content">
        <header className="haruni-about-page-heading">
          <p>About Me</p>

          <h2 id={titleId}>
            Julie Anne
          </h2>

          <span>Profile</span>
        </header>

        <section
          id="about-profile"
          className="haruni-profile-section"
        >
          <div className="haruni-profile-introduction">
            <div className="haruni-profile-photo-column">
              <div className="haruni-profile-photo">
                <Image
                  src={
                    ABOUT_PORTRAIT_SRC
                  }
                  alt="Portrait of Julie Anne Cantillep"
                  fill
                  priority
                  sizes="(max-width: 767px) 88vw, 380px"
                />
              </div>

              <div className="haruni-profile-photo-label">
                <span>Malmö</span>

                <strong>Sweden</strong>
              </div>
            </div>

            <div className="haruni-profile-copy">
              <p className="haruni-section-label">
                Hello
              </p>

              <h3>
                I build software with
                structure, creativity, and
                personality.
              </h3>

              <p>
                I&apos;m Julie Anne, a
                software developer with
                experience in fullstack
                development, embedded
                systems, AI-related work,
                and creative interactive
                interfaces.
              </p>

              <p>
                I enjoy transforming ideas
                into products that feel
                clear and useful while
                still having visual
                character. I care about
                thoughtful design on the
                surface and maintainable
                architecture behind it.
              </p>

              <div className="haruni-profile-tags">
                <span>Fullstack</span>
                <span>Frontend</span>
                <span>Embedded</span>
                <span>AI</span>

                <span>
                  Creative Development
                </span>
              </div>
            </div>
          </div>

          <div className="haruni-profile-overview">
            <div className="haruni-subsection-heading">
              <h3>Profile</h3>

              <span>Overview</span>
            </div>

            <dl className="haruni-profile-table">
              <div>
                <dt>Name</dt>

                <dd>
                  Julie Anne Cantillep
                </dd>
              </div>

              <div>
                <dt>Role</dt>

                <dd>
                  Software Developer
                </dd>
              </div>

              <div>
                <dt>Location</dt>

                <dd>
                  Malmö, Sweden
                </dd>
              </div>

              <div>
                <dt>Focus</dt>

                <dd>
                  Fullstack development,
                  creative frontend,
                  embedded systems, and AI
                </dd>
              </div>

              <div>
                <dt>Approach</dt>

                <dd>
                  Clear structure,
                  thoughtful details,
                  accessible interfaces,
                  and playful interaction
                </dd>
              </div>

              <div>
                <dt>Email</dt>

                <dd>
                  <a href="mailto:kisamae1997@gmail.com">
                    kisamae1997@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          id="about-journey"
          className="haruni-about-section haruni-journey-section"
        >
          <div className="haruni-subsection-heading">
            <h3>My Journey</h3>

            <span>
              Experience &amp; Education
            </span>
          </div>

          <div className="haruni-journey-layout">
            <aside className="haruni-journey-aside">
              <p>Developer</p>

              <strong>JA</strong>

              <span>
                Learning, experimenting,
                and creating one project at
                a time.
              </span>
            </aside>

            <div className="haruni-timeline">
              {aboutExperienceItems.length >
              0 ? (
                aboutExperienceItems.map(
                  (
                    experience,
                    index,
                  ) => {
                    const experiencePoints =
                      Array.isArray(
                        experience.points,
                      )
                        ? experience.points
                        : [];

                    return (
                      <article
                        key={`${experience.company}-${experience.period}`}
                        className="haruni-timeline-entry"
                      >
                        <div className="haruni-timeline-number">
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </div>

                        <div className="haruni-timeline-content">
                          <time>
                            {
                              experience.period
                            }
                          </time>

                          <h4>
                            {
                              experience.role
                            }
                          </h4>

                          <strong>
                            {
                              experience.company
                            }
                          </strong>

                          <p>
                            {
                              experience.summary
                            }
                          </p>

                          {experiencePoints.length >
                            0 && (
                            <ul>
                              {experiencePoints.map(
                                (
                                  point,
                                ) => (
                                  <li
                                    key={
                                      point
                                    }
                                  >
                                    {
                                      point
                                    }
                                  </li>
                                ),
                              )}
                            </ul>
                          )}
                        </div>
                      </article>
                    );
                  },
                )
              ) : (
                <p className="adventure-section-empty-state">
                  Experience details are
                  currently being updated.
                </p>
              )}

              <article className="haruni-timeline-entry">
                <div className="haruni-timeline-number">
                  {String(
                    firstEducationIndex,
                  ).padStart(2, "0")}
                </div>

                <div className="haruni-timeline-content">
                  <time>2026</time>

                  <h4>
                    Fullstack Developer
                  </h4>

                  <strong>
                    The Media Institute
                  </strong>

                  <p>
                    Studied frontend and
                    backend development,
                    databases, e-commerce
                    systems, APIs, and
                    fullstack application
                    architecture.
                  </p>

                  <ul>
                    <li>
                      Frontend, backend,
                      databases, and system
                      development.
                    </li>

                    <li>
                      Projects built with
                      agile methods.
                    </li>

                    <li>
                      E-commerce platforms
                      and fullstack
                      application
                      structure.
                    </li>
                  </ul>
                </div>
              </article>

              <article className="haruni-timeline-entry">
                <div className="haruni-timeline-number">
                  {String(
                    firstEducationIndex +
                      1,
                  ).padStart(2, "0")}
                </div>

                <div className="haruni-timeline-content">
                  <time>2024</time>

                  <h4>
                    Embedded Software
                    Development
                  </h4>

                  <strong>
                    Movant University of
                    Applied Science
                  </strong>

                  <p>
                    Worked with embedded
                    programming, hardware
                    communication,
                    real-time systems, C,
                    C++, and autonomous
                    vehicle development.
                  </p>

                  <ul>
                    <li>
                      Embedded programming,
                      hardware
                      communication, and
                      real-time systems.
                    </li>

                    <li>
                      Led a group project
                      that produced an
                      autonomous car.
                    </li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="about-skills"
          className="haruni-about-section"
        >
          <div className="haruni-subsection-heading">
            <h3>Skills</h3>

            <span>Toolbox</span>
          </div>

          <div className="haruni-skill-list">
            {aboutSkillGroups.length >
            0 ? (
              aboutSkillGroups.map(
                (group, index) => {
                  const groupItems =
                    Array.isArray(
                      group.items,
                    )
                      ? group.items
                      : [];

                  return (
                    <article
                      key={group.title}
                      className="haruni-skill-row"
                    >
                      <span className="haruni-skill-index">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <h4>
                        {group.title}
                      </h4>

                      <div>
                        {groupItems.map(
                          (item) => (
                            <span
                              key={item}
                            >
                              {item}
                            </span>
                          ),
                        )}
                      </div>
                    </article>
                  );
                },
              )
            ) : (
              <p className="adventure-section-empty-state">
                Skill details are
                currently being updated.
              </p>
            )}
          </div>
        </section>

        <section
          id="about-contact"
          className="haruni-about-section haruni-contact-section"
        >
          <div className="haruni-subsection-heading">
            <h3>
              Let&apos;s Connect
            </h3>

            <span>Contact</span>
          </div>

          <p className="haruni-contact-intro">
            Have a project, opportunity,
            or idea in mind? You can reach
            me through any of the links
            below.
          </p>

          <div className="haruni-contact-links">
            <a href="mailto:kisamae1997@gmail.com">
              <span>Email</span>

              <strong>
                kisamae1997@gmail.com
              </strong>
            </a>

            <a
              href="https://www.linkedin.com/in/julie-anne-cantillep-4ba4ab250/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                Professional profile
              </span>

              <strong>
                LinkedIn ↗
              </strong>
            </a>

            <a
              href="https://github.com/Julieanna97"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                Development work
              </span>

              <strong>
                GitHub ↗
              </strong>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

function CreditsDetail({
  titleId,
}: {
  titleId?: string;
}) {
  return (
    <>
      <header className="adventure-section-detail-header">
        <p>Credits</p>

        <h2 id={titleId}>
          Built with care
        </h2>

        <p className="adventure-section-detail-intro">
          I designed and built this
          portfolio as a small interactive
          world rather than a standard
          page. It brings together 3D,
          animation, sound, and the web
          tools I enjoy working with.
        </p>
      </header>

      <section className="adventure-section-block">
        <div className="adventure-section-heading">
          <p>Attribution</p>

          <h3>
            Scene, model &amp; music
            credits
          </h3>
        </div>

        <div className="adventure-detail-grid adventure-detail-grid--three">
          <article className="adventure-detail-card adventure-credit-feature">
            <p className="adventure-detail-kicker">
              Original 3D environment
            </p>

            <h4>
              A Mysterious Adventure — 3D
              Editor Challenge
            </h4>

            <p>
              3D scene by Diosmel, used
              under the Creative Commons
              Attribution 4.0 license.
            </p>
          </article>

          <article className="adventure-detail-card adventure-credit-feature">
            <p className="adventure-detail-kicker">
              Background music
            </p>

            <h4>
              Japanese Jazz 2
            </h4>

            <p>
              Music created by
              PuyoPuyoMegaFan1234.
            </p>
          </article>

          <article className="adventure-detail-card adventure-credit-feature">
            <p className="adventure-detail-kicker">
              Additional 3D model
            </p>

            <h4>Sakura Tree</h4>

            <p>
              Sakura Tree model created
              by dimal965 and published
              on Sketchfab.
            </p>
          </article>
        </div>
      </section>

      <section className="adventure-section-block">
        <div className="adventure-section-heading">
          <p>Production</p>

          <h3>
            Tools, technology &amp;
            visual direction
          </h3>
        </div>

        <div className="adventure-skill-grid">
          {creditGroups.length > 0 ? (
            creditGroups.map(
              (group) => {
                const groupItems =
                  Array.isArray(
                    group.items,
                  )
                    ? group.items
                    : [];

                return (
                  <article
                    key={group.title}
                    className="adventure-skill-card"
                  >
                    <h4>
                      {group.title}
                    </h4>

                    <ul>
                      {groupItems.map(
                        (item) => (
                          <li key={item}>
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </article>
                );
              },
            )
          ) : (
            <p className="adventure-section-empty-state">
              Credit details are
              currently being updated.
            </p>
          )}
        </div>
      </section>

      <section className="adventure-section-block">
        <div className="adventure-section-heading">
          <p>Direction</p>

          <h3>
            What shaped this portfolio
          </h3>
        </div>

        <div className="adventure-detail-grid adventure-detail-grid--three">
          <article className="adventure-detail-card">
            <p className="adventure-detail-kicker">
              01
            </p>

            <h4>Cozy spaces</h4>

            <p>
              I wanted the portfolio to
              feel like a place you can
              look around, not just
              another page to scroll
              through.
            </p>
          </article>

          <article className="adventure-detail-card">
            <p className="adventure-detail-kicker">
              02
            </p>

            <h4>
              Moody color palette
            </h4>

            <p>
              The dark city tones, warm
              lights, and pink
              reflections help the 3D
              scene and interface feel
              like they belong to the
              same world.
            </p>
          </article>

          <article className="adventure-detail-card">
            <p className="adventure-detail-kicker">
              03
            </p>

            <h4>
              Playful interactions
            </h4>

            <p>
              Camera movement, scene
              markers, sound, and small
              animations give visitors
              something to discover
              without getting in the
              way.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}