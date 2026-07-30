"use client";

import { useEffect, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ABOUT_EXPERIENCE,
  ABOUT_SKILL_GROUPS,
  CREDIT_GROUPS,
} from "../portfolioData";

type SectionDetailModalProps = {
  detailId: "about" | "credits" | null;
  onClose: () => void;
};

export default function SectionDetailModal({
  detailId,
  onClose,
}: SectionDetailModalProps) {
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!detailId) {
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
  }, [detailId, onClose]);

  const isAbout = detailId === "about";
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
        y: 30,
        borderRadius: 36,
        clipPath: "inset(6% 6% 6% 6% round 36px)",
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
            duration: reduceMotion ? 0.12 : 0.32,
          }}
          onClick={onClose}
        >
          <motion.article
            className="adventure-section-detail-modal"
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
              aria-label={
                isAbout
                  ? "Close about profile"
                  : "Close credits"
              }
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
              {isAbout ? (
                <AboutDetail titleId={titleId} />
              ) : (
                <CreditsDetail titleId={titleId} />
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
  return (
    <>
      <header className="adventure-section-detail-header">
        <p>About Me</p>

        <h2 id={titleId}>
          Hi, I&apos;m Julie Anne
        </h2>

        <strong>
          Software Developer · Fullstack · Embedded · AI
        </strong>

        <p className="adventure-section-detail-intro">
          I&apos;m a software developer who enjoys building things that are
          useful, easy to use, and nice to look at. I&apos;ve worked with
          fullstack applications, embedded systems, and AI-related projects. I
          enjoy combining clean code with small design details that make an
          application feel more considered and personal.
        </p>
      </header>

      <section className="adventure-detail-grid adventure-detail-grid--three">
        <article className="adventure-detail-card">
          <p className="adventure-detail-kicker">
            01
          </p>

          <h3>Frontend</h3>

          <p>
            I build responsive interfaces with React, Next.js, TypeScript, and
            Tailwind. I care about clear structure, smooth interactions, and
            accessible experiences.
          </p>
        </article>

        <article className="adventure-detail-card">
          <p className="adventure-detail-kicker">
            02
          </p>

          <h3>Backend</h3>

          <p>
            I work with Node.js, Express, FastAPI, and Flask. I enjoy building
            APIs, connecting databases, and organizing application logic.
          </p>
        </article>

        <article className="adventure-detail-card">
          <p className="adventure-detail-kicker">
            03
          </p>

          <h3>Creative & Embedded</h3>

          <p>
            I also enjoy 3D web experiences, animation, embedded projects,
            C/C++, and Python.
          </p>
        </article>
      </section>

      <section className="adventure-section-block">
        <div className="adventure-section-heading">
          <p>Experience</p>
          <h3>Work Experience</h3>
        </div>

        <div className="adventure-experience-list">
          {ABOUT_EXPERIENCE.map((experience, index) => (
            <article
              key={`${experience.company}-${experience.period}`}
              className="adventure-experience-card"
            >
              <span className="adventure-experience-index">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="adventure-experience-heading">
                <div>
                  <h4>{experience.role}</h4>
                  <strong>{experience.company}</strong>
                </div>

                <time>{experience.period}</time>
              </div>

              <p>{experience.summary}</p>

              <ul>
                {experience.points.map((point) => (
                  <li key={point}>
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="adventure-section-block">
        <div className="adventure-section-heading">
          <p>Capabilities</p>
          <h3>Skills</h3>
        </div>

        <div className="adventure-skill-grid">
          {ABOUT_SKILL_GROUPS.map((group) => (
            <article
              key={group.title}
              className="adventure-skill-card"
            >
              <h4>{group.title}</h4>

              <div className="adventure-case-study-tags">
                {group.items.map((item) => (
                  <span key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="adventure-section-block">
        <div className="adventure-section-heading">
          <p>Learning</p>
          <h3>Education</h3>
        </div>

        <div className="adventure-detail-grid">
          <article className="adventure-detail-card">
            <p className="adventure-detail-kicker">
              2026
            </p>

            <h4>Fullstack Developer</h4>

            <strong>The Media Institute</strong>

            <ul>
              <li>
                Frontend, backend, databases, and system development.
              </li>
              <li>
                Projects built with agile methods.
              </li>
              <li>
                E-commerce platforms and fullstack application structure.
              </li>
            </ul>
          </article>

          <article className="adventure-detail-card">
            <p className="adventure-detail-kicker">
              2024
            </p>

            <h4>
              Embedded Software Development
            </h4>

            <strong>
              Movant University of Applied Science
            </strong>

            <ul>
              <li>
                Embedded programming, hardware communication, and real-time
                systems.
              </li>
              <li>
                Led a group project that produced an autonomous car.
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section className="adventure-section-block adventure-connect-section">
        <div className="adventure-section-heading">
          <p>Contact</p>
          <h3>Let&apos;s Connect</h3>
        </div>

        <div className="adventure-contact-grid">
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
            <span>Professional profile</span>
            <strong>LinkedIn ↗</strong>
          </a>

          <a
            href="https://github.com/Julieanna97"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Development work</span>
            <strong>GitHub ↗</strong>
          </a>
        </div>

        <p className="adventure-detail-location">
          Malmö, Sweden
        </p>
      </section>
    </>
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
          Portfolio concept and implementation by Julie Anne Cantillep. This
          interactive environment combines 3D development, animation,
          responsive interface work, and small environmental details.
        </p>
      </header>

      <section className="adventure-section-block">
        <div className="adventure-section-heading">
          <p>Attribution</p>
          <h3>Scene attribution</h3>
        </div>

        <article className="adventure-detail-card adventure-credit-feature">
          <p className="adventure-detail-kicker">
            Original 3D environment
          </p>

          <h4>
            A Mysterious Adventure — 3D Editor Challenge
          </h4>

          <p>
            3D scene by Diosmel, used under the Creative Commons Attribution
            4.0 license.
          </p>
        </article>
      </section>

      <section className="adventure-section-block">
        <div className="adventure-section-heading">
          <p>Production</p>
          <h3>
            Tools, technology & visual direction
          </h3>
        </div>

        <div className="adventure-skill-grid">
          {CREDIT_GROUPS.map((group) => (
            <article
              key={group.title}
              className="adventure-skill-card"
            >
              <h4>{group.title}</h4>

              <ul>
                {group.items.map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
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
              A small environment that feels lived-in rather than a standard
              portfolio landing page.
            </p>
          </article>

          <article className="adventure-detail-card">
            <p className="adventure-detail-kicker">
              02
            </p>

            <h4>Soft color stories</h4>

            <p>
              Warm lights, pink reflections, dark city tones, and playful
              accents throughout the interface.
            </p>
          </article>

          <article className="adventure-detail-card">
            <p className="adventure-detail-kicker">
              03
            </p>

            <h4>Playful interactions</h4>

            <p>
              Camera movement, scene markers, animation, sound, and responsive
              details.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}