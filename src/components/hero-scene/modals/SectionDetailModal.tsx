import { ABOUT_EXPERIENCE, ABOUT_SKILL_GROUPS, CREDIT_GROUPS } from "../portfolioData";

export default function SectionDetailModal({
  detailId,
  onClose,
}: {
  detailId:
    | "about"
    | "credits"
    | null;

  onClose:
    () => void;
}) {
  if (
    !detailId
  ) {
    return null;
  }

  const isAbout =
    detailId ===
    "about";

  return (
    <div
      className="adventure-section-detail-backdrop"
      role="presentation"
      onClick={
        onClose
      }
    >
      <article
        className="adventure-section-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label={
          isAbout
            ? "About Julie Anne"
            : "Portfolio credits"
        }
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
          aria-label={
            isAbout
              ? "Close about profile"
              : "Close credits"
          }
        >
          ×
        </button>

        {isAbout ? (
          <>
            <header className="adventure-section-detail-header">
              <p>
                About Me
              </p>

              <h2>
                Hi, I&apos;m Julie Anne ✨
              </h2>

              <strong>
                Software Developer · Fullstack · Embedded · AI
              </strong>

              <p className="adventure-section-detail-intro">
                I&apos;m a software developer who enjoys building things that
                are useful, easy to use, and nice to look at. I&apos;ve worked
                with fullstack apps, embedded systems, and AI-related projects,
                and I like mixing clean code with small design details that make
                an app feel more personal.
              </p>
            </header>

            <section className="adventure-detail-grid adventure-detail-grid--three">
              <div className="adventure-detail-card">
                <h3>
                  Frontend
                </h3>

                <p>
                  I build interfaces with React, Next.js, TypeScript, and
                  Tailwind. I like making pages feel clean, smooth, and easy to
                  use.
                </p>
              </div>

              <div className="adventure-detail-card">
                <h3>
                  Backend
                </h3>

                <p>
                  I work with Node.js, Express, FastAPI, and Flask. I enjoy
                  building APIs, connecting databases, and organizing the
                  logic behind the scenes.
                </p>
              </div>

              <div className="adventure-detail-card">
                <h3>
                  Creative & Embedded
                </h3>

                <p>
                  I also enjoy 3D web, animation, and embedded projects with
                  C/C++ and Python. I like combining technical work with playful
                  visual details.
                </p>
              </div>
            </section>

            <section className="adventure-section-block">
              <h3>
                Work Experience
              </h3>

              <div className="adventure-experience-list">
                {ABOUT_EXPERIENCE.map(
                  (
                    experience
                  ) => (
                    <article
                      key={`${experience.company}-${experience.period}`}
                      className="adventure-experience-card"
                    >
                      <div>
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
                      </div>

                      <time>
                        {
                          experience.period
                        }
                      </time>

                      <p>
                        {
                          experience.summary
                        }
                      </p>

                      <ul>
                        {experience.points.map(
                          (
                            point
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
                          )
                        )}
                      </ul>
                    </article>
                  )
                )}
              </div>
            </section>

            <section className="adventure-section-block">
              <h3>
                Skills
              </h3>

              <div className="adventure-skill-grid">
                {ABOUT_SKILL_GROUPS.map(
                  (
                    group
                  ) => (
                    <article
                      key={
                        group.title
                      }
                      className="adventure-skill-card"
                    >
                      <h4>
                        {
                          group.title
                        }
                      </h4>

                      <div className="adventure-case-study-tags">
                        {group.items.map(
                          (
                            item
                          ) => (
                            <span
                              key={
                                item
                              }
                            >
                              {
                                item
                              }
                            </span>
                          )
                        )}
                      </div>
                    </article>
                  )
                )}
              </div>
            </section>

            <section className="adventure-section-block">
              <h3>
                Education
              </h3>

              <div className="adventure-detail-grid">
                <article className="adventure-detail-card">
                  <p className="adventure-detail-kicker">
                    2026
                  </p>

                  <h4>
                    Fullstack Developer
                  </h4>

                  <strong>
                    The Media Institute
                  </strong>

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
                      Embedded programming, hardware communication, and
                      real-time systems.
                    </li>
                    <li>
                      Led a group project where we built an autonomous car.
                    </li>
                  </ul>
                </article>
              </div>
            </section>

            <section className="adventure-section-block">
              <h3>
                Let&apos;s Connect
              </h3>

              <div className="adventure-contact-grid">
                <a href="mailto:kisamae1997@gmail.com">
                  kisamae1997@gmail.com
                </a>

                <a
                  href="https://www.linkedin.com/in/julie-anne-cantillep-4ba4ab250/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn ↗
                </a>

                <a
                  href="https://github.com/Julieanna97"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
              </div>

              <p className="adventure-detail-location">
                Malmö, Sweden
              </p>
            </section>
          </>
        ) : (
          <>
            <header className="adventure-section-detail-header">
              <p>
                Credits
              </p>

              <h2>
                Built with care ♡
              </h2>

              <p className="adventure-section-detail-intro">
                Portfolio concept and implementation by Julie Anne Cantillep.
                This interactive scene combines 3D development, animation,
                responsive UI work, and small environmental details.
              </p>
            </header>

            <section className="adventure-section-block">
              <h3>
                Scene attribution
              </h3>

              <article className="adventure-detail-card">
                <h4>
                  A Mysterious Adventure - 3D Editor Challenge
                </h4>

                <p>
                  3D scene by Diosmel, used under the Creative Commons
                  Attribution 4.0 license.
                </p>
              </article>
            </section>

            <section className="adventure-section-block">
              <h3>
                Tools, technology & visual direction
              </h3>

              <div className="adventure-skill-grid">
                {CREDIT_GROUPS.map(
                  (
                    group
                  ) => (
                    <article
                      key={
                        group.title
                      }
                      className="adventure-skill-card"
                    >
                      <h4>
                        {
                          group.title
                        }
                      </h4>

                      <ul>
                        {group.items.map(
                          (
                            item
                          ) => (
                            <li
                              key={
                                item
                              }
                            >
                              {
                                item
                              }
                            </li>
                          )
                        )}
                      </ul>
                    </article>
                  )
                )}
              </div>
            </section>

            <section className="adventure-section-block">
              <h3>
                What shaped this portfolio
              </h3>

              <div className="adventure-detail-grid adventure-detail-grid--three">
                <article className="adventure-detail-card">
                  <h4>
                    Cozy spaces
                  </h4>

                  <p>
                    A small environment that feels lived-in rather than a
                    standard portfolio landing page.
                  </p>
                </article>

                <article className="adventure-detail-card">
                  <h4>
                    Soft color stories
                  </h4>

                  <p>
                    Warm lights, pink reflections, dark city tones, and playful
                    accents throughout the interface.
                  </p>
                </article>

                <article className="adventure-detail-card">
                  <h4>
                    Playful interactions
                  </h4>

                  <p>
                    Camera movement, scene markers, animated advertisements,
                    sound, and small responsive details.
                  </p>
                </article>
              </div>
            </section>
          </>
        )}
      </article>
    </div>
  );
}
