"use client";

import { Html } from "@react-three/drei";
import type { PortfolioSection, ProjectId } from "../types";
import AnnotationCard from "./AnnotationCard";

export default function NumberHotspot({
  section,
  disabled,
  selected,
  showCard,
  onSelect,
  onClose,
  onProjectSelect,
  onOpenSectionDetail,
}: {
  section:
    PortfolioSection;

  disabled:
    boolean;

  selected:
    boolean;

  showCard:
    boolean;

  onSelect: (
    section:
      PortfolioSection
  ) => void;

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
    <Html
      position={
        section.hotspot
      }
      center
      zIndexRange={[
        40,
        0,
      ]}
      style={{
        pointerEvents:
          "auto",
      }}
    >
      <div
        className={`adventure-annotation-wrap ${
          selected
            ? "is-open"
            : ""
        }`}
      >
        <button
          type="button"
          className={`adventure-number ${
            selected
              ? "is-selected"
              : ""
          }`}
          disabled={
            disabled
          }
          onClick={(
            event
          ) => {
            event.stopPropagation();

            onSelect(
              section
            );
          }}
          aria-label={`Open ${section.title}`}
        >
          <span className="adventure-number-ripple" />

          <span className="adventure-number-ripple ripple-two" />

          <span className="adventure-number-core">
            {
              section.markerNumber ??
              section.number
            }
          </span>
        </button>

        {selected &&
          showCard && (
            <AnnotationCard
              section={
                section
              }
              onClose={
                onClose
              }
              onProjectSelect={
                onProjectSelect
              }
              onOpenSectionDetail={
                onOpenSectionDetail
              }
            />
          )}
      </div>
    </Html>
  );
}
