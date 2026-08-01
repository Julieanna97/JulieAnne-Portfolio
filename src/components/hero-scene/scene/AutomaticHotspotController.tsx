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
  HOME_TARGET,
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

type HotspotMetrics = {
  id: SectionId;

  sideAngle: number;
  sideError: number;

  projectedX: number;
  projectedY: number;

  inFront: boolean;
  insideDepth: boolean;

  detectable: boolean;
  connectorVisible: boolean;
};

const MANUAL_HOTSPOT_EVENT =
  "adventure:manual-hotspot";

const FOCUS_STATE_EVENT =
  "adventure:focus-state";

/*
 * Physical order around the building.
 *
 * Left to right:
 * Projects -> Credits -> About
 *
 * Right to left:
 * About -> Credits -> Projects
 */
const HOTSPOT_SEQUENCE:
  SectionId[] = [
    "projects",
    "credits",
    "about",
  ];

/*
 * A new traversal may begin from either end.
 *
 * Credits cannot become the first card.
 */
const START_SECTION_IDS:
  SectionId[] = [
    "projects",
    "about",
  ];

/*
 * Run detection frequently enough to catch a quick mouse
 * or touch drag.
 */
const DETECTION_SAMPLE_INTERVAL =
  0.04;

/*
 * The card appears shortly after the marker becomes
 * visible on its side.
 *
 * Raise this to 0.18 if transitions become too sensitive.
 */
const DETECTION_DWELL_TIME =
  0.12;

/*
 * Require only a small amount of travel after the previous
 * card. This works with both idle and manual rotation.
 */
const MIN_ROTATION_TRAVEL =
  0.008;

const ROTATION_EPSILON =
  0.00004;

/*
 * A card may activate as soon as the visitor reaches the
 * visible portion of that building side.
 *
 * 0.92 radians is approximately 53 degrees.
 */
const DETECTION_SIDE_ANGLE_LIMIT =
  0.92;

/*
 * The numbered marker may be near the viewport edge when
 * its building side first becomes visible.
 */
const DETECTION_X_LIMIT =
  1.04;

/*
 * Credits is much higher than Projects and About.
 */
const DETECTION_Y_LIMIT =
  1.28;

/*
 * The dotted connector uses wider limits and no strict
 * building-side requirement.
 *
 * This keeps it updating during manual rotation until the
 * active marker is actually behind the camera or far
 * outside the viewport.
 */
const CONNECTOR_X_LIMIT =
  1.65;

const CONNECTOR_Y_LIMIT =
  1.55;

const RETURN_HOME_SUSPEND_MS =
  260;

/*
 * A candidate that has just passed the exact camera-side
 * angle remains valid within this small allowance.
 */
const PASSED_SIDE_ALLOWANCE =
  0.2;

function getWrappedAngleDelta(
  firstAngle: number,
  secondAngle: number,
) {
  return Math.atan2(
    Math.sin(
      firstAngle -
        secondAngle,
    ),
    Math.cos(
      firstAngle -
        secondAngle,
    ),
  );
}

function getSection(
  id: SectionId,
) {
  return SECTIONS.find(
    (section) =>
      section.id === id,
  );
}

function getAllowedSectionIds(
  currentId:
    | SectionId
    | null,
): SectionId[] {
  if (!currentId) {
    return [
      ...START_SECTION_IDS,
    ];
  }

  const currentIndex =
    HOTSPOT_SEQUENCE.indexOf(
      currentId,
    );

  if (currentIndex === -1) {
    return [
      ...START_SECTION_IDS,
    ];
  }

  const allowedIds:
    SectionId[] = [];

  const previousId =
    HOTSPOT_SEQUENCE[
      currentIndex - 1
    ];

  const nextId =
    HOTSPOT_SEQUENCE[
      currentIndex + 1
    ];

  if (previousId) {
    allowedIds.push(
      previousId,
    );
  }

  if (nextId) {
    allowedIds.push(
      nextId,
    );
  }

  return allowedIds;
}

