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
  AnimatePresence,
  motion,
} from "framer-motion";

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

import SceneShortcutNav from "./navigation/SceneShortcutNav";

import ProjectsOverviewModal from "./modals/ProjectsOverviewModal";
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

  /*
   * Full-screen Projects overview opened from the
   * standalone top navigation.
   */
  const [
    projectsOverviewOpen,
    setProjectsOverviewOpen,
  ] = useState(false);

  /*
   * Individual project case study.
   */
  const [
    selectedProjectId,
    setSelectedProjectId,
  ] =
    useState<ProjectId | null>(
      null,
    );

  /*
   * Full-screen About or Credits detail.
   */
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

  /*
   * Pause Three.js interaction whenever full-screen
   * portfolio content is open.
   */
  const interactionPaused =
    projectsOverviewOpen ||
    selectedProjectId !==
      null ||
    selectedSectionDetail !==
      null;

  /*
   * Keep the scene responsive.
   */
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
   * focused:
   * The camera is inside a numbered-hotspot close-up.
   *
   * returning:
   * The camera is moving back to the main view.
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
   * Build the external card stack from the actual order
   * in which the building sides are visited.
   *
   * Projects side:
   *
   * [Projects]
   * [Projects, Credits]
   * [Projects, Credits, About]
   *
   * About side:
   *
   * [About]
   * [About, Credits]
   * [About, Credits, Projects]
   *
   * Detecting an existing card removes every card above
   * it.
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
             * card of this traversal.
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

            /*
             * Do not add the active card twice.
             */
            if (
              currentTop === id
            ) {
              return currentStack;
            }

            /*
             * Detecting a card already in the stack means
             * the visitor rotated backward.
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
             * Add a newly visited side on top.
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
   * Update the dotted connector imperatively.
   *
   * This prevents React from rendering on every Three.js
   * animation frame.
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

  /*
   * Open an individual project case study.
   */
  const handleProjectSelect =
    useCallback(
      (
        id: ProjectId,
      ) => {
        setSelectedProjectId(
          id,
        );
      },
      [],
    );

  /*
   * Open About or Credits from a card's More button.
   */
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

  /*
   * Standalone top navigation.
   *
   * It does not:
   *
   * - change activeId,
   * - change the card stack,
   * - select a numbered hotspot,
   * - move the camera,
   * - highlight a navigation link.
   *
   * It opens the full-screen content directly.
   */
  const handleShortcutSelect =
    useCallback(
      (
        id: SectionId,
      ) => {
        if (
          interactionPaused
        ) {
          return;
        }

        if (
          id ===
          "projects"
        ) {
          setProjectsOverviewOpen(
            true,
          );

          return;
        }

        /*
         * After Projects is excluded, TypeScript knows
         * this is either About or Credits.
         */
        setSelectedSectionDetail(
          id,
        );
      },
      [
        interactionPaused,
      ],
    );

  const handleReturnHome =
    useCallback(() => {
      if (
        focusState.returning
      ) {
        return;
      }

      window.dispatchEvent(
        new CustomEvent(
          RETURN_HOME_EVENT,
        ),
      );
    }, [
      focusState.returning,
    ]);

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

      {/*
       * Standalone navigation.
       *
       * It intentionally receives no activeId, so
       * automatic or manual hotspot detection cannot
       * highlight a navigation item.
       */}
      <SceneShortcutNav
        disabled={
          interactionPaused
        }
        onSelect={
          handleShortcutSelect
        }
      />

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

      {/*
       * The fixed slot controls the Home button's screen
       * position. The button itself can animate downward
       * without breaking horizontal centering.
       */}
      <div className="adventure-home-button-slot">
        <AnimatePresence
          initial={false}
        >
          {focusState.focused &&
            !focusState.returning && (
              <motion.button
                key="adventure-home"
                type="button"
                className="adventure-home-button"
                onClick={
                  handleReturnHome
                }
                aria-label="Return to the full model view"
                initial={{
                  opacity: 0,
                  y: 38,
                  scale: 0.92,

                  filter:
                    "blur(7px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,

                  filter:
                    "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  y: 78,
                  scale: 0.9,

                  filter:
                    "blur(8px)",
                }}
                whileHover={{
                  y: -3,
                  scale: 1.045,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                transition={{
                  duration: 0.3,

                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >
              <span
                className="adventure-home-button__icon"
                aria-hidden="true"
              />

              <span className="adventure-home-button__label">
                Home
              </span>
              </motion.button>
            )}
        </AnimatePresence>
      </div>

      {/*
       * Full-screen Projects overview opened only from
       * the standalone navigation.
       */}
      <ProjectsOverviewModal
        open={
          projectsOverviewOpen
        }
        onClose={() => {
          setProjectsOverviewOpen(
            false,
          );
        }}
        onProjectSelect={(
          id,
        ) => {
          /*
           * Close the overview and open the selected full
           * project case study.
           */
          setProjectsOverviewOpen(
            false,
          );

          setSelectedProjectId(
            id,
          );
        }}
      />

      {/*
       * Full-screen About or Credits content.
       *
       * These may be opened from:
       *
       * - the standalone navigation,
       * - an external card's More button.
       */}
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

      {/*
       * Individual full-screen project case study.
       */}
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

        /*
         * Fixed Home-button position.
         */
        .adventure-home-button-slot {
          position: absolute;

          right: 0;

          bottom: max(
            28px,
            calc(
              18px +
                env(
                  safe-area-inset-bottom
                )
            )
          );

          left: 0;

          z-index: 90;

          display: flex;

          align-items: center;
          justify-content: center;

          pointer-events: none;
        }

        .adventure-home-button {
          position: relative;

          display: inline-flex;

          min-width: 142px;
          min-height: 52px;

          align-items: center;
          justify-content: center;

          gap: 12px;

          overflow: hidden;

          border:
            1px solid
            rgba(
              255,
              128,
              201,
              0.46
            );

          border-radius: 999px;
          outline: none;

          background:
            linear-gradient(
              135deg,
              rgba(
                45,
                16,
                63,
                0.97
              ),
              rgba(
                20,
                10,
                38,
                0.97
              )
            );

          box-shadow:
            0 0 0 1px
              rgba(
                255,
                255,
                255,
                0.045
              )
              inset,
            0 0 26px
              rgba(
                255,
                75,
                174,
                0.21
              ),
            0 17px 43px
              rgba(
                0,
                0,
                0,
                0.48
              );

          padding:
            0 21px;

          color: #ffe8f7;

          cursor: pointer;

          font-family:
            var(--font-body),
            Arial,
            sans-serif;

          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.11em;

          text-transform: uppercase;

          pointer-events: auto;

          transition:
            color 180ms ease,
            border-color 180ms ease,
            background 200ms ease,
            box-shadow 200ms ease;
        }

        /*
         * Glossy highlight.
         */
        .adventure-home-button::before {
          content: "";

          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              120deg,
              transparent 16%,
              rgba(
                255,
                255,
                255,
                0.12
              ) 48%,
              transparent 78%
            );

          opacity: 0;

          transform:
            translateX(-70%);

          transition:
            opacity 180ms ease,
            transform 380ms ease;

          pointer-events: none;
        }

        /*
         * Sakura glow inside the button.
         */
        .adventure-home-button::after {
          content: "";

          position: absolute;

          inset: 6px;

          border-radius: inherit;

          background:
            radial-gradient(
              circle at 50% 100%,
              rgba(
                255,
                74,
                169,
                0.26
              ),
              transparent 68%
            );

          opacity: 0.62;

          pointer-events: none;
        }

        .adventure-home-button:hover {
          border-color:
            rgba(
              255,
              205,
              235,
              0.92
            );

          background:
            linear-gradient(
              135deg,
              #a968ef,
              #ff4fa9
            );

          color: #ffffff;

          box-shadow:
            0 0 0 1px
              rgba(
                255,
                255,
                255,
                0.13
              )
              inset,
            0 0 36px
              rgba(
                255,
                75,
                174,
                0.52
              ),
            0 20px 48px
              rgba(
                0,
                0,
                0,
                0.54
              );
        }

        .adventure-home-button:hover::before {
          opacity: 1;

          transform:
            translateX(70%);
        }

        .adventure-home-button:focus-visible {
          outline:
            3px solid
            #69dfff;

          outline-offset: 4px;
        }

        @media (
          max-width: 767px
        ) {
          .adventure-scene-shell {
            min-height: 100dvh;
          }

          .adventure-home-button-slot {
            bottom: max(
              16px,
              calc(
                12px +
                  env(
                    safe-area-inset-bottom
                  )
              )
            );
          }

          .adventure-home-button {
            min-width: 128px;
            min-height: 47px;

            padding:
              0 17px;

            font-size: 10px;
          }

          .adventure-home-button__heart {
            font-size: 13px;
          }

          .adventure-home-button__arrow {
            font-size: 12px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .adventure-home-button,
          .adventure-home-button::before,
          .adventure-home-button__heart,
          .adventure-home-button__arrow {
            transition-duration:
              0.01ms !important;
          }
        }
      `}</style>

      <SakuraThemeStyles />
    </section>
  );
}