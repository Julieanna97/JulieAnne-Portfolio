"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Canvas,
} from "@react-three/fiber";

import {
  ACESFilmicToneMapping,
  SRGBColorSpace,
} from "three";

import type {
  PortfolioSection,
  ProjectId,
  SectionId,
} from "./types";

import {
  HOME_CAMERA_DESKTOP,
  HOME_CAMERA_MOBILE,
  SECTIONS,
} from "./sceneConfig";

import AdventureSceneContent from "./scene/AdventureSceneContent";

import AutomaticHotspotController, {
  type DetectedHotspot,
  type HotspotProjection,
} from "./scene/AutomaticHotspotController";

import AutoCardStack, {
  type AutoCardStackHandle,
} from "./annotations/AutoCardStack";

import SectionDetailModal from "./modals/SectionDetailModal";
import ProjectCaseStudyModal from "./modals/ProjectCaseStudyModal";

import SakuraThemeStyles from "./SakuraThemeStyles";

export type HeroSceneProps = {
  onSceneReady?: () => void;
};

type SectionDetailId =
  | "about"
  | "credits";

type FocusState = {
  focused: boolean;
  returning: boolean;
};

const FOCUS_STATE_EVENT =
  "adventure:focus-state";

const RETURN_HOME_EVENT =
  "adventure:return-home";

const INTRO_EVENT =
  "adventure:intro";

