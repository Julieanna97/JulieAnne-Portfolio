"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";

import type { ProjectId, SectionId } from "./types";
import { HOME_CAMERA_DESKTOP, HOME_CAMERA_MOBILE, SECTIONS } from "./sceneConfig";
import AdventureSceneContent from "./scene/AdventureSceneContent";
import AnnotationCard from "./annotations/AnnotationCard";
import SectionDetailModal from "./modals/SectionDetailModal";
import ProjectCaseStudyModal from "./modals/ProjectCaseStudyModal";
import SakuraThemeStyles from "./SakuraThemeStyles";

export type HeroSceneProps = {
  onSceneReady?:
    () => void;
};

export default function HeroScene({
  onSceneReady,
}: HeroSceneProps) {
  const [
    viewportWidth,
    setViewportWidth,
  ] =
    useState(
      () =>
        typeof window ===
        "undefined"
          ? 1440
          : window.innerWidth
    );

  const [
    activeId,
    setActiveId,
  ] =
    useState<
      | SectionId
      | null
    >(
      null
    );

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] =
    useState<
      | ProjectId
      | null
    >(
      null
    );

  const [
    selectedSectionDetail,
    setSelectedSectionDetail,
  ] =
    useState<
      | "about"
      | "credits"
      | null
    >(
      null
    );

  const activeSection =
    SECTIONS.find(
      (
        section
      ) =>
        section.id ===
        activeId
    ) ??
    null;

  useEffect(() => {
    const handleResize =
      () => {
        setViewportWidth(
          window.innerWidth
        );
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  const selectFromBottomNav =
    (
      id:
        SectionId
    ) => {
      window.dispatchEvent(
        new CustomEvent(
          "adventure:select",
          {
            detail: {
              id,
            },
          }
        )
      );
    };

  return (
    <section
      className="adventure-scene-shell"
      style={{
        background:
          "#000000",
      }}
    >
      <Canvas
        shadows
        dpr={
          viewportWidth <
          768
            ? [
                1,
                1.4,
              ]
            : [
                1,
                1.85,
              ]
        }
        camera={{
          position:
            viewportWidth <
            768
              ? HOME_CAMERA_MOBILE
              : HOME_CAMERA_DESKTOP,

          fov:
            viewportWidth <
            768
              ? 43
              : 36,

          near:
            0.1,

          far:
            300,
        }}
        gl={{
          antialias:
            false,

          alpha:
            false,

          powerPreference:
            "high-performance",
        }}
        onCreated={({
          gl,
        }) => {
          gl.outputColorSpace =
            SRGBColorSpace;

          gl.toneMapping =
            ACESFilmicToneMapping;

          gl.toneMappingExposure =
            0.92;

          gl.setClearColor(
            "#000000",
            1
          );
        }}
        style={{
          touchAction:
            "none",

          position:
            "relative",

          zIndex:
            2,
        }}
      >
        <Suspense
          fallback={
            null
          }
        >
          <AdventureSceneContent
            viewportWidth={
              viewportWidth
            }
            activeId={
              activeId
            }
            onActiveChange={
              setActiveId
            }
            onProjectSelect={
              setSelectedProjectId
            }
            onOpenSectionDetail={
              setSelectedSectionDetail
            }
            onSceneReady={
              onSceneReady
            }
          />
        </Suspense>
      </Canvas>

      {viewportWidth <
        768 &&
        activeSection && (
          <div className="adventure-mobile-annotation-layer">
            <AnnotationCard
              section={
                activeSection
              }
              mobile
              onClose={() => {
                setActiveId(
                  null
                );
              }}
              onProjectSelect={
                setSelectedProjectId
              }
              onOpenSectionDetail={
                setSelectedSectionDetail
              }
            />
          </div>
        )}

      <nav
        className="adventure-bottom-nav"
        aria-label="Portfolio sections"
      >
        {SECTIONS.map(
          (
            section
          ) => (
            <button
              type="button"
              key={
                section.id
              }
              onClick={() =>
                selectFromBottomNav(
                  section.id
                )
              }
              className={
                activeId ===
                section.id
                  ? "is-active"
                  : ""
              }
            >
              <span>
                {
                  section.number
                }
              </span>

              {
                section.title
              }
            </button>
          )
        )}
      </nav>

      <SectionDetailModal
        detailId={
          selectedSectionDetail
        }
        onClose={() => {
          setSelectedSectionDetail(
            null
          );
        }}
      />

      <ProjectCaseStudyModal
        projectId={
          selectedProjectId
        }
        onClose={() => {
          setSelectedProjectId(
            null
          );
        }}
      />

      <style jsx global>{`
        .adventure-annotation-wrap {
          position: relative;
          display: grid;
          place-items: center;
        }

        .adventure-number {
          position: relative;
          display: grid;
          width: 32px;
          height: 32px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 999px;
          background: rgba(6, 7, 11, 0.8);
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.28),
            0 0 13px rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.96);
          cursor: pointer;
          transition:
            transform 180ms ease,
            background 180ms ease,
            border-color 180ms ease;
        }

        .adventure-number-core {
          position: relative;
          z-index: 4;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .adventure-number-ripple {
          position: absolute;
          inset: -1px;
          border: 1px solid rgba(255, 255, 255, 0.44);
          border-radius: inherit;
          animation: adventure-annotation-ripple 2.25s ease-out infinite;
        }

        .adventure-number-ripple.ripple-two {
          animation-delay: 1.12s;
        }

        .adventure-number:hover,
        .adventure-number.is-selected {
          transform: scale(1.16);
          border-color: rgba(255, 255, 255, 0.92);
          background: rgba(17, 14, 23, 0.96);
        }

        @keyframes adventure-annotation-ripple {
          0% {
            transform: scale(0.82);
            opacity: 0;
          }

          22% {
            opacity: 0.62;
          }

          100% {
            transform: scale(1.9);
            opacity: 0;
          }
        }

        .adventure-annotation-card {
          position: absolute;
          left: 48px;
          top: -18px;
          width: min(310px, 76vw);
          max-height: min(390px, 70vh);
          min-width: 0;
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior: contain;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 16px;
          background: rgba(6, 7, 12, 0.88);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.42);
          padding: 16px;
          color: #fff;
          backdrop-filter: blur(15px);
          -webkit-overflow-scrolling: touch;
        }

        .adventure-annotation-close {
          position: absolute;
          right: 9px;
          top: 9px;
          display: grid;
          width: 26px;
          height: 26px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
          color: #fff;
          cursor: pointer;
          font-size: 16px;
        }

        .adventure-annotation-card-number,
        .adventure-annotation-card-eyebrow {
          margin: 0;
          color: #dbc7ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .adventure-annotation-card h2 {
          margin: 9px 34px 5px 0;
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .adventure-annotation-card-copy {
          display: grid;
          gap: 10px;
          margin-top: 14px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 12px;
          line-height: 1.58;
        }

        .adventure-annotation-card-copy p {
          margin: 0;
        }

        .adventure-bottom-nav {
          position: absolute;
          bottom: 20px;
          left: 50%;
          z-index: 35;
          display: flex;
          max-width: calc(100vw - 28px);
          transform: translateX(-50%);
          gap: 6px;
          padding: 7px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          background: rgba(10, 9, 16, 0.72);
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(16px);
        }

        .adventure-bottom-nav button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: rgba(255, 255, 255, 0.82);
          cursor: pointer;
          padding: 11px 14px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition:
            background 180ms ease,
            color 180ms ease;
          white-space: nowrap;
        }

        .adventure-bottom-nav button:hover,
        .adventure-bottom-nav button.is-active {
          background: rgba(255, 255, 255, 0.92);
          color: #17121e;
        }

        .adventure-bottom-nav span {
          opacity: 0.72;
        }

        .adventure-project-card-button {
          display: grid;
          width: 100%;
          gap: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.045);
          padding: 10px;
          color: rgba(255, 255, 255, 0.92);
          cursor: pointer;
          text-align: left;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .adventure-project-card-button:hover {
          transform: translateY(-2px);
          border-color: rgba(219, 199, 255, 0.42);
          background: rgba(255, 255, 255, 0.095);
        }

        .adventure-project-card-button strong {
          font-size: 12px;
        }

        .adventure-project-card-button span {
          color: #dac7ff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.09em;
          line-height: 1.45;
          text-transform: uppercase;
        }

        .adventure-project-card-button em {
          margin-top: 3px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 9px;
          font-style: normal;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .adventure-case-study-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          overflow-y: auto;
          background: rgba(3, 5, 12, 0.66);
          padding: 22px;
          backdrop-filter: blur(12px);
        }

        .adventure-case-study-modal {
          position: relative;
          width: min(1080px, 100%);
          max-height: min(900px, calc(100dvh - 44px));
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(13, 15, 28, 0.97),
              rgba(26, 18, 39, 0.95)
            );
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
          color: white;
          padding: 24px;
        }

        .adventure-case-study-close {
          position: absolute;
          right: 16px;
          top: 16px;
          z-index: 3;
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.17);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: white;
          cursor: pointer;
          font-size: 23px;
        }

        .adventure-case-study-header > p {
          margin: 0;
          padding-right: 46px;
          color: #dbc7ff;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.24em;
          line-height: 1.5;
          text-transform: uppercase;
        }

        .adventure-case-study-header h2 {
          margin: 10px 50px 0 0;
          font-size: clamp(2rem, 4vw, 3.6rem);
          letter-spacing: -0.065em;
          line-height: 0.98;
        }

        .adventure-case-study-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 15px;
        }

        .adventure-case-study-meta span {
          display: inline-flex;
          gap: 7px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.055);
          padding: 7px 10px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 11px;
        }

        .adventure-case-study-meta b {
          color: #dbc7ff;
        }

        .adventure-case-study-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(270px, 0.82fr);
          gap: 22px;
          margin-top: 24px;
        }

        .adventure-case-study-gallery,
        .adventure-case-study-content {
          min-width: 0;
        }

        .adventure-case-study-main-image,
        .adventure-case-study-empty-gallery {
          width: 100%;
          aspect-ratio: 16 / 10;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.05);
          object-fit: contain;
        }

        .adventure-case-study-empty-gallery {
          display: grid;
          place-content: center;
          gap: 6px;
          padding: 24px;
          color: rgba(255, 255, 255, 0.76);
          text-align: center;
        }

        .adventure-case-study-empty-gallery p {
          margin: 0;
          font-size: 12px;
          line-height: 1.6;
        }

        .adventure-case-study-thumbnails {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-top: 9px;
        }

        .adventure-case-study-thumbnails button {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.05);
          padding: 0;
          cursor: pointer;
          opacity: 0.58;
        }

        .adventure-case-study-thumbnails button.is-active,
        .adventure-case-study-thumbnails button:hover {
          opacity: 1;
        }

        .adventure-case-study-thumbnails img {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 10;
          object-fit: cover;
        }

        .adventure-case-study-video {
          width: 100%;
          margin-top: 14px;
          border-radius: 16px;
          background: #05060a;
        }

        .adventure-case-study-content {
          display: grid;
          align-content: start;
          gap: 20px;
          color: rgba(255, 255, 255, 0.76);
          font-size: 13px;
          line-height: 1.68;
        }

        .adventure-case-study-summary {
          margin: 0;
        }

        .adventure-case-study-content h3 {
          margin: 0 0 8px;
          color: white;
          font-size: 15px;
        }

        .adventure-case-study-content ul {
          display: grid;
          gap: 7px;
          margin: 0;
          padding-left: 18px;
        }

        .adventure-case-study-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .adventure-case-study-tags span {
          border: 1px solid rgba(219, 199, 255, 0.19);
          border-radius: 999px;
          background: rgba(219, 199, 255, 0.08);
          padding: 6px 9px;
          color: #dbc7ff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .adventure-detail-button,
        .adventure-project-external-link {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(219, 199, 255, 0.25);
          border-radius: 999px;
          background: rgba(219, 199, 255, 0.1);
          padding: 9px 12px;
          color: #f5edff;
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          line-height: 1.35;
          text-decoration: none;
          text-transform: uppercase;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .adventure-detail-button:hover,
        .adventure-project-external-link:hover {
          transform: translateY(-2px);
          border-color: rgba(219, 199, 255, 0.58);
          background: rgba(219, 199, 255, 0.2);
        }

        .adventure-section-detail-backdrop {
          position: fixed;
          inset: 0;
          z-index: 110;
          display: grid;
          place-items: center;
          overflow-y: auto;
          background: rgba(3, 5, 12, 0.74);
          padding: 22px;
          backdrop-filter: blur(14px);
        }

        .adventure-section-detail-modal {
          position: relative;
          width: min(1120px, 100%);
          max-height: min(920px, calc(100dvh - 44px));
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(13, 15, 28, 0.985),
              rgba(31, 20, 43, 0.975)
            );
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.6);
          color: white;
          padding: 26px;
        }

        .adventure-section-detail-header > p,
        .adventure-detail-kicker {
          margin: 0;
          color: #dbc7ff;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }

        .adventure-section-detail-header h2 {
          margin: 10px 50px 0 0;
          font-size: clamp(2rem, 5vw, 4rem);
          letter-spacing: -0.065em;
          line-height: 0.98;
        }

        .adventure-section-detail-header strong {
          display: block;
          margin-top: 11px;
          color: #f2dcff;
          font-size: 13px;
          letter-spacing: 0.09em;
          line-height: 1.55;
          text-transform: uppercase;
        }

        .adventure-section-detail-intro {
          max-width: 840px;
          margin: 16px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 14px;
          line-height: 1.75;
        }

        .adventure-section-block {
          margin-top: 28px;
        }

        .adventure-section-block > h3 {
          margin: 0 0 12px;
          color: white;
          font-size: 18px;
        }

        .adventure-detail-grid,
        .adventure-skill-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .adventure-detail-grid--three {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 22px;
        }

        .adventure-detail-card,
        .adventure-skill-card,
        .adventure-experience-card,
        .adventure-project-highlight-list article {
          min-width: 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.055);
          padding: 14px;
        }

        .adventure-detail-card h3,
        .adventure-detail-card h4,
        .adventure-skill-card h4,
        .adventure-experience-card h4,
        .adventure-project-highlight-list h4 {
          margin: 0;
          color: white;
          font-size: 14px;
        }

        .adventure-detail-card p,
        .adventure-skill-card p,
        .adventure-project-highlight-list p {
          margin: 7px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          line-height: 1.65;
        }

        .adventure-detail-card strong,
        .adventure-experience-card strong {
          display: block;
          margin-top: 4px;
          color: #dbc7ff;
          font-size: 12px;
        }

        .adventure-detail-card ul,
        .adventure-skill-card ul,
        .adventure-experience-card ul {
          display: grid;
          gap: 5px;
          margin: 10px 0 0;
          padding-left: 17px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          line-height: 1.55;
        }

        .adventure-experience-list {
          display: grid;
          gap: 10px;
        }

        .adventure-experience-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 4px 14px;
        }

        .adventure-experience-card time {
          color: rgba(255, 255, 255, 0.56);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-align: right;
        }

        .adventure-experience-card p {
          grid-column: 1 / -1;
          margin: 8px 0 0;
          color: rgba(255, 255, 255, 0.75);
          font-size: 12px;
          line-height: 1.55;
        }

        .adventure-experience-card ul {
          grid-column: 1 / -1;
        }

        .adventure-skill-card .adventure-case-study-tags {
          margin-top: 10px;
        }

        .adventure-contact-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .adventure-project-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .adventure-contact-grid a {
          overflow-wrap: anywhere;
          border: 1px solid rgba(219, 199, 255, 0.18);
          border-radius: 13px;
          background: rgba(219, 199, 255, 0.08);
          padding: 11px;
          color: #eee1ff;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
          transition:
            transform 180ms ease,
            background 180ms ease;
        }

        .adventure-contact-grid a:hover {
          transform: translateY(-2px);
          background: rgba(219, 199, 255, 0.17);
        }

        .adventure-detail-location {
          margin: 12px 0 0;
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
        }

        .adventure-case-study-overview {
          display: grid;
          gap: 8px;
        }

        .adventure-case-study-overview p,
        .adventure-project-highlight-list p {
          margin: 0;
        }

        .adventure-project-highlight-list {
          display: grid;
          gap: 8px;
        }

        .adventure-project-highlight-list p {
          margin-top: 5px;
        }

        .adventure-mobile-annotation-layer {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 70;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding:
            14px
            14px
            calc(78px + env(safe-area-inset-bottom));
        }

        .adventure-annotation-card-copy,
        .adventure-annotation-card-eyebrow,
        .adventure-project-card-button,
        .adventure-project-card-button span {
          min-width: 0;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        @media (max-width: 767px) {
          .adventure-section-detail-backdrop {
            padding: 12px;
          }

          .adventure-section-detail-modal {
            max-height: calc(100dvh - 24px);
            border-radius: 18px;
            padding: 17px;
          }

          .adventure-detail-grid,
          .adventure-detail-grid--three,
          .adventure-skill-grid,
          .adventure-contact-grid {
            grid-template-columns: 1fr;
          }

          .adventure-experience-card {
            grid-template-columns: 1fr;
          }

          .adventure-experience-card time {
            text-align: left;
          }

          .adventure-bottom-nav {
            bottom: 13px;
            gap: 3px;
            padding: 5px;
          }

          .adventure-bottom-nav button {
            gap: 4px;
            padding: 9px;
            font-size: 8px;
            letter-spacing: 0.1em;
          }

          .adventure-case-study-backdrop {
            padding: 12px;
          }

          .adventure-case-study-modal {
            max-height: calc(100dvh - 24px);
            border-radius: 18px;
            padding: 17px;
          }

          .adventure-case-study-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .adventure-annotation-card--mobile {
            pointer-events: auto;
            position: relative;
            left: auto;
            top: auto;
            width: min(370px, 100%);
            max-height:
              calc(
                100dvh -
                  112px -
                  env(safe-area-inset-bottom)
              );
            transform: none;
            animation: adventure-card-enter-mobile 220ms ease both;
          }

          @keyframes adventure-card-enter-mobile {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.97);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        }
      `}</style>

      <SakuraThemeStyles />
    </section>
  );
}