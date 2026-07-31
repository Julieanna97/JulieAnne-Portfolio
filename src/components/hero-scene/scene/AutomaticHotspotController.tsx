"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  Vector3,
} from "three";

import type {
  SectionId,
} from "../types";

import {
  INTRO_ZOOM_DURATION,
  SECTIONS,
} from "../sceneConfig";

export type DetectionDirection =
  | -1
  | 0
  | 1;

export type DetectedHotspot = {
  id: SectionId;
  direction: DetectionDirection;
};

export type HotspotProjection = {
  x: number;
  y: number;
  visible: boolean;
};

export type AutomaticHotspotControllerProps = {
  activeId:
    | SectionId
    | null;

  paused?: boolean;

  onDetectedHotspot: (
    detection:
      DetectedHotspot,
  ) => void;

  onProjection?: (
    projection:
      HotspotProjection,
  ) => void;
};

type ManualHotspotEvent =
  CustomEvent<{
    id?: SectionId;
  }>;

type FocusStateEvent =
  CustomEvent<{
    focused?: boolean;
    returning?: boolean;
  }>;

type DetectionCandidate = {
  id: SectionId;
  score: number;
};

const MANUAL_HOTSPOT_EVENT =
  "adventure:manual-hotspot";

const FOCUS_STATE_EVENT =
  "adventure:focus-state";

const HOTSPOT_SEQUENCE:
  SectionId[] = [
    "projects",
    "credits",
    "about",
  ];

const INITIAL_SECTION_ID:
  SectionId = "projects";

const DETECTION_SAMPLE_INTERVAL =
  0.06;

const DETECTION_SETTLE_TIME =
  0.1;

const MIN_ROTATION_TRAVEL =
  0.055;

const EXPECTED_CENTER_LIMIT =
  0.48;

const CHANGE_ADVANTAGE =
  0.025;

const HORIZONTAL_VISIBLE_LIMIT =
  1.4;

const CONNECTOR_VISIBLE_LIMIT =
  1.2;

const RETURN_HOME_SUSPEND_MS =
  320;

function getWrappedAngleDelta(
  currentAngle: number,
  previousAngle: number,
) {
  return Math.atan2(
    Math.sin(
      currentAngle -
        previousAngle,
    ),
    Math.cos(
      currentAngle -
        previousAngle,
    ),
  );
}