export default function HeroScene({
  onSceneReady,
}: HeroSceneProps) {
  const [
    viewportWidth,
    setViewportWidth,
  ] = useState(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return 1440;
    }

    return window.innerWidth;
  });

  const [
    activeId,
    setActiveId,
  ] =
    useState<SectionId | null>(
      null,
    );

  const [
    cardStack,
    setCardStack,
  ] =
    useState<SectionId[]>(
      [],
    );

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] =
    useState<ProjectId | null>(
      null,
    );

  const [
    selectedSectionDetail,
    setSelectedSectionDetail,
  ] =
    useState<SectionDetailId | null>(
      null,
    );

  const [
    focusState,
    setFocusState,
  ] = useState<FocusState>({
    focused: false,
    returning: false,
  });

  const autoCardStackRef =
    useRef<AutoCardStackHandle | null>(
      null,
    );

  const isMobile =
    viewportWidth < 768;

  const interactionPaused =
    selectedProjectId !==
      null ||
    selectedSectionDetail !==
      null;

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(
        window.innerWidth,
      );
    };

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, []);

  /*
   * Reset the automatic card traversal when the opening
   * camera animation begins.
   */
  useEffect(() => {
    const handleIntro = () => {
      setActiveId(null);
      setCardStack([]);

      setFocusState({
        focused: false,
        returning: false,
      });
    };

    window.addEventListener(
      INTRO_EVENT,
      handleIntro,
    );

    return () => {
      window.removeEventListener(
        INTRO_EVENT,
        handleIntro,
      );
    };
  }, []);

  /*
   * Listen for clicked-hotspot zoom state.
   *
   * The Home button is visible only while the camera is
   * inside one of the close-up hotspot views.
   */
  useEffect(() => {
    const handleFocusState = (
      event: Event,
    ) => {
      const customEvent =
        event as CustomEvent<{
          focused?: boolean;
          returning?: boolean;
        }>;

      setFocusState({
        focused: Boolean(
          customEvent.detail
            ?.focused,
        ),

        returning: Boolean(
          customEvent.detail
            ?.returning,
        ),
      });
    };

    window.addEventListener(
      FOCUS_STATE_EVENT,
      handleFocusState,
    );

    return () => {
      window.removeEventListener(
        FOCUS_STATE_EVENT,
        handleFocusState,
      );
    };
  }, []);

  /*
   * The stack is built from the actual order in which the
   * building sides are visited.
   *
   * From the Projects side:
   *
   * [Projects]
   * [Projects, Credits]
   * [Projects, Credits, About]
   *
   * From the About side:
   *
   * [About]
   * [About, Credits]
   * [About, Credits, Projects]
   *
   * Returning to an existing card removes everything
   * above it.
   */
  const handleDetectedHotspot =
    useCallback(
      ({
        id,
      }: DetectedHotspot) => {
        setActiveId(id);

        setCardStack(
          (currentStack) => {
            /*
             * The first detected side becomes the bottom
             * card for this traversal.
             */
            if (
              currentStack.length ===
              0
            ) {
              return [id];
            }

            const currentTop =
              currentStack[
                currentStack.length -
                  1
              ];

            if (
              currentTop === id
            ) {
              return currentStack;
            }

            /*
             * Detecting an ID that is already underneath
             * the top card means the visitor travelled
             * backward.
             */
            const existingIndex =
              currentStack.lastIndexOf(
                id,
              );

            if (
              existingIndex !== -1
            ) {
              return currentStack.slice(
                0,
                existingIndex + 1,
              );
            }

            /*
             * A newly visited adjacent side is placed on
             * top of the existing stack.
             */
            return [
              ...currentStack,
              id,
            ].slice(
              -SECTIONS.length,
            );
          },
        );
      },
      [],
    );

  /*
   * The controller updates the connector imperatively.
   *
   * This avoids a React state update on every Three.js
   * frame while the camera is rotating.
   */
  const updateHotspotProjection =
    useCallback(
      (
        projection:
          HotspotProjection,
      ) => {
        autoCardStackRef.current
          ?.updateHotspotPosition(
            projection,
          );
      },
      [],
    );

  const stackedSections =
    useMemo(
      () =>
        cardStack
          .map((id) =>
            SECTIONS.find(
              (section) =>
                section.id ===
                id,
            ),
          )
          .filter(
            (
              section,
            ): section is PortfolioSection =>
              section !==
              undefined,
          ),
      [cardStack],
    );

  const handleProjectSelect =
    useCallback(
      (id: ProjectId) => {
        setSelectedProjectId(
          id,
        );
      },
      [],
    );

  const handleOpenSectionDetail =
    useCallback(
      (
        id:
          SectionDetailId,
      ) => {
        setSelectedSectionDetail(
          id,
        );
      },
      [],
    );

  return (
    <section className="adventure-scene-shell">
      <Canvas
        shadows
        dpr={
          isMobile
            ? [1, 1.4]
            : [1, 1.85]
        }
        camera={{
          position:
            isMobile
              ? HOME_CAMERA_MOBILE
              : HOME_CAMERA_DESKTOP,

          fov:
            isMobile
              ? 43
              : 36,

          near: 0.1,
          far: 300,
        }}
        gl={{
          antialias: false,
          alpha: false,

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
            1,
          );
        }}
        style={{
          position: "relative",

          zIndex: 2,

          touchAction: "none",
        }}
      >
        <Suspense fallback={null}>
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
              handleProjectSelect
            }
            onOpenSectionDetail={
              handleOpenSectionDetail
            }
            interactionPaused={
              interactionPaused
            }
            onSceneReady={
              onSceneReady
            }
          />

          <AutomaticHotspotController
            activeId={
              activeId
            }
            paused={
              interactionPaused
            }
            onDetectedHotspot={
              handleDetectedHotspot
            }
            onProjection={
              updateHotspotProjection
            }
          />
        </Suspense>
      </Canvas>

      <AutoCardStack
        ref={
          autoCardStackRef
        }
        sections={
          stackedSections
        }
        activeId={
          activeId
        }
        onProjectSelect={
          handleProjectSelect
        }
        onOpenSectionDetail={
          handleOpenSectionDetail
        }
      />

      {focusState.focused && (
        <button
          type="button"
          className="adventure-home-button"
          disabled={
            focusState.returning
          }
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent(
                RETURN_HOME_EVENT,
              ),
            );
          }}
          aria-label="Return to the full model view"
        >
          <span
            className="adventure-home-button__icon"
            aria-hidden="true"
          >
            ×
          </span>

          <span>
            {focusState.returning
              ? "Returning"
              : "Home"}
          </span>
        </button>
      )}

      <SectionDetailModal
        detailId={
          selectedSectionDetail
        }
        onClose={() => {
          setSelectedSectionDetail(
            null,
          );
        }}
      />

      <ProjectCaseStudyModal
        projectId={
          selectedProjectId
        }
        onClose={() => {
          setSelectedProjectId(
            null,
          );
        }}
      />

      <style jsx global>{`
        .adventure-scene-shell {
          position: relative;

          width: 100%;
          height: 100vh;
          height: 100dvh;
          min-height: 520px;

          overflow: hidden;

          background: #000000;

          isolation: isolate;
        }

        .adventure-scene-shell
          canvas {
          display: block;
        }

        /*
         * AutoCardStack replaces the previous mobile
         * annotation layer and bottom navigation.
         */
        .adventure-mobile-annotation-layer,
        .adventure-bottom-nav {
          display: none !important;
        }

        .adventure-home-button {
          position: absolute;

          bottom: max(
            28px,
            calc(
              18px +
                env(
                  safe-area-inset-bottom
                )
            )
          );

          left: 50%;
          z-index: 90;

          display: inline-flex;

          min-width: 136px;
          min-height: 54px;

          align-items: center;
          justify-content: center;

          gap: 14px;

          border: 1px solid
            rgba(
              232,
              144,
              255,
              0.28
            );

          border-radius: 999px;
          outline: none;

          background:
            rgba(
              255,
              247,
              253,
              0.97
            );

          box-shadow:
            0 16px 38px
              rgba(
                0,
                0,
                0,
                0.34
              ),
            0 0 20px
              rgba(
                255,
                104,
                183,
                0.13
              );

          padding: 0 23px;

          color: #170d24;

          cursor: pointer;

          font-family:
            var(--font-body),
            Arial,
            sans-serif;

          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;

          text-transform: uppercase;

          transform:
            translateX(-50%);

          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            opacity 180ms ease;
        }

        .adventure-home-button:hover:not(
            :disabled
          ) {
          border-color: #ff68b7;

          box-shadow:
            0 18px 42px
              rgba(
                0,
                0,
                0,
                0.4
              ),
            0 0 25px
              rgba(
                255,
                104,
                183,
                0.26
              );

          transform:
            translateX(-50%)
            translateY(-2px);
        }

        .adventure-home-button:disabled {
          cursor: wait;
          opacity: 0.68;
        }

        .adventure-home-button:focus-visible {
          outline: 3px solid
            #69dfff;

          outline-offset: 4px;
        }

        .adventure-home-button__icon {
          font-family:
            Arial,
            sans-serif;

          font-size: 27px;
          font-weight: 300;
          line-height: 1;
        }

        @media (
          max-width: 767px
        ) {
          .adventure-scene-shell {
            min-height: 100dvh;
          }

          .adventure-home-button {
            bottom: max(
              16px,
              calc(
                12px +
                  env(
                    safe-area-inset-bottom
                  )
              )
            );

            min-width: 124px;
            min-height: 49px;

            padding: 0 19px;

            font-size: 11px;
          }

          .adventure-home-button__icon {
            font-size: 24px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .adventure-home-button {
            transition: none;
          }
        }
      `}</style>

      <SakuraThemeStyles />
    </section>
  );
}