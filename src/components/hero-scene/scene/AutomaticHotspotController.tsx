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
 * Forward:
 * Projects -> Credits -> About
 *
 * Reverse:
 * About -> Credits -> Projects
 */
const HOTSPOT_SEQUENCE:
  SectionId[] = [
    "projects",
    "credits",
    "about",
  ];

/*
 * A completely new traversal can begin from either end.
 */
const START_SECTION_IDS:
  SectionId[] = [
    "projects",
    "about",
  ];

const DETECTION_SAMPLE_INTERVAL =
  0.04;

/*
 * Keep the card response quick once a numbered hotspot
 * becomes visible.
 */
const DETECTION_DWELL_TIME =
  0.12;

/*
 * Normal card changes require a small amount of camera
 * rotation.
 */
const MIN_ROTATION_TRAVEL =
  0.008;

const ROTATION_EPSILON =
  0.00004;

/*
 * The marker does not need to be exactly centered.
 *
 * The card becomes eligible as soon as the camera reaches
 * the visible portion of that building side.
 */
const DETECTION_SIDE_ANGLE_LIMIT =
  0.92;

const DETECTION_X_LIMIT =
  1.04;

const DETECTION_Y_LIMIT =
  1.28;

/*
 * Keep the dotted connector visible during both automatic
 * and manual rotation.
 */
const CONNECTOR_X_LIMIT =
  1.65;

const CONNECTOR_Y_LIMIT =
  1.55;

const RETURN_HOME_SUSPEND_MS =
  260;

/*
 * Keep a hotspot eligible briefly after the camera passes
 * its exact side angle.
 */
const PASSED_SIDE_ALLOWANCE =
  0.2;

/*
 * This fixes the reverse-rotation problem.
 *
 * When an intermediate card activates late, but the camera
 * is already clearly closer to another hotspot side, the
 * controller may immediately continue to that hotspot
 * without requiring the visitor to rotate away and back.
 */
const CATCH_UP_SIDE_ADVANTAGE =
  0.16;

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

/*
 * When no card is active, only an end card may start the
 * traversal.
 *
 * Once a traversal has started, every other section may be
 * considered. The rotation-direction check later filters
 * out sections behind the camera movement.
 *
 * This lets a quick manual drag go directly:
 *
 * About -> Projects
 *
 * when the visitor has already passed Credits before its
 * dwell timer completes.
 */
function getCandidateSectionIds(
  currentId:
    | SectionId
    | null,
): SectionId[] {
  if (!currentId) {
    return [
      ...START_SECTION_IDS,
    ];
  }

  return HOTSPOT_SEQUENCE.filter(
    (id) =>
      id !== currentId,
  );
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
   * Physical camera movement direction around the model.
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

        /*
         * Normal movement starts counting again after a
         * card change. Catch-up detection can still proceed
         * when the camera is already clearly closer to the
         * following hotspot.
         */
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
   * Synchronize marker clicks and external active-state
   * changes with the automatic controller.
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

  const getHotspotMetrics =
    useCallback(
      (
        id: SectionId,
        cameraSideAngle: number,
      ): HotspotMetrics => {
        const section =
          getSection(id);

        if (!section) {
          return {
            id,

            sideAngle:
              0,

            sideError:
              Math.PI,

            projectedX:
              0,

            projectedY:
              0,

            inFront:
              false,

            insideDepth:
              false,

            detectable:
              false,

            connectorVisible:
              false,
          };
        }

        worldPointRef.current.set(
          section.hotspot[0],
          section.hotspot[1],
          section.hotspot[2],
        );

        /*
         * Calculate the physical building side containing
         * this numbered hotspot.
         */
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
   * Begin automatic detection after the opening camera
   * animation.
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
   * Clicking a numbered hotspot activates its card
   * immediately.
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
   * Pause card detection during a clicked close-up.
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
     * Camera position around the building.
     *
     * This responds to both:
     *
     * - OrbitControls automatic rotation
     * - mouse and touch rotation
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
         * Reset a partially completed dwell when the
         * visitor reverses the camera.
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

    const movementDirection =
      rotationDirectionRef.current;

    const candidateIds =
      getCandidateSectionIds(
        currentId,
      );

    /*
     * Consider every hotspot lying ahead in the current
     * direction.
     *
     * This is the important change from the adjacent-only
     * version.
     */
    const eligibleCandidates =
      allMetrics
        .filter(
          (metrics) => {
            if (
              !candidateIds.includes(
                metrics.id,
              ) ||
              !metrics.detectable
            ) {
              return false;
            }

            if (
              !currentId ||
              movementDirection ===
                0
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
              angleToCandidate >= 0
                ? 1
                : -1;

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
             * Always prefer the hotspot whose physical
             * building side is closest to the camera.
             *
             * This ensures Projects wins over Credits when
             * the camera has already reached the Projects
             * side.
             */
            const firstScore =
              first.sideError *
                1.15 +
              Math.abs(
                first.projectedX,
              ) *
                0.15;

            const secondScore =
              second.sideError *
                1.15 +
              Math.abs(
                second.projectedX,
              ) *
                0.15;

            return (
              firstScore -
              secondScore
            );
          },
        );

    const eligibleCandidate =
      eligibleCandidates[0];

    if (!eligibleCandidate) {
      candidateIdRef.current =
        null;

      candidateStartRef.current =
        0;

      return;
    }

    const currentMetrics =
      currentId
        ? allMetrics.find(
            (metrics) =>
              metrics.id ===
              currentId,
          )
        : undefined;

    /*
     * A normal card change needs some rotation after the
     * previous selection.
     *
     * Catch-up mode bypasses that requirement when the
     * camera is already clearly closer to another hotspot
     * side. This removes the need to rotate away from
     * Projects and then back again.
     */
    const canCatchUp =
      Boolean(
        currentId &&
        currentMetrics &&
        eligibleCandidate.sideError +
          CATCH_UP_SIDE_ADVANTAGE <
          currentMetrics.sideError,
      );

    if (
      currentId &&
      rotationTravelRef.current <
        MIN_ROTATION_TRAVEL &&
      !canCatchUp
    ) {
      candidateIdRef.current =
        null;

      candidateStartRef.current =
        0;

      return;
    }

    const candidateId =
      eligibleCandidate.id;

    /*
     * When the strongest visible hotspot changes from
     * Credits to Projects during a quick drag, restart the
     * dwell timer for Projects rather than finishing the
     * outdated Credits candidate.
     */
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