export default function AutomaticHotspotController({
  activeId,
  paused = false,
  onDetectedHotspot,
  onProjection,
}: AutomaticHotspotControllerProps) {
  const camera =
    useThree(
      (state) =>
        state.camera,
    );

  const size =
    useThree(
      (state) =>
        state.size,
    );

  const detectionEnabledRef =
    useRef(false);

  const manuallyFocusedRef =
    useRef(false);

  const detectedIdRef =
    useRef<SectionId | null>(
      null,
    );

  const candidateIdRef =
    useRef<SectionId | null>(
      null,
    );

  const candidateStartRef =
    useRef(0);

  const previousForwardAngleRef =
    useRef<number | null>(
      null,
    );

  const forwardRawDirectionRef =
    useRef<DetectionDirection>(
      0,
    );

  const currentRawDirectionRef =
    useRef<DetectionDirection>(
      0,
    );

  const previousRawDirectionRef =
    useRef<DetectionDirection>(
      0,
    );

  const angleTravelRef =
    useRef(0);

  const lastDetectionSampleRef =
    useRef(0);

  const suspendDetectionUntilRef =
    useRef(0);

  const worldPointRef =
    useRef(
      new Vector3(),
    );

  const projectedPointRef =
    useRef(
      new Vector3(),
    );

  const activePointRef =
    useRef(
      new Vector3(),
    );

  const cameraForwardRef =
    useRef(
      new Vector3(),
    );

  const flatForwardRef =
    useRef(
      new Vector3(),
    );

  const pointDirectionRef =
    useRef(
      new Vector3(),
    );

  const emitProjection =
    useCallback(
      (
        projection:
          HotspotProjection,
      ) => {
        onProjection?.(
          projection,
        );
      },
      [onProjection],
    );

  const hideConnector =
    useCallback(() => {
      emitProjection({
        x: 0,
        y: 0,
        visible: false,
      });
    }, [emitProjection]);

  const emitDetectedSection =
    useCallback(
      (
        id: SectionId,
        direction:
          DetectionDirection,
      ) => {
        detectedIdRef.current =
          id;

        candidateIdRef.current =
          id;

        candidateStartRef.current =
          0;

        angleTravelRef.current =
          0;

        onDetectedHotspot({
          id,
          direction,
        });
      },
      [onDetectedHotspot],
    );

  /*
   * Start automatic detection after the camera intro.
   * Projects is always the initial card.
   */
  useEffect(() => {
    let enableTimer:
      | number
      | null = null;

    const handleIntro = () => {
      detectionEnabledRef.current =
        false;

      manuallyFocusedRef.current =
        false;

      detectedIdRef.current =
        null;

      candidateIdRef.current =
        null;

      previousForwardAngleRef.current =
        null;

      forwardRawDirectionRef.current =
        0;

      currentRawDirectionRef.current =
        0;

      previousRawDirectionRef.current =
        0;

      angleTravelRef.current =
        0;

      hideConnector();

      if (
        enableTimer !== null
      ) {
        window.clearTimeout(
          enableTimer,
        );
      }

      enableTimer =
        window.setTimeout(
          () => {
            detectionEnabledRef.current =
              true;

            emitDetectedSection(
              INITIAL_SECTION_ID,
              0,
            );
          },

          INTRO_ZOOM_DURATION *
            1000 +
            260,
        );
    };

    window.addEventListener(
      "adventure:intro",
      handleIntro,
    );

    return () => {
      window.removeEventListener(
        "adventure:intro",
        handleIntro,
      );

      if (
        enableTimer !== null
      ) {
        window.clearTimeout(
          enableTimer,
        );
      }
    };
  }, [
    emitDetectedSection,
    hideConnector,
  ]);

  /*
   * Clicking a marker immediately makes its card active.
   */
  useEffect(() => {
    const handleManualHotspot =
      (event: Event) => {
        const customEvent =
          event as ManualHotspotEvent;

        const id =
          customEvent.detail?.id;

        if (!id) {
          return;
        }

        detectedIdRef.current =
          id;

        candidateIdRef.current =
          id;

        previousForwardAngleRef.current =
          null;

        currentRawDirectionRef.current =
          0;

        previousRawDirectionRef.current =
          0;

        angleTravelRef.current =
          0;

        emitDetectedSection(
          id,
          0,
        );
      };

    window.addEventListener(
      MANUAL_HOTSPOT_EVENT,
      handleManualHotspot,
    );

    return () => {
      window.removeEventListener(
        MANUAL_HOTSPOT_EVENT,
        handleManualHotspot,
      );
    };
  }, [emitDetectedSection]);

  /*
   * Disable detection and connector lines during a
   * clicked hotspot close-up.
   */
  useEffect(() => {
    const handleFocusState = (
      event: Event,
    ) => {
      const customEvent =
        event as FocusStateEvent;

      const focused =
        Boolean(
          customEvent.detail
            ?.focused,
        );

      manuallyFocusedRef.current =
        focused;

      candidateIdRef.current =
        null;

      previousForwardAngleRef.current =
        null;

      currentRawDirectionRef.current =
        0;

      previousRawDirectionRef.current =
        0;

      angleTravelRef.current =
        0;

      if (focused) {
        hideConnector();
        return;
      }

      suspendDetectionUntilRef.current =
        performance.now() +
        RETURN_HOME_SUSPEND_MS;
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
  }, [hideConnector]);

  useEffect(() => {
    if (
      paused ||
      manuallyFocusedRef.current
    ) {
      hideConnector();
    }
  }, [
    hideConnector,
    paused,
  ]);

  useFrame(({ clock }) => {
    if (
      paused ||
      manuallyFocusedRef.current ||
      !detectionEnabledRef.current
    ) {
      return;
    }

    camera.getWorldDirection(
      cameraForwardRef.current,
    );

    flatForwardRef.current
      .copy(
        cameraForwardRef.current,
      )
      .setY(0);

    if (
      flatForwardRef.current
        .lengthSq() >
      0.000001
    ) {
      flatForwardRef.current
        .normalize();

      const currentAngle =
        Math.atan2(
          flatForwardRef.current.x,
          flatForwardRef.current.z,
        );

      const previousAngle =
        previousForwardAngleRef.current;

      if (
        previousAngle !== null
      ) {
        const angleDelta =
          getWrappedAngleDelta(
            currentAngle,
            previousAngle,
          );

        if (
          Math.abs(
            angleDelta,
          ) >
          0.00008
        ) {
          const rawDirection:
            DetectionDirection =
            angleDelta > 0
              ? 1
              : -1;

          currentRawDirectionRef.current =
            rawDirection;

          if (
            forwardRawDirectionRef.current ===
            0
          ) {
            const currentId =
              detectedIdRef.current;

            const currentIndex =
              currentId
                ? HOTSPOT_SEQUENCE.indexOf(
                    currentId,
                  )
                : 0;

            forwardRawDirectionRef.current =
              currentIndex ===
              HOTSPOT_SEQUENCE.length -
                1
                ? rawDirection ===
                  1
                  ? -1
                  : 1
                : rawDirection;
          }

          if (
            previousRawDirectionRef.current !==
              0 &&
            previousRawDirectionRef.current !==
              rawDirection
          ) {
            candidateIdRef.current =
              null;

            angleTravelRef.current =
              0;
          }

          previousRawDirectionRef.current =
            rawDirection;

          angleTravelRef.current +=
            Math.abs(
              angleDelta,
            );
        }
      }

      previousForwardAngleRef.current =
        currentAngle;
    }

    /*
     * Follow the active marker with the dotted connector.
     */
    if (activeId) {
      const activeSection =
        SECTIONS.find(
          (section) =>
            section.id ===
            activeId,
        );

      if (activeSection) {
        activePointRef.current.set(
          activeSection.hotspot[0],
          activeSection.hotspot[1],
          activeSection.hotspot[2],
        );

        pointDirectionRef.current
          .subVectors(
            activePointRef.current,
            camera.position,
          )
          .normalize();

        const isInFront =
          cameraForwardRef.current.dot(
            pointDirectionRef.current,
          ) > 0;

        activePointRef.current.project(
          camera,
        );

        const visible =
          isInFront &&
          activePointRef.current.z >=
            -1 &&
          activePointRef.current.z <=
            1 &&
          Math.abs(
            activePointRef.current.x,
          ) <=
            CONNECTOR_VISIBLE_LIMIT &&
          Math.abs(
            activePointRef.current.y,
          ) <=
            CONNECTOR_VISIBLE_LIMIT;

        emitProjection({
          x:
            (activePointRef.current.x *
              0.5 +
              0.5) *
            size.width,

          y:
            (-activePointRef.current.y *
              0.5 +
              0.5) *
            size.height,

          visible,
        });
      }
    } else {
      hideConnector();
    }

    if (
      performance.now() <
      suspendDetectionUntilRef.current
    ) {
      return;
    }

    const elapsedTime =
      clock.elapsedTime;

    if (
      elapsedTime -
        lastDetectionSampleRef.current <
      DETECTION_SAMPLE_INTERVAL
    ) {
      return;
    }

    lastDetectionSampleRef.current =
      elapsedTime;

    const candidateMap =
      new Map<
        SectionId,
        DetectionCandidate
      >();

    /*
     * Only horizontal alignment is scored.
     *
     * Credits is much higher than the other markers,
     * so vertical alignment must not reduce its score.
     */
    for (
      const section of SECTIONS
    ) {
      worldPointRef.current.set(
        section.hotspot[0],
        section.hotspot[1],
        section.hotspot[2],
      );

      pointDirectionRef.current
        .subVectors(
          worldPointRef.current,
          camera.position,
        )
        .normalize();

      const isInFront =
        cameraForwardRef.current.dot(
          pointDirectionRef.current,
        ) > 0;

      projectedPointRef.current
        .copy(
          worldPointRef.current,
        )
        .project(camera);

      const visible =
        isInFront &&
        projectedPointRef.current.z >=
          -1 &&
        projectedPointRef.current.z <=
          1 &&
        Math.abs(
          projectedPointRef.current.x,
        ) <=
          HORIZONTAL_VISIBLE_LIMIT;

      if (!visible) {
        continue;
      }

      candidateMap.set(
        section.id,
        {
          id: section.id,

          score:
            Math.abs(
              projectedPointRef.current.x,
            ),
        },
      );
    }

    const currentId =
      detectedIdRef.current;

    const rawDirection =
      currentRawDirectionRef.current;

    const forwardRawDirection =
      forwardRawDirectionRef.current;

    if (
      !currentId ||
      rawDirection === 0 ||
      forwardRawDirection === 0 ||
      angleTravelRef.current <
        MIN_ROTATION_TRAVEL
    ) {
      return;
    }

    const currentIndex =
      HOTSPOT_SEQUENCE.indexOf(
        currentId,
      );

    if (
      currentIndex === -1
    ) {
      return;
    }

    const logicalDirection:
      DetectionDirection =
      rawDirection ===
      forwardRawDirection
        ? 1
        : -1;

    const expectedIndex =
      currentIndex +
      logicalDirection;

    if (
      expectedIndex < 0 ||
      expectedIndex >=
        HOTSPOT_SEQUENCE.length
    ) {
      candidateIdRef.current =
        null;

      return;
    }

    const expectedId =
      HOTSPOT_SEQUENCE[
        expectedIndex
      ];

    const expectedCandidate =
      candidateMap.get(
        expectedId,
      );

    if (!expectedCandidate) {
      candidateIdRef.current =
        null;

      return;
    }

    const currentCandidate =
      candidateMap.get(
        currentId,
      );

    const currentScore =
      currentCandidate?.score ??
      Number.POSITIVE_INFINITY;

    const expectedIsReady =
      expectedCandidate.score <=
        EXPECTED_CENTER_LIMIT &&
      (expectedCandidate.score +
        CHANGE_ADVANTAGE <
        currentScore ||
        !currentCandidate);

    if (!expectedIsReady) {
      candidateIdRef.current =
        null;

      return;
    }

    if (
      candidateIdRef.current !==
      expectedId
    ) {
      candidateIdRef.current =
        expectedId;

      candidateStartRef.current =
        elapsedTime;

      return;
    }

    if (
      elapsedTime -
        candidateStartRef.current <
      DETECTION_SETTLE_TIME
    ) {
      return;
    }

    emitDetectedSection(
      expectedId,
      logicalDirection,
    );
  });

  return null;
}