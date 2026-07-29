import Link from "next/link";
import type { ProjectCaseStudy, ProjectId, SectionId } from "../types";
import { PROJECT_CASE_STUDIES } from "../portfolioData";

export default function AnnotationContent({
  id,
}: {
  id: SectionId;
  onProjectSelect: (id: ProjectId) => void;
  onOpenSectionDetail: (id: "about" | "credits") => void;
}) {
  if (id === "about") {
    return (
      <>
        <p>
          Hi, I&apos;m Julie Anne — a software developer who enjoys turning ideas
          into clean, useful, and visually thoughtful digital experiences.
        </p>
        <p>
          I combine fullstack development, creative problem-solving, and small
          interaction details that give a project more personality.
        </p>
        <Link className="adventure-detail-button" href="/about">
          View full profile →
        </Link>
      </>
    );
  }

  if (id === "projects") {
    return (
      <>
        {(Object.values(PROJECT_CASE_STUDIES) as ProjectCaseStudy[]).map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="adventure-project-card-button"
          >
            <strong>{project.title}</strong>
            <span>{project.technologies.slice(0, 5).join(" · ")}</span>
            <em>Open case study →</em>
          </Link>
        ))}
        <Link className="adventure-detail-button" href="/projects">
          View all projects →
        </Link>
      </>
    );
  }

  return (
    <>
      <p>Portfolio concept and implementation by Julie Anne Cantillep.</p>
      <p>
        Built with Next.js, TypeScript, React Three Fiber, Drei, Three.js,
        GSAP, and a custom responsive 3D interface.
      </p>
      <Link className="adventure-detail-button" href="/credits">
        View full credits →
      </Link>
    </>
  );
}
