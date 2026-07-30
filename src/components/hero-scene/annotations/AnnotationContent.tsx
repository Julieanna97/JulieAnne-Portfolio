import type {
  ProjectCaseStudy,
  ProjectId,
  SectionId,
} from "../types";
import { PROJECT_CASE_STUDIES } from "../portfolioData";

type AnnotationContentProps = {
  id: SectionId;
  onProjectSelect: (id: ProjectId) => void;
  onOpenSectionDetail: (id: "about" | "credits") => void;
};

export default function AnnotationContent({
  id,
  onProjectSelect,
  onOpenSectionDetail,
}: AnnotationContentProps) {
  if (id === "about") {
    return (
      <>
        <p className="adventure-annotation-lead">
          I turn ideas into useful, thoughtful, and visually polished digital
          experiences.
        </p>

        <p>
          My work combines fullstack development, embedded systems, creative
          problem-solving, and an interest in interactions that make software
          feel more personal.
        </p>

        <button
          type="button"
          className="adventure-detail-button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenSectionDetail("about");
          }}
        >
          <span>More</span>
          <span
            className="adventure-button-arrow"
            aria-hidden="true"
          >
            →
          </span>
        </button>
      </>
    );
  }

  if (id === "projects") {
    const projects = Object.values(
      PROJECT_CASE_STUDIES,
    ) as ProjectCaseStudy[];

    return (
      <div className="adventure-project-preview-list">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            className="adventure-project-card-button"
            onClick={(event) => {
              event.stopPropagation();
              onProjectSelect(project.id);
            }}
          >
            <span className="adventure-project-index">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="adventure-project-card-main">
              <strong>{project.title}</strong>

              <span className="adventure-project-technologies">
                {project.technologies
                  .slice(0, 5)
                  .join(" · ")}
              </span>
            </span>

            <span
              className="adventure-project-card-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <p className="adventure-annotation-lead">
        An interactive portfolio built as a responsive 3D environment rather
        than a traditional landing page.
      </p>

      <p>
        Created with Next.js, TypeScript, React Three Fiber, Drei, Three.js,
        GSAP, Framer Motion, and custom responsive interface work.
      </p>

      <button
        type="button"
        className="adventure-detail-button"
        onClick={(event) => {
          event.stopPropagation();
          onOpenSectionDetail("credits");
        }}
      >
        <span>More</span>
        <span
          className="adventure-button-arrow"
          aria-hidden="true"
        >
          →
        </span>
      </button>
    </>
  );
}