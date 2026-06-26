import type { PortfolioSection, ProjectId } from "../types";
import AnnotationContent from "./AnnotationContent";

export default function AnnotationCard({
  section,
  mobile =
    false,
  onClose,
  onProjectSelect,
  onOpenSectionDetail,
}: {
  section:
    PortfolioSection;

  mobile?:
    boolean;

  onClose:
    () => void;

  onProjectSelect: (
    id:
      ProjectId
  ) => void;

  onOpenSectionDetail: (
    id:
      "about" | "credits"
  ) => void;
}) {
  return (
    <section
      className={`adventure-annotation-card ${
        mobile
          ? "adventure-annotation-card--mobile"
          : ""
      }`}
      role={
        mobile
          ? "dialog"
          : undefined
      }
      aria-modal={
        mobile
          ? true
          : undefined
      }
      aria-label={
        mobile
          ? section.title
          : undefined
      }
      onClick={(
        event
      ) => {
        event.stopPropagation();
      }}
    >
      <button
        type="button"
        className="adventure-annotation-close"
        onClick={(
          event
        ) => {
          event.stopPropagation();

          onClose();
        }}
        aria-label={`Close ${section.title}`}
      >
        ×
      </button>

      <p className="adventure-annotation-card-number">
        {
          section.number
        }
      </p>

      <h2>
        {
          section.title
        }
      </h2>

      <p className="adventure-annotation-card-eyebrow">
        {
          section.eyebrow
        }
      </p>

      <div
        className={`adventure-annotation-card-copy is-${section.id}`}
      >
        <AnnotationContent
          id={
            section.id
          }
          onProjectSelect={
            onProjectSelect
          }
          onOpenSectionDetail={
            onOpenSectionDetail
          }
        />
      </div>
    </section>
  );
}