function getDetectionDirection(
  currentId:
    | SectionId
    | null,

  nextId:
    SectionId,
): DetectionDirection {
  if (!currentId) {
    return 0;
  }

  const currentIndex =
    HOTSPOT_SEQUENCE.indexOf(
      currentId,
    );

  const nextIndex =
    HOTSPOT_SEQUENCE.indexOf(
      nextId,
    );

  if (
    currentIndex === -1 ||
    nextIndex === -1
  ) {
    return 0;
  }

  if (
    nextIndex >
    currentIndex
  ) {
    return 1;
  }

  if (
    nextIndex <
    currentIndex
  ) {
    return -1;
  }

  return 0;
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

  const previousCameraAngleRef =
    useRef<number | null>(
      null,
    );

  /*
   * Current physical camera rotation direction:
   *
   * 1  = increasing camera-side angle
   * -1 = decreasing camera-side angle
   */
  const rotationDirectionRef =
    useRef<DetectionDirection>(
      0,
    );

  const rotationTravelRef =
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

  const cameraForwardRef =
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
          null;

        candidateStartRef.current =
          0;

        rotationTravelRef.current =
          0;

        onDetectedHotspot({
          id,
          direction,
        });
      },
      [onDetectedHotspot],
    );

  /*
   * Keep the controller synchronized with activeId changes
   * made by marker clicks or Home-state interactions.
   */
  useEffect(() => {
    if (
      activeId ===
      detectedIdRef.current
    ) {
      return;
    }

    detectedIdRef.current =
      activeId;

    candidateIdRef.current =
      null;

    candidateStartRef.current =
      0;

    rotationTravelRef.current =
      0;
  }, [activeId]);

  /*
   * Calculate the screen and building-side position of a
   * hotspot.
   *
   * No raycaster is used, avoiding LineSegments2 errors.
   */
  const getHotspotMetrics =
    useCallback(
      (
        id:
          SectionId,

        cameraSideAngle:
          number,
      ): HotspotMetrics => {
        const section =
          getSection(id);

        if (!section) {
          return {
            id,

            sideAngle: 0,
            sideError:
              Math.PI,

            projectedX: 0,
            projectedY: 0,

            inFront: false,
            insideDepth: false,

            detectable: false,
            connectorVisible:
              false,
          };
        }

        worldPointRef.current.set(
          section.hotspot[0],
          section.hotspot[1],
          section.hotspot[2],
        );

        const sideAngle =
          Math.atan2(
            section.hotspot[0] -
              HOME_TARGET[0],

            section.hotspot[2] -
              HOME_TARGET[2],
          );

        const sideError =
          Math.abs(
            getWrappedAngleDelta(
              cameraSideAngle,
              sideAngle,
            ),
          );

        pointDirectionRef.current
          .subVectors(
            worldPointRef.current,
            camera.position,
          )
          .normalize();

        const inFront =
          cameraForwardRef.current.dot(
            pointDirectionRef.current,
          ) > 0.002;

        projectedPointRef.current
          .copy(
            worldPointRef.current,
          )
          .project(
            camera,
          );

        const projectedX =
          projectedPointRef.current.x;

        const projectedY =
          projectedPointRef.current.y;

        const projectedZ =
          projectedPointRef.current.z;

        const insideDepth =
          projectedZ >= -1 &&
          projectedZ <= 1;

        const insideDetectionScreen =
          Math.abs(
            projectedX,
          ) <=
            DETECTION_X_LIMIT &&
          Math.abs(
            projectedY,
          ) <=
            DETECTION_Y_LIMIT;

        const insideDetectionSide =
          sideError <=
          DETECTION_SIDE_ANGLE_LIMIT;

        const connectorVisible =
          inFront &&
          insideDepth &&
          Math.abs(
            projectedX,
          ) <=
            CONNECTOR_X_LIMIT &&
          Math.abs(
            projectedY,
          ) <=
            CONNECTOR_Y_LIMIT;

        return {
          id,

          sideAngle,
          sideError,

          projectedX,
          projectedY,

          inFront,
          insideDepth,

          detectable:
            inFront &&
            insideDepth &&
            insideDetectionScreen &&
            insideDetectionSide,

          connectorVisible,
        };
      },
      [camera],
    );

  /*
   * Automatic detection starts once the entrance camera
   * animation has completed.
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

      candidateStartRef.current =
        0;

      previousCameraAngleRef.current =
        null;

      rotationDirectionRef.current =
        0;

      rotationTravelRef.current =
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
          },

          INTRO_ZOOM_DURATION *
            1000 +
            220,
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
  }, [hideConnector]);

  /*
   * Clicking a numbered marker immediately activates its
   * stack card before the close-up camera animation.
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

        const direction =
          getDetectionDirection(
            detectedIdRef.current,
            id,
          );

        previousCameraAngleRef.current =
          null;

        rotationDirectionRef.current =
          0;

        rotationTravelRef.current =
          0;

        candidateIdRef.current =
          null;

        candidateStartRef.current =
          0;

        emitDetectedSection(
          id,
          direction,
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
   * Detection and connector rendering pause while the
   * camera is inside a clicked close-up view.
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

      candidateStartRef.current =
        0;

      previousCameraAngleRef.current =
        null;

      rotationDirectionRef.current =
        0;

      rotationTravelRef.current =
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

    camera.updateMatrixWorld();

    camera.getWorldDirection(
      cameraForwardRef.current,
    );

    /*
     * This value changes for both idle auto-rotation and
     * manual OrbitControls rotation.
     */
    const cameraSideAngle =
      Math.atan2(
        camera.position.x -
          HOME_TARGET[0],

        camera.position.z -
          HOME_TARGET[2],
      );

    const previousCameraAngle =
      previousCameraAngleRef.current;

    if (
      previousCameraAngle !==
      null
    ) {
      const angleDelta =
        getWrappedAngleDelta(
          cameraSideAngle,
          previousCameraAngle,
        );

      if (
        Math.abs(angleDelta) >
        ROTATION_EPSILON
      ) {
        const nextDirection:
          DetectionDirection =
          angleDelta > 0
            ? 1
            : -1;

        /*
         * A genuine direction reversal clears any dwell
         * that was accumulating for the previous side.
         */
        if (
          rotationDirectionRef.current !==
            0 &&
          rotationDirectionRef.current !==
            nextDirection
        ) {
          candidateIdRef.current =
            null;

          candidateStartRef.current =
            0;

          rotationTravelRef.current =
            Math.abs(
              angleDelta,
            );
        } else {
          rotationTravelRef.current +=
            Math.abs(
              angleDelta,
            );
        }

        rotationDirectionRef.current =
          nextDirection;
      }
    }

    previousCameraAngleRef.current =
      cameraSideAngle;

    const allMetrics =
      HOTSPOT_SEQUENCE.map(
        (id) =>
          getHotspotMetrics(
            id,
            cameraSideAngle,
          ),
      );

    /*
     * Update the dotted connector every frame.
     *
     * This is independent from the stricter automatic card
     * detection zone, allowing it to remain visible during
     * manual rotation.
     */
    if (activeId) {
      const activeMetrics =
        allMetrics.find(
          (metrics) =>
            metrics.id ===
            activeId,
        );

      if (activeMetrics) {
        emitProjection({
          x:
            (activeMetrics.projectedX *
              0.5 +
              0.5) *
            size.width,

          y:
            (-activeMetrics.projectedY *
              0.5 +
              0.5) *
            size.height,

          visible:
            activeMetrics.connectorVisible,
        });
      } else {
        hideConnector();
      }
    } else {
      hideConnector();
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

    if (
      performance.now() <
      suspendDetectionUntilRef.current
    ) {
      candidateIdRef.current =
        null;

      candidateStartRef.current =
        0;

      return;
    }

    const currentId =
      detectedIdRef.current;

    if (
      currentId &&
      rotationTravelRef.current <
        MIN_ROTATION_TRAVEL
    ) {
      candidateIdRef.current =
        null;

      candidateStartRef.current =
        0;

      return;
    }

    const allowedIds =
      getAllowedSectionIds(
        currentId,
      );

    const movementDirection =
      rotationDirectionRef.current;

    /*
     * Only adjacent building sides are considered.
     *
     * Direction filtering prevents the controller from
     * immediately selecting the side it just left when
     * Projects and Credits zones overlap.
     */
    const eligibleCandidate =
      allMetrics
        .filter(
          (metrics) => {
            if (
              !allowedIds.includes(
                metrics.id,
              ) ||
              !metrics.detectable
            ) {
              return false;
            }

            if (
              !currentId ||
              movementDirection === 0
            ) {
              return true;
            }

            const angleToCandidate =
              getWrappedAngleDelta(
                metrics.sideAngle,
                cameraSideAngle,
              );

            const candidateDirection:
              DetectionDirection =
              angleToCandidate > 0
                ? 1
                : -1;

            /*
             * Once the camera has just passed the exact
             * side angle, keep the candidate eligible for
             * a small allowance.
             */
            return (
              candidateDirection ===
                movementDirection ||
              Math.abs(
                angleToCandidate,
              ) <=
                PASSED_SIDE_ALLOWANCE
            );
          },
        )
        .sort(
          (
            first,
            second,
          ) => {
            /*
             * Prefer whichever visible adjacent marker is
             * closest to its building side. Screen position
             * acts as a secondary tie-breaker.
             */
            const firstScore =
              first.sideError *
                0.8 +
              Math.abs(
                first.projectedX,
              ) *
                0.2;

            const secondScore =
              second.sideError *
                0.8 +
              Math.abs(
                second.projectedX,
              ) *
                0.2;

            return (
              firstScore -
              secondScore
            );
          },
        )[0];

    if (!eligibleCandidate) {
      candidateIdRef.current =
        null;

      candidateStartRef.current =
        0;

      return;
    }

    const candidateId =
      eligibleCandidate.id;

    if (
      candidateIdRef.current !==
      candidateId
    ) {
      candidateIdRef.current =
        candidateId;

      candidateStartRef.current =
        elapsedTime;

      return;
    }

    const dwellElapsed =
      elapsedTime -
      candidateStartRef.current;

    if (
      dwellElapsed <
      DETECTION_DWELL_TIME
    ) {
      return;
    }

    const direction =
      getDetectionDirection(
        currentId,
        candidateId,
      );

    emitDetectedSection(
      candidateId,
      direction,
    );
  });

  return null;
}