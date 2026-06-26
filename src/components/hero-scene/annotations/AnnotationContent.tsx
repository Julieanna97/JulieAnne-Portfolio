import type { ProjectCaseStudy, ProjectId, SectionId } from "../types";
import { PROJECT_CASE_STUDIES } from "../portfolioData";

export default function AnnotationContent({
  id,
  onProjectSelect,
  onOpenSectionDetail,
}: {
  id:
    SectionId;

  onProjectSelect: (
    id:
      ProjectId
  ) => void;

  onOpenSectionDetail: (
    id:
      "about" | "credits"
  ) => void;
}) {
  if (
    id ===
    "about"
  ) {
    return (
      <>
        <p>
          Hi, I&apos;m Julie Anne — a software developer who enjoys turning ideas
          into clean, useful, and visually thoughtful digital experiences.
        </p>

        <p>
          I like building projects that feel easy to use, but still have personality
          through small details, smooth interactions, and polished design choices.
        </p>

        <p>
          My work combines fullstack development, creative problem-solving, and a
          curiosity for learning new tools by building real projects.
        </p>

        <button
          type="button"
          className="adventure-detail-button"
          onClick={(
            event
          ) => {
            event.stopPropagation();

            onOpenSectionDetail(
              "about"
            );
          }}
        >
          View full profile →
        </button>
      </>
    );
  }

  if (
    id ===
    "projects"
  ) {
    return (
      <>
        {(
          Object.values(
            PROJECT_CASE_STUDIES
          ) as ProjectCaseStudy[]
        ).map(
          (
            project
          ) => (
            <button
              key={
                project.id
              }
              type="button"
              className="adventure-project-card-button"
              onClick={(
                event
              ) => {
                event.stopPropagation();

                onProjectSelect(
                  project.id
                );
              }}
            >
              <strong>
                {
                  project.title
                }
              </strong>

              <span>
                {
                  project.technologies
                    .slice(
                      0,
                      5
                    )
                    .join(
                      " · "
                    )
                }
              </span>

              <em>
                Open case study →
              </em>
            </button>
          )
        )}
      </>
    );
  }

  return (
    <>
      <p>
        Portfolio concept and implementation by Julie Anne Cantillep.
      </p>

      <p>
        Built with Next.js, TypeScript, React Three Fiber, Drei, Three.js,
        GSAP, and a custom responsive 3D interface.
      </p>

      <button
        type="button"
        className="adventure-detail-button"
        onClick={(
          event
        ) => {
          event.stopPropagation();

          onOpenSectionDetail(
            "credits"
          );
        }}
      >
        View full credits →
      </button>
    </>
  );
}
