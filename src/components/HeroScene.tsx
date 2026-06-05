"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { Billboard, ContactShadows, Html, OrbitControls, Text } from "@react-three/drei";
import {
  DoubleSide,
  FrontSide,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NoToneMapping,
  SRGBColorSpace,
  TOUCH,
  Shape,
  Group,
  PointLight,
  Vector3,
} from "three";
import gsap from "gsap";
import IsometricRoom from "../models/IsometricRoom";
import CuteCatBananaController from "../models/CuteCatBananaController";
import OkameBirdFlyer from "../models/OkameBirdFlyer";

type SectionName = "home";

const HOME_CAMERA: [number, number, number] = [18, 16, 20];
const HOME_TARGET: [number, number, number] = [0, 5.5, 0];

const INTRO_CAMERA: [number, number, number] = [-28, 24, 30];
const INTRO_TARGET: [number, number, number] = [0, 7.5, 0];

const LAPTOP_CAMERA: [number, number, number] = [-4.05, 11.56, -3.37];
const LAPTOP_TARGET: [number, number, number] = [-5.56, 11.26, -4.95];

const WINDOW_CAMERA: [number, number, number] = [-2.5, 11.3, 8.5];
const WINDOW_TARGET: [number, number, number] = [7.1, 10, -4.67];

const CREDITS_CAMERA: [number, number, number] = [3.5, 6.2, 6.2];
const CREDITS_TARGET: [number, number, number] = [4.8, 4.3, -1.6];

const getRoomPositionForViewport = (
  position: [number, number, number],
  viewportWidth: number
) => {
  const isCompactViewport = viewportWidth < 768;
  const isTabletViewport = viewportWidth >= 768 && viewportWidth < 1280;
  const scale = isCompactViewport ? 0.78 : isTabletViewport ? 0.9 : 1;
  const yOffset = isCompactViewport ? -0.84 : isTabletViewport ? -0.58 : -0.45;

  return [
    position[0] * scale,
    position[1] * scale + yOffset,
    position[2] * scale,
  ] as [number, number, number];
};

function SoftWebsiteGlow() {
  return (
    <group>
      <mesh position={[-3.5, 1.1, -3.8]} rotation={[0, 0.28, 0]}>
        <planeGeometry args={[5.8, 4.2]} />
        <meshBasicMaterial
          color="#ffc3d8"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[3.7, 1.0, -4]} rotation={[0, -0.28, 0]}>
        <planeGeometry args={[6.2, 4.4]} />
        <meshBasicMaterial
          color="#b9ddff"
          transparent
          opacity={0.11}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 3.1, -4.5]}>
        <planeGeometry args={[5.6, 3.2]} />
        <meshBasicMaterial
          color="#fff0c9"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SoftGroundGlow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.28, 0]}>
      <planeGeometry args={[34, 24]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;

            float peachGlow = 1.0 - smoothstep(0.0, 0.78, distance(uv, vec2(0.28, 0.42)));
            float blueGlow = 1.0 - smoothstep(0.0, 0.82, distance(uv, vec2(0.76, 0.42)));
            float creamGlow = 1.0 - smoothstep(0.0, 0.65, distance(uv, vec2(0.5, 0.52)));

            vec3 color = vec3(1.0, 0.94, 0.86);
            color = mix(color, vec3(1.0, 0.72, 0.82), peachGlow * 0.28);
            color = mix(color, vec3(0.72, 0.84, 1.0), blueGlow * 0.25);
            color = mix(color, vec3(1.0, 0.88, 0.62), creamGlow * 0.12);

            float vignette = 1.0 - smoothstep(0.4, 0.92, distance(uv, vec2(0.5, 0.5)));
            color *= 0.95 + vignette * 0.08;

            float edgeFade =
              smoothstep(0.0, 0.18, uv.x) *
              smoothstep(1.0, 0.82, uv.x) *
              smoothstep(0.0, 0.16, uv.y) *
              smoothstep(1.0, 0.82, uv.y);

            gl_FragColor = vec4(color, edgeFade * 0.38);
          }
        `}
      />
    </mesh>
  );
}


/*
  Full-screen white bling stars for dark mode.

  These are CSS stars outside the 3D Canvas so they fill the entire homepage
  background while staying behind the room and never blocking hotspots.
*/
function ScreenNightSkyStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 78 }, (_, index) => {
        const size = 5 + ((index * 7) % 11);

        return {
          id: index,
          left: `${(index * 37 + 11) % 100}%`,
          top: `${(index * 53 + 7) % 96}%`,
          size,
          delay: `${-((index * 0.37) % 5.4)}s`,
          duration: `${2.6 + ((index * 13) % 24) / 10}s`,
          rotation: `${(index * 29) % 90}deg`,
          opacity: 0.42 + ((index * 17) % 36) / 100,
        };
      }),
    []
  );

  return (
    <div className="night-sky-stars" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="night-sky-star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
            rotate: star.rotation,
          }}
        />
      ))}

      <style jsx>{`
        .night-sky-stars {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .night-sky-star {
          position: absolute;
          display: block;
          transform-origin: center;
          animation-name: night-sky-twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.75));
        }

        .night-sky-star::before,
        .night-sky-star::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.96);
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.82);
        }

        .night-sky-star::before {
          width: 100%;
          height: 1.6px;
        }

        .night-sky-star::after {
          width: 1.6px;
          height: 100%;
        }

        @keyframes night-sky-twinkle {
          0%,
          100% {
            transform: scale(0.55) rotate(0deg);
            opacity: 0.26;
          }

          45% {
            transform: scale(1.18) rotate(8deg);
            opacity: 1;
          }

          70% {
            transform: scale(0.82) rotate(-5deg);
            opacity: 0.58;
          }
        }
      `}</style>
    </div>
  );
}


/*
  Animated bathtub interaction.

  The effect is placed inside the transformed room group, so these
  coordinates use the same model-local coordinate system as the GLB.

  First click:
  - starts the shower stream
  - gradually raises the bath water

  Second click:
  - stops the shower
  - gradually drains the bath
*/
function BathtubWaterEffect({
  mode,
  onFilled,
  onDrained,
}: {
  mode: "empty" | "filling" | "full" | "draining";
  onFilled: () => void;
  onDrained: () => void;
}) {
  const waterSurfaceRef = useRef<Mesh>(null);
  const waterMaterialRef = useRef<MeshPhysicalMaterial>(null);

  const streamRef = useRef<Mesh>(null);
  const streamMaterialRef = useRef<MeshPhysicalMaterial>(null);

  const splashRingOneRef = useRef<Mesh>(null);
  const splashRingTwoRef = useRef<Mesh>(null);

  const splashMaterialOneRef = useRef<MeshBasicMaterial>(null);
  const splashMaterialTwoRef = useRef<MeshBasicMaterial>(null);

  const fillProgressRef = useRef(0);
  const hasReportedFilledRef = useRef(false);
  const hasReportedDrainedRef = useRef(true);

  /*
    Model-local positions measured from the GLB:
    - bathtub bounds: x -8.208 to -1.372, z 3.181 to 6.506
    - shower head: around x -7.70, y 6.74, z 4.97
  */
  const tubCenterX = -4.79;
  const tubCenterZ = 4.84;

  /*
    The shower is mounted against the wall, but the water should land
    slightly inward inside the bathtub rather than falling down the wall.
  */
  const showerStartX = -7.69;
  const showerStartY = 6.48;
  const showerStartZ = 4.97;

  const showerLandingX = -6.98;
  const showerLandingZ = 4.97;

  const minimumWaterY = 1.02;
  const maximumWaterY = 1.82;

  /*
    Rounded capsule-like water surface. This follows the bathtub opening
    much more closely than the old rectangular plane, so water does not
    visibly extend over the outside walls of the tub.
  */
  const waterSurfaceShape = useMemo(() => {
    const width = 5.48;
    const depth = 2.18;
    const radius = depth / 2;
    const halfWidth = width / 2;
    const halfDepth = depth / 2;

    const shape = new Shape();

    shape.moveTo(-halfWidth + radius, -halfDepth);
    shape.lineTo(halfWidth - radius, -halfDepth);
    shape.absarc(halfWidth - radius, 0, radius, -Math.PI / 2, Math.PI / 2, false);
    shape.lineTo(-halfWidth + radius, halfDepth);
    shape.absarc(-halfWidth + radius, 0, radius, Math.PI / 2, Math.PI * 1.5, false);
    shape.closePath();

    return shape;
  }, []);

  useFrame((state, delta) => {
    const shouldStayFilled = mode === "filling" || mode === "full";
    const target = shouldStayFilled ? 1 : 0;
    const speed = mode === "draining" ? 0.68 : 0.38;

    fillProgressRef.current = MathUtils.damp(
      fillProgressRef.current,
      target,
      speed,
      delta
    );

    const fillProgress = fillProgressRef.current;

    const currentWaterY = MathUtils.lerp(
      minimumWaterY,
      maximumWaterY,
      fillProgress
    );

    if (waterSurfaceRef.current) {
      waterSurfaceRef.current.position.y = currentWaterY;

      const subtleRipple =
        1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.006;

      waterSurfaceRef.current.scale.set(
        subtleRipple,
        subtleRipple,
        1
      );
    }

    if (waterMaterialRef.current) {
      waterMaterialRef.current.opacity =
        fillProgress > 0.015
          ? 0.22 + fillProgress * 0.38
          : 0;
    }

    /*
      The shower only runs while the tub is actively filling.
      As soon as the water reaches the maximum level, onFilled switches
      the mode to "full", which stops the stream but keeps the water visible.
    */
    const showerRunning = mode === "filling" && fillProgress < 0.985;

    const streamBottomY = Math.max(
      currentWaterY + 0.08,
      1.18
    );

    /*
      Aim the shower stream diagonally from the wall-mounted shower head
      toward a landing point inside the tub. A vertical stream would pour
      outside the tub because the shower fixture sits close to the wall.
    */
    const streamStart = new Vector3(
      showerStartX,
      showerStartY,
      showerStartZ
    );

    const streamEnd = new Vector3(
      showerLandingX,
      streamBottomY,
      showerLandingZ
    );

    const streamDirection = streamEnd.clone().sub(streamStart);
    const streamHeight = streamDirection.length();

    if (streamRef.current) {
      streamRef.current.visible = showerRunning;

      streamRef.current.position
        .copy(streamStart)
        .add(streamEnd)
        .multiplyScalar(0.5);

      streamRef.current.quaternion.setFromUnitVectors(
        new Vector3(0, 1, 0),
        streamDirection.normalize()
      );

      streamRef.current.scale.set(
        1,
        streamHeight,
        1
      );
    }

    if (streamMaterialRef.current) {
      streamMaterialRef.current.opacity = showerRunning
        ? 0.58 + Math.sin(state.clock.elapsedTime * 8) * 0.08
        : 0;
    }

    const splashVisible = showerRunning && fillProgress > 0.015;
    const splashTime = state.clock.elapsedTime;

    const updateSplashRing = (
      ring: Mesh | null,
      material: MeshBasicMaterial | null,
      phase: number
    ) => {
      if (!ring || !material) return;

      ring.visible = splashVisible;
      ring.position.set(
        showerLandingX,
        currentWaterY + 0.018,
        showerLandingZ
      );

      const cycle = (splashTime * 1.55 + phase) % 1;
      const scale = 0.45 + cycle * 1.35;

      ring.scale.set(scale, scale, scale);

      material.opacity = splashVisible
        ? (1 - cycle) * 0.5
        : 0;
    };

    updateSplashRing(
      splashRingOneRef.current,
      splashMaterialOneRef.current,
      0
    );

    updateSplashRing(
      splashRingTwoRef.current,
      splashMaterialTwoRef.current,
      0.52
    );

    if (fillProgress >= 0.985 && mode === "filling") {
      if (!hasReportedFilledRef.current) {
        hasReportedFilledRef.current = true;
        hasReportedDrainedRef.current = false;
        onFilled();
      }
    } else if (fillProgress < 0.98) {
      hasReportedFilledRef.current = false;
    }

    if (fillProgress <= 0.015 && mode === "draining") {
      if (!hasReportedDrainedRef.current) {
        hasReportedDrainedRef.current = true;
        onDrained();
      }
    } else if (fillProgress > 0.02) {
      hasReportedDrainedRef.current = false;
    }
  });

  return (
    <group>
      {/* Rounded water surface that stays within the tub opening. */}
      <mesh
        ref={waterSurfaceRef}
        position={[
          tubCenterX,
          minimumWaterY,
          tubCenterZ,
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={3}
      >
        <shapeGeometry args={[waterSurfaceShape, 32]} />

        <meshPhysicalMaterial
          ref={waterMaterialRef}
          color="#78d7ff"
          transparent
          opacity={0}
          roughness={0.08}
          metalness={0}
          transmission={0.18}
          thickness={0.08}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Shower stream stretched to meet the rising water level. */}
      <mesh
        ref={streamRef}
        visible={false}
        position={[
          showerStartX,
          3.8,
          showerStartZ,
        ]}
      >
        <cylinderGeometry
          args={[
            0.055,
            0.07,
            1,
            14,
          ]}
        />

        <meshPhysicalMaterial
          ref={streamMaterialRef}
          color="#a9e9ff"
          transparent
          opacity={0}
          roughness={0.02}
          metalness={0}
          transmission={0.24}
          depthWrite={false}
        />
      </mesh>

      {/* Small splash rings at the stream impact point. */}
      <mesh
        ref={splashRingOneRef}
        visible={false}
        position={[
          showerLandingX,
          minimumWaterY + 0.018,
          showerLandingZ,
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.11, 0.16, 20]} />

        <meshBasicMaterial
          ref={splashMaterialOneRef}
          color="#d5f6ff"
          transparent
          opacity={0}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={splashRingTwoRef}
        visible={false}
        position={[
          showerLandingX,
          minimumWaterY + 0.02,
          showerLandingZ,
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.1, 0.145, 20]} />

        <meshBasicMaterial
          ref={splashMaterialTwoRef}
          color="#d5f6ff"
          transparent
          opacity={0}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}


/*
  Animated bathroom-sink interaction.

  This mirrors the bathtub behavior on a smaller scale:
  - click the sink to start the faucet
  - the basin gradually fills
  - the faucet switches off automatically when the basin is full
  - click again to drain the water

  All positions below use the GLB model-local coordinate system.
*/
function SinkWaterEffect({
  mode,
  onFilled,
  onDrained,
}: {
  mode: "empty" | "filling" | "full" | "draining";
  onFilled: () => void;
  onDrained: () => void;
}) {
  const waterSurfaceRef = useRef<Mesh>(null);
  const waterMaterialRef = useRef<MeshPhysicalMaterial>(null);

  const streamRef = useRef<Mesh>(null);
  const streamMaterialRef = useRef<MeshPhysicalMaterial>(null);

  const splashRingOneRef = useRef<Mesh>(null);
  const splashRingTwoRef = useRef<Mesh>(null);

  const splashMaterialOneRef = useRef<MeshBasicMaterial>(null);
  const splashMaterialTwoRef = useRef<MeshBasicMaterial>(null);

  const fillProgressRef = useRef(0);
  const hasReportedFilledRef = useRef(false);
  const hasReportedDrainedRef = useRef(true);

  /*
    GLB sink bounds:
    - basin mesh: x -8.242 to -6.614, z 0.626 to 2.528
    - crane mesh: x -8.236 to -7.681, y 3.839 to 4.478, z 1.144 to 2.022
  */
  const sinkCenterX = -7.43;
  const sinkCenterZ = 1.58;

  /*
    The faucet outlet faces straight downward.

    Keep the start and landing X/Z coordinates identical so the stream
    falls vertically at a 90-degree angle from the visible faucet nozzle
    into the sink basin.
  */
  const faucetStartX = -7.72;
  const faucetStartY = 4.25;
  const faucetStartZ = 1.58;

  const faucetLandingX = -7.72;
  const faucetLandingZ = 1.58;

  const minimumWaterY = 3.22;
  const maximumWaterY = 3.48;

  /*
    Small rounded rectangle that stays inside the sink basin.
  */
  const waterSurfaceShape = useMemo(() => {
    const width = 1.22;
    const depth = 1.02;
    const radius = 0.22;
    const halfWidth = width / 2;
    const halfDepth = depth / 2;

    const shape = new Shape();

    shape.moveTo(-halfWidth + radius, -halfDepth);
    shape.lineTo(halfWidth - radius, -halfDepth);
    shape.quadraticCurveTo(halfWidth, -halfDepth, halfWidth, -halfDepth + radius);
    shape.lineTo(halfWidth, halfDepth - radius);
    shape.quadraticCurveTo(halfWidth, halfDepth, halfWidth - radius, halfDepth);
    shape.lineTo(-halfWidth + radius, halfDepth);
    shape.quadraticCurveTo(-halfWidth, halfDepth, -halfWidth, halfDepth - radius);
    shape.lineTo(-halfWidth, -halfDepth + radius);
    shape.quadraticCurveTo(-halfWidth, -halfDepth, -halfWidth + radius, -halfDepth);
    shape.closePath();

    return shape;
  }, []);

  useFrame((state, delta) => {
    const shouldStayFilled = mode === "filling" || mode === "full";
    const target = shouldStayFilled ? 1 : 0;
    const speed = mode === "draining" ? 0.92 : 0.52;

    fillProgressRef.current = MathUtils.damp(
      fillProgressRef.current,
      target,
      speed,
      delta
    );

    const fillProgress = fillProgressRef.current;
    const currentWaterY = MathUtils.lerp(
      minimumWaterY,
      maximumWaterY,
      fillProgress
    );

    if (waterSurfaceRef.current) {
      waterSurfaceRef.current.position.y = currentWaterY;

      const subtleRipple =
        1 + Math.sin(state.clock.elapsedTime * 3.2) * 0.008;

      waterSurfaceRef.current.scale.set(
        subtleRipple,
        subtleRipple,
        1
      );
    }

    if (waterMaterialRef.current) {
      waterMaterialRef.current.opacity =
        fillProgress > 0.015
          ? 0.2 + fillProgress * 0.42
          : 0;
    }

    /* Stop the faucet automatically once the sink is full. */
    const faucetRunning = mode === "filling" && fillProgress < 0.985;

    const streamBottomY = Math.max(
      currentWaterY + 0.05,
      minimumWaterY + 0.04
    );

    const streamStart = new Vector3(
      faucetStartX,
      faucetStartY,
      faucetStartZ
    );

    const streamEnd = new Vector3(
      faucetLandingX,
      streamBottomY,
      faucetLandingZ
    );

    const streamDirection = streamEnd.clone().sub(streamStart);
    const streamHeight = Math.max(streamDirection.length(), 0.05);

    if (streamRef.current) {
      streamRef.current.visible = faucetRunning;

      streamRef.current.position
        .copy(streamStart)
        .add(streamEnd)
        .multiplyScalar(0.5);

      streamRef.current.quaternion.setFromUnitVectors(
        new Vector3(0, 1, 0),
        streamDirection.normalize()
      );

      streamRef.current.scale.set(1, streamHeight, 1);
    }

    if (streamMaterialRef.current) {
      streamMaterialRef.current.opacity = faucetRunning
        ? 0.72 + Math.sin(state.clock.elapsedTime * 9) * 0.06
        : 0;
    }

    const splashVisible = faucetRunning && fillProgress > 0.015;
    const splashTime = state.clock.elapsedTime;

    const updateSplashRing = (
      ring: Mesh | null,
      material: MeshBasicMaterial | null,
      phase: number
    ) => {
      if (!ring || !material) return;

      ring.visible = splashVisible;
      ring.position.set(
        faucetLandingX,
        currentWaterY + 0.012,
        faucetLandingZ
      );

      const cycle = (splashTime * 1.9 + phase) % 1;
      const scale = 0.26 + cycle * 0.78;

      ring.scale.set(scale, scale, scale);
      material.opacity = splashVisible ? (1 - cycle) * 0.46 : 0;
    };

    updateSplashRing(
      splashRingOneRef.current,
      splashMaterialOneRef.current,
      0
    );

    updateSplashRing(
      splashRingTwoRef.current,
      splashMaterialTwoRef.current,
      0.5
    );

    if (fillProgress >= 0.985 && mode === "filling") {
      if (!hasReportedFilledRef.current) {
        hasReportedFilledRef.current = true;
        hasReportedDrainedRef.current = false;
        onFilled();
      }
    } else if (fillProgress < 0.98) {
      hasReportedFilledRef.current = false;
    }

    if (fillProgress <= 0.015 && mode === "draining") {
      if (!hasReportedDrainedRef.current) {
        hasReportedDrainedRef.current = true;
        onDrained();
      }
    } else if (fillProgress > 0.02) {
      hasReportedDrainedRef.current = false;
    }
  });

  return (
    <group>
      {/* Water inside the sink basin. */}
      <mesh
        ref={waterSurfaceRef}
        position={[sinkCenterX, minimumWaterY, sinkCenterZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={4}
      >
        <shapeGeometry args={[waterSurfaceShape, 24]} />

        <meshPhysicalMaterial
          ref={waterMaterialRef}
          color="#77d9ff"
          transparent
          opacity={0}
          roughness={0.07}
          metalness={0}
          transmission={0.16}
          thickness={0.05}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Thin vertical faucet stream that starts at the visible nozzle. */}
      <mesh
        ref={streamRef}
        visible={false}
        position={[faucetStartX, 3.7, faucetStartZ]}
        renderOrder={6}
      >
        <cylinderGeometry args={[0.03, 0.038, 1, 12]} />

        <meshPhysicalMaterial
          ref={streamMaterialRef}
          color="#b5edff"
          transparent
          opacity={0}
          roughness={0.02}
          metalness={0}
          transmission={0.18}
          depthWrite={false}
        />
      </mesh>

      {/* Small animated ripple rings where the faucet water lands. */}
      <mesh
        ref={splashRingOneRef}
        visible={false}
        position={[faucetLandingX, minimumWaterY + 0.012, faucetLandingZ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.045, 0.07, 18]} />
        <meshBasicMaterial
          ref={splashMaterialOneRef}
          color="#d9f7ff"
          transparent
          opacity={0}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={splashRingTwoRef}
        visible={false}
        position={[faucetLandingX, minimumWaterY + 0.014, faucetLandingZ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.04, 0.062, 18]} />
        <meshBasicMaterial
          ref={splashMaterialTwoRef}
          color="#d9f7ff"
          transparent
          opacity={0}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}


/*
  Interactive bathroom mirror border light.

  The mirror above the sink is mounted on the left bathroom wall.
  Clicking the invisible hotspot toggles a soft pink-lilac illuminated
  border. The effect uses the GLB model-local coordinate system so it
  follows the room rotation and responsive scaling automatically.
*/
function MirrorBorderLight({
  isOn,
  isNightMode,
  disabled,
  onToggle,
}: {
  isOn: boolean;
  isNightMode: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const mirrorX = -8.16;
  const mirrorCenterY = 6.24;
  const mirrorCenterZ = 1.59;

  const frameHeight = 3.48;
  const frameWidth = 1.86;
  const frameThickness = 0.09;

  return (
    <group>
      {isOn && (
        <>
          {/* Soft ambient glow around the mirror frame. */}
          <pointLight
            position={[-7.72, mirrorCenterY, mirrorCenterZ]}
            intensity={isNightMode ? 2.2 : 1.25}
            distance={3.2}
            decay={2}
            color="#ff9de8"
          />

          {/* Left illuminated border. */}
          <mesh
            position={[
              mirrorX,
              mirrorCenterY,
              mirrorCenterZ - frameWidth / 2,
            ]}
          >
            <boxGeometry args={[0.1, frameHeight, frameThickness]} />
            <meshStandardMaterial
              color="#ffd8f6"
              emissive="#ff8ce2"
              emissiveIntensity={4.2}
            />
          </mesh>

          {/* Right illuminated border. */}
          <mesh
            position={[
              mirrorX,
              mirrorCenterY,
              mirrorCenterZ + frameWidth / 2,
            ]}
          >
            <boxGeometry args={[0.1, frameHeight, frameThickness]} />
            <meshStandardMaterial
              color="#ffd8f6"
              emissive="#ff8ce2"
              emissiveIntensity={4.2}
            />
          </mesh>

          {/* Top illuminated border. */}
          <mesh
            position={[
              mirrorX,
              mirrorCenterY + frameHeight / 2,
              mirrorCenterZ,
            ]}
          >
            <boxGeometry args={[0.1, frameThickness, frameWidth]} />
            <meshStandardMaterial
              color="#ffd8f6"
              emissive="#ff8ce2"
              emissiveIntensity={4.2}
            />
          </mesh>

          {/* Bottom illuminated border. */}
          <mesh
            position={[
              mirrorX,
              mirrorCenterY - frameHeight / 2,
              mirrorCenterZ,
            ]}
          >
            <boxGeometry args={[0.1, frameThickness, frameWidth]} />
            <meshStandardMaterial
              color="#ffd8f6"
              emissive="#ff8ce2"
              emissiveIntensity={4.2}
            />
          </mesh>
        </>
      )}

      {/* Larger invisible hotspot covering the bathroom mirror. */}
      <mesh
        position={[-7.98, mirrorCenterY, mirrorCenterZ]}
        onClick={(event) => {
          event.stopPropagation();

          if (!disabled) {
            onToggle();
          }
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry args={[0.5, 3.72, 2.1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}


/*
  Cozy interactive bed animation.

  Clicking the bed replays a short bedtime sequence:
  - a dreamy cloud appears over the pillow
  - floating Zzzz... text drifts upward
  - tiny sparkles twinkle around the cloud
  - a warm pillow / cat-headboard glow pulses gently

  All coordinates are model-local, so the effect follows the upstairs
  bedroom correctly when the complete room rotates or scales.
*/
function BedtimeEffect({
  replayKey,
}: {
  replayKey: number;
}) {
  const dreamCloudRef = useRef<Group>(null);
  const pillowGlowRef = useRef<PointLight>(null);

  const zTextGroupRef = useRef<Group>(null);
  const zTextRef = useRef<any>(null);

  const sparkleRefs = useRef<Array<Mesh | null>>([]);

  const elapsedRef = useRef(999);

  useEffect(() => {
    if (replayKey <= 0) return;

    elapsedRef.current = 0;
  }, [replayKey]);

  useFrame((state, delta) => {
    elapsedRef.current += delta;

    const elapsed = elapsedRef.current;
    const isActive = elapsed < 6.2;

    /*
      Dream cloud:
      fade it in after the blanket settles, float it gently, then fade out.
    */
    if (dreamCloudRef.current) {
      const cloudStarts = 0.65;
      const cloudEnds = 5.95;
      const cloudIsVisible =
        elapsed >= cloudStarts && elapsed <= cloudEnds;

      dreamCloudRef.current.visible = cloudIsVisible;

      if (cloudIsVisible) {
        const fadeIn = Math.min((elapsed - cloudStarts) / 0.62, 1);
        const fadeOut = Math.min((cloudEnds - elapsed) / 0.72, 1);
        const cloudScale = Math.max(
          0,
          Math.min(fadeIn, fadeOut)
        );

        dreamCloudRef.current.scale.setScalar(cloudScale);

        dreamCloudRef.current.position.y =
          12.52 +
          Math.sin(state.clock.elapsedTime * 1.55) * 0.11;

        dreamCloudRef.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 0.78) * 0.08;
      }
    }

    /*
      Floating Zzzz... text:
      a cozy sleepy label drifts upward slowly above the cat pillow.
    */
    if (zTextGroupRef.current) {
      const textStarts = 0.45;
      const textEnds = 5.95;
      const textVisible =
        isActive && elapsed >= textStarts && elapsed <= textEnds;

      zTextGroupRef.current.visible = textVisible;

      if (textVisible) {
        const localElapsed = elapsed - textStarts;
        const progress = Math.min(localElapsed / (textEnds - textStarts), 1);

        zTextGroupRef.current.position.set(
          -6.18 + Math.sin(state.clock.elapsedTime * 1.1) * 0.08,
          12.72 + progress * 0.9,
          4.0 + Math.sin(state.clock.elapsedTime * 0.85) * 0.06
        );

        const pulse =
          0.98 + Math.sin(state.clock.elapsedTime * 2.15) * 0.08;

        zTextGroupRef.current.scale.setScalar(pulse);

        if (zTextRef.current?.material) {
          const fadeIn = Math.min(localElapsed / 0.42, 1);
          const fadeOut = Math.min((textEnds - elapsed) / 0.72, 1);

          zTextRef.current.material.opacity =
            Math.max(0, Math.min(fadeIn, fadeOut)) * 0.98;
        }
      }
    }

    /*
      Sparkles:
      twinkle around the dream cloud and drift subtly upward.
    */
    sparkleRefs.current.forEach(
      (sparkle, index) => {
        if (!sparkle) return;

        const sparkleStarts =
          0.78 + index * 0.12;

        const sparkleEnds =
          5.72 - index * 0.08;

        const visible =
          elapsed >= sparkleStarts &&
          elapsed <= sparkleEnds;

        sparkle.visible = visible;

        if (!visible) return;

        const twinkle =
          0.45 +
          Math.sin(
            state.clock.elapsedTime *
              (3.8 + index * 0.34) +
              index
          ) *
            0.32;

        sparkle.scale.setScalar(
          Math.max(0.14, twinkle)
        );

        sparkle.position.y +=
          Math.sin(
            state.clock.elapsedTime * 1.25 +
              index
          ) *
          0.0009;
      }
    );

    /*
      Warm glow:
      softly illuminates the cat headboard and pillow area.
    */
    if (pillowGlowRef.current) {
      pillowGlowRef.current.intensity =
        isActive
          ? 0.7 +
            Math.sin(
              state.clock.elapsedTime * 2.1
            ) *
              0.2
          : 0;
    }
  });

  return (
    <group>
      {/* Dream cloud floating above the pillow. */}
      <group
        ref={dreamCloudRef}
        visible={false}
        position={[-6.36, 12.52, 4.58]}
      >
        <mesh position={[-0.34, 0, 0]}>
          <sphereGeometry args={[0.34, 16, 16]} />
          <meshBasicMaterial
            color="#f8dcff"
            transparent
            opacity={0.58}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0, 0.12, 0.03]}>
          <sphereGeometry args={[0.44, 16, 16]} />
          <meshBasicMaterial
            color="#ffe8ff"
            transparent
            opacity={0.62}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0.42, -0.02, 0]}>
          <sphereGeometry args={[0.31, 16, 16]} />
          <meshBasicMaterial
            color="#e8dcff"
            transparent
            opacity={0.58}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0.05, -0.18, 0.03]}>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial
            color="#f2dcff"
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        </mesh>

        {/* Tiny stars inside the dream cloud. */}
        <mesh position={[-0.1, 0.12, 0.37]}>
          <octahedronGeometry args={[0.11, 0]} />
          <meshBasicMaterial
            color="#fff4a8"
            transparent
            opacity={0.95}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0.28, -0.05, 0.35]}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshBasicMaterial
            color="#ffd2f3"
            transparent
            opacity={0.95}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Floating sleepy Zzzz... text that always faces the visitor. */}
      <Billboard
        ref={zTextGroupRef}
        visible={false}
        position={[-6.18, 12.72, 4.0]}
        follow
      >
        <Text
          ref={zTextRef}
          fontSize={0.54}
          color="#fff1fb"
          anchorX="center"
          anchorY="middle"
          material-transparent
          material-opacity={0}
          material-depthTest={false}
          outlineWidth={0.018}
          outlineColor="#87518f"
          renderOrder={30}
        >
          Zzzz...
        </Text>
      </Billboard>

      {/* Twinkling sparkles surrounding the cloud. */}
      {[
        [-6.94, 12.38, 4.22],
        [-6.03, 12.89, 4.76],
        [-6.46, 13.16, 4.16],
        [-5.78, 12.44, 4.4],
        [-6.88, 12.91, 4.69],
      ].map((position, index) => (
        <mesh
          key={`bed-sparkle-${index}`}
          ref={(mesh) => {
            sparkleRefs.current[index] =
              mesh;
          }}
          visible={false}
          position={
            position as [
              number,
              number,
              number,
            ]
          }
        >
          <octahedronGeometry
            args={[
              index % 2 === 0
                ? 0.11
                : 0.075,
              0,
            ]}
          />

          <meshBasicMaterial
            color={
              index % 2 === 0
                ? "#fff0a8"
                : "#ffc9ef"
            }
            transparent
            opacity={0.92}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Warm light pulsing around the pillow and cat-shaped headboard. */}
      <pointLight
        ref={pillowGlowRef}
        position={[-7.18, 11.26, 4.59]}
        intensity={0}
        distance={3.2}
        decay={2}
        color="#ffb4dc"
      />
    </group>
  );
}


/*
  Interactive dream-gallery frames above the upstairs bed.

  Each frame can be clicked independently:
  - left frame reveals a softly pulsing heart
  - middle frame reveals a rocking crescent moon
  - right frame reveals a twinkling star

  When all three frames are active, they play a short left-to-right wave
  and release a few tiny pastel sparkles above the bed.

  All coordinates use the GLB model-local coordinate system so the effect
  stays aligned when the complete room rotates or scales responsively.
*/
function DreamGalleryFrames({
  disabled,
}: {
  disabled: boolean;
}) {
  const frameCenters: Array<[number, number, number]> = [
    [-8.12, 12.72, 6.05],
    [-8.12, 12.72, 4.61],
    [-8.12, 12.72, 3.21],
  ];

  const frameColors = [
    "#ffb6ce",
    "#caa7ff",
    "#9edcff",
  ];

  const frameGlowColors = [
    "#ff8fb9",
    "#bb8dff",
    "#7fcfff",
  ];

  const iconColors = [
    "#fff0f6",
    "#fff4c7",
    "#fff0a6",
  ];

  const [activeFrames, setActiveFrames] = useState([
    false,
    false,
    false,
  ]);

  const frameGroupRefs = useRef<Array<Group | null>>([]);
  const iconGroupRefs = useRef<Array<Group | null>>([]);
  const sparkleRefs = useRef<Array<Mesh | null>>([]);

  const clockRef = useRef(0);
  const clickPulseStartRefs = useRef([-99, -99, -99]);
  const waveStartRef = useRef(-99);

  const heartShape = useMemo(() => {
    const shape = new Shape();

    shape.moveTo(0, -0.18);
    shape.bezierCurveTo(-0.42, -0.48, -0.7, -0.06, -0.42, 0.22);
    shape.bezierCurveTo(-0.2, 0.44, 0, 0.26, 0, 0.09);
    shape.bezierCurveTo(0, 0.26, 0.2, 0.44, 0.42, 0.22);
    shape.bezierCurveTo(0.7, -0.06, 0.42, -0.48, 0, -0.18);
    shape.closePath();

    return shape;
  }, []);

  const starShape = useMemo(() => {
    const shape = new Shape();
    const outerRadius = 0.39;
    const innerRadius = 0.17;
    const points = 5;

    for (let index = 0; index < points * 2; index += 1) {
      const radius = index % 2 === 0 ? outerRadius : innerRadius;
      const angle = -Math.PI / 2 + (index * Math.PI) / points;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (index === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }

    shape.closePath();

    return shape;
  }, []);

  const toggleFrame = (index: number) => {
    if (disabled) return;

    clickPulseStartRefs.current[index] = clockRef.current;

    setActiveFrames((currentFrames) => {
      const nextFrames = [...currentFrames];
      nextFrames[index] = !nextFrames[index];

      if (nextFrames.every(Boolean)) {
        waveStartRef.current = clockRef.current;
      }

      return nextFrames;
    });
  };

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    clockRef.current = elapsed;

    const waveElapsed = elapsed - waveStartRef.current;
    const waveIsActive = waveElapsed >= 0 && waveElapsed <= 3.15;

    frameGroupRefs.current.forEach((frameGroup, index) => {
      if (!frameGroup) return;

      const clickElapsed = elapsed - clickPulseStartRefs.current[index];
      const clickPulse =
        clickElapsed >= 0 && clickElapsed <= 0.76
          ? Math.sin((clickElapsed / 0.76) * Math.PI)
          : 0;

      const waveDelay = index * 0.2;
      const localWaveElapsed = waveElapsed - waveDelay;
      const wavePulse =
        waveIsActive && localWaveElapsed >= 0 && localWaveElapsed <= 0.92
          ? Math.sin((localWaveElapsed / 0.92) * Math.PI)
          : 0;

      const popAmount = clickPulse * 0.18 + wavePulse * 0.16;
      const tiltAmount = (clickPulse * 0.1 + wavePulse * 0.075) *
        (index % 2 === 0 ? 1 : -1);

      frameGroup.position.x = frameCenters[index][0] + popAmount;
      frameGroup.rotation.x = tiltAmount;

      const frameScale = 1 + clickPulse * 0.1 + wavePulse * 0.09;
      frameGroup.scale.setScalar(frameScale);
    });

    iconGroupRefs.current.forEach((iconGroup, index) => {
      if (!iconGroup) return;

      const isActive = activeFrames[index];
      iconGroup.visible = isActive;

      if (!isActive) return;

      if (index === 0) {
        const heartbeat = 1 + Math.sin(elapsed * 4.4) * 0.08;
        iconGroup.scale.setScalar(heartbeat);
        iconGroup.rotation.x = 0;
      }

      if (index === 1) {
        iconGroup.scale.setScalar(1);
        iconGroup.rotation.x = Math.sin(elapsed * 1.8) * 0.14;
      }

      if (index === 2) {
        const twinkle = 1 + Math.sin(elapsed * 4.8) * 0.13;
        iconGroup.scale.setScalar(twinkle);
        iconGroup.rotation.x = elapsed * 0.42;
      }
    });

    sparkleRefs.current.forEach((sparkle, index) => {
      if (!sparkle) return;

      const sparkleDelay = 0.64 + index * 0.17;
      const localElapsed = waveElapsed - sparkleDelay;
      const visible = waveIsActive && localElapsed >= 0 && localElapsed <= 1.42;

      sparkle.visible = visible;

      if (!visible) return;

      const progress = Math.min(localElapsed / 1.42, 1);
      const driftDirection = index % 2 === 0 ? 1 : -1;

      sparkle.position.set(
        -7.86 + progress * 0.28,
        12.18 - progress * (0.62 + index * 0.035),
        5.72 - index * 0.57 + Math.sin(elapsed * 2.4 + index) * 0.06
      );

      const sparkleScale =
        Math.sin(progress * Math.PI) *
        (index % 2 === 0 ? 1 : 0.72);

      sparkle.scale.setScalar(Math.max(0.05, sparkleScale));
      sparkle.rotation.x = elapsed * driftDirection * 0.9;
      sparkle.rotation.z = elapsed * driftDirection * 0.7;
    });
  });

  return (
    <group>
      {frameCenters.map((position, index) => (
        <group
          key={`dream-gallery-frame-${index}`}
          ref={(group) => {
            frameGroupRefs.current[index] = group;
          }}
          position={position}
        >
          {/* Soft colored panel layered over the original pastel artwork. */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.075, 0.64, 0.64]} />
            <meshStandardMaterial
              color={frameColors[index]}
              emissive={frameGlowColors[index]}
              emissiveIntensity={activeFrames[index] ? 2.2 : 0.16}
              transparent
              opacity={activeFrames[index] ? 0.9 : 0.12}
            />
          </mesh>

          {/* Symbol revealed when this frame is active. */}
          <group
            ref={(group) => {
              iconGroupRefs.current[index] = group;
            }}
            visible={activeFrames[index]}
            position={[0.055, 0, 0]}
          >
            {index === 0 && (
              <Text
                rotation={[0, Math.PI / 2, 0]}
                fontSize={0.58}
                color="#fff5fa"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.012}
                outlineColor="#ff8fb9"
                material-transparent
                material-opacity={1}
                material-depthTest={false}
                renderOrder={20}
              >
                ♥
              </Text>
            )}

            {index === 1 && (
              <Text
                rotation={[0, Math.PI / 2, 0]}
                fontSize={0.62}
                color="#fff9cf"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.012}
                outlineColor="#d9b8ff"
                material-transparent
                material-opacity={1}
                material-depthTest={false}
                renderOrder={20}
              >
                ☾
              </Text>
            )}

            {index === 2 && (
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <shapeGeometry args={[starShape, 18]} />
                <meshStandardMaterial
                  color={iconColors[index]}
                  emissive="#fff09d"
                  emissiveIntensity={4.1}
                  side={DoubleSide}
                />
              </mesh>
            )}
          </group>
        </group>
      ))}

      {/* Invisible individual click areas covering the three wall frames. */}
      {frameCenters.map(([, centerY, centerZ], index) => (
        <mesh
          key={`dream-gallery-frame-hotspot-${index}`}
          position={[-7.94, centerY, centerZ]}
          onClick={(event) => {
            event.stopPropagation();
            toggleFrame(index);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <boxGeometry args={[0.58, 1.2, 1.2]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}

      {/* Secret all-frames-active sparkle wave drifting toward the bed. */}
      {[
        "#fff2a8",
        "#ffc8ee",
        "#d9c2ff",
        "#fff2a8",
        "#aee8ff",
        "#ffc8ee",
      ].map((color, index) => (
        <mesh
          key={`dream-gallery-wave-sparkle-${index}`}
          ref={(mesh) => {
            sparkleRefs.current[index] = mesh;
          }}
          visible={false}
          position={[-7.86, 12.18, 5.72 - index * 0.57]}
        >
          <octahedronGeometry args={[index % 2 === 0 ? 0.1 : 0.072, 0]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.94}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}



/*
  Automatic kitchen ambience.

  These effects run by themselves so the kitchen feels alive without adding
  another hotspot over the Credits navigation area:
  - warm stove burners softly pulse in sequence
  - translucent steam puffs drift above the stovetop
  - tiny sparkles glint near the kitchen faucet and counter
  - a small fridge indicator light gently breathes

  All coordinates use the GLB model-local coordinate system.
*/
function KitchenAmbientAnimations({
  isNightMode,
}: {
  isNightMode: boolean;
}) {
  const burnerMaterialRefs = useRef<Array<MeshBasicMaterial | null>>([]);
  const steamPuffRefs = useRef<Array<Mesh | null>>([]);
  const steamMaterialRefs = useRef<Array<MeshBasicMaterial | null>>([]);
  const sparkleRefs = useRef<Array<Mesh | null>>([]);
  const sparkleMaterialRefs = useRef<Array<MeshBasicMaterial | null>>([]);
  const fridgeIndicatorMaterialRef = useRef<MeshBasicMaterial>(null);
  const warmKitchenLightRef = useRef<PointLight>(null);

  const burnerPositions = useMemo<Array<[number, number, number]>>(
    () => [
      [0.08, 3.01, -7.86],
      [0.9, 3.01, -7.86],
      [0.08, 3.01, -7.12],
      [0.9, 3.01, -7.12],
    ],
    []
  );

  const sparkleBasePositions = useMemo<Array<[number, number, number]>>(
    () => [
      [4.22, 3.5, -7.43],
      [4.55, 3.22, -7.2],
      [3.95, 3.27, -7.68],
      [5.72, 3.8, -6.18],
    ],
    []
  );

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    burnerMaterialRefs.current.forEach((material, index) => {
      if (!material) return;

      const pulse = 0.5 + Math.sin(elapsed * 2.15 + index * 1.18) * 0.5;
      const wave = 0.5 + Math.sin(elapsed * 1.1 + index * 0.8) * 0.5;

      material.opacity =
        (isNightMode ? 0.34 : 0.22) + pulse * 0.24 + wave * 0.08;
    });

    if (warmKitchenLightRef.current) {
      warmKitchenLightRef.current.intensity =
        (isNightMode ? 0.52 : 0.26) + Math.sin(elapsed * 1.25) * 0.08;
    }

    steamPuffRefs.current.forEach((puff, index) => {
      const material = steamMaterialRefs.current[index];

      if (!puff || !material) return;

      const cycle = (elapsed * 0.2 + index * 0.28) % 1;
      const sway = Math.sin(elapsed * 1.35 + index * 1.7) * 0.14;

      puff.position.set(
        0.54 + sway,
        3.28 + cycle * 1.4,
        -7.45 + Math.cos(elapsed * 1.1 + index) * 0.06
      );

      const puffScale = 0.24 + cycle * 0.34;
      puff.scale.set(puffScale * 1.1, puffScale, puffScale * 0.92);

      material.opacity = Math.max(0, (1 - cycle) * (isNightMode ? 0.2 : 0.14));
    });

    sparkleRefs.current.forEach((sparkle, index) => {
      const material = sparkleMaterialRefs.current[index];

      if (!sparkle || !material) return;

      const cycle = (elapsed * (0.62 + index * 0.07) + index * 0.31) % 1;
      const visiblePulse = Math.pow(Math.sin(cycle * Math.PI), 4);
      const basePosition = sparkleBasePositions[index];

      sparkle.position.set(
        basePosition[0],
        basePosition[1] + cycle * 0.26,
        basePosition[2]
      );

      sparkle.rotation.y = elapsed * (0.9 + index * 0.18);
      sparkle.rotation.z = elapsed * (0.7 + index * 0.12);

      const sparkleScale = 0.72 + visiblePulse * 0.58;
      sparkle.scale.setScalar(sparkleScale);

      material.opacity = visiblePulse * (isNightMode ? 0.9 : 0.64);
    });

    if (fridgeIndicatorMaterialRef.current) {
      fridgeIndicatorMaterialRef.current.opacity =
        0.42 + (0.5 + Math.sin(elapsed * 2.2) * 0.5) * 0.5;
    }
  });

  return (
    <group>
      {/* Four softly glowing stovetop rings. */}
      {burnerPositions.map((position, index) => (
        <mesh
          key={`automatic-kitchen-burner-${index}`}
          position={position}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={8}
        >
          <ringGeometry args={[0.18, 0.25, 28]} />
          <meshBasicMaterial
            ref={(material) => {
              burnerMaterialRefs.current[index] = material;
            }}
            color="#ff765f"
            transparent
            opacity={0.38}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
      ))}

      {/* Warm stove ambience that gently pulses. */}
      <pointLight
        ref={warmKitchenLightRef}
        position={[0.5, 3.5, -7.48]}
        intensity={isNightMode ? 0.52 : 0.26}
        distance={3.6}
        decay={2}
        color="#ff9b73"
      />

      {/* Translucent steam drifting upward from the stovetop. */}
      {[0, 1, 2, 3].map((index) => (
        <mesh
          key={`automatic-kitchen-steam-${index}`}
          ref={(mesh) => {
            steamPuffRefs.current[index] = mesh;
          }}
          position={[0.54, 3.28, -7.45]}
          renderOrder={9}
        >
          <sphereGeometry args={[1, 18, 18]} />
          <meshBasicMaterial
            ref={(material) => {
              steamMaterialRefs.current[index] = material;
            }}
            color="#fff4e8"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Occasional glints near the faucet, counter, and fridge. */}
      {sparkleBasePositions.map((position, index) => (
        <mesh
          key={`automatic-kitchen-sparkle-${index}`}
          ref={(mesh) => {
            sparkleRefs.current[index] = mesh;
          }}
          position={position}
          renderOrder={10}
        >
          <octahedronGeometry args={[index === 0 ? 0.105 : 0.075, 0]} />
          <meshBasicMaterial
            ref={(material) => {
              sparkleMaterialRefs.current[index] = material;
            }}
            color={index === 3 ? "#ffe7b5" : "#d9f8ff"}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Tiny refrigerator status light. */}
      <mesh position={[5.76, 3.76, -6.12]} renderOrder={10}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshBasicMaterial
          ref={fridgeIndicatorMaterialRef}
          color="#b7ffd1"
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}


/*
  Interactive ladder highlight.

  Hovering over the ladder plays a soft bottom-to-top glow across the rungs.
  Clicking the ladder replays a stronger wave, which also works well on
  touch devices where hover is unavailable.

  All coordinates use the GLB model-local coordinate system, so the effect
  stays aligned with the ladder while the room rotates and scales.
*/
function LadderHighlight({
  isHovered,
  replayKey,
  disabled,
  onHoverChange,
  onReplay,
}: {
  isHovered: boolean;
  replayKey: number;
  disabled: boolean;
  onHoverChange: (value: boolean) => void;
  onReplay: () => void;
}) {
  const rungMaterialRefs = useRef<Array<MeshBasicMaterial | null>>([]);
  const glowLightRef = useRef<PointLight>(null);
  const replayStartedAtRef = useRef<number | null>(null);
  const previousReplayKeyRef = useRef(replayKey);

  const ladderRungs = useMemo<Array<[number, number, number]>>(
    () => [
      [3.363, 1.176, -0.713],
      [3.039, 1.999, -0.713],
      [2.706, 2.823, -0.713],
      [2.383, 3.647, -0.713],
      [2.04, 4.47, -0.713],
      [1.711, 5.294, -0.713],
      [1.383, 6.118, -0.713],
      [1.05, 6.941, -0.713],
      [0.717, 7.765, -0.713],
      [0.386, 8.589, -0.713],
    ],
    []
  );

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    if (previousReplayKeyRef.current !== replayKey) {
      previousReplayKeyRef.current = replayKey;
      replayStartedAtRef.current = elapsed;
    }

    const replayElapsed = replayStartedAtRef.current === null
      ? Number.POSITIVE_INFINITY
      : elapsed - replayStartedAtRef.current;

    const replayActive = replayElapsed < 3.6;
    const animationActive = isHovered || replayActive;

    if (glowLightRef.current) {
      glowLightRef.current.intensity = animationActive
        ? isHovered
          ? 0.72
          : 0.48
        : 0;
    }

    rungMaterialRefs.current.forEach((material, index) => {
      if (!material) return;

      if (!animationActive) {
        material.opacity = 0;
        return;
      }

      const waveTime = isHovered
        ? (elapsed * 3.2) % (ladderRungs.length + 2.5)
        : replayElapsed * 4.0;

      const distanceFromWave = Math.abs(waveTime - index);
      const glow = Math.max(0, 1 - distanceFromWave / 2.15);
      const afterGlow = Math.max(0, 1 - distanceFromWave / 4.4) * 0.22;
      const pulse = 0.82 + Math.sin(elapsed * 4.2 + index * 0.55) * 0.18;

      material.opacity = Math.min(0.92, (glow + afterGlow) * pulse);
    });
  });

  return (
    <group>
      {ladderRungs.map((position, index) => (
        <mesh
          key={`ladder-glow-rung-${index}`}
          position={position}
          renderOrder={12}
        >
          <boxGeometry args={[0.56, 0.23, 2.08]} />
          <meshBasicMaterial
            ref={(material) => {
              rungMaterialRefs.current[index] = material;
            }}
            color="#ffe6a8"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}

      <pointLight
        ref={glowLightRef}
        position={[1.82, 4.95, -0.71]}
        intensity={0}
        distance={5.2}
        decay={2}
        color="#ffd98a"
      />

      {/* Larger invisible hotspot around the complete ladder. */}
      <mesh
        position={[1.83, 5.02, -0.71]}
        onClick={(event) => {
          event.stopPropagation();

          if (!disabled) {
            onReplay();
          }
        }}
        onPointerOver={(event) => {
          event.stopPropagation();

          if (!disabled) {
            document.body.style.cursor = "pointer";
            onHoverChange(true);
          }
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "default";
          onHoverChange(false);
        }}
      >
        <boxGeometry args={[4.45, 9.65, 2.48]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/*
  Interactive YouTube TV screen.

  The iframe is attached to the same model-local position as the TV display.
  Clicking the TV hotspot turns it on. The small close button turns it off.
  The video starts muted so browser autoplay policies are less likely to block it.
*/
function TvScreenEffect({
  isOn,
  onTurnOff,
}: {
  isOn: boolean;
  onTurnOff: () => void;
}) {
  const screenGroupRef = useRef<Group>(null);
  const { camera } = useThree();
  const [isFacingCamera, setIsFacingCamera] = useState(true);

  const previousFacingState = useRef(true);
  const screenWorldPosition = useRef(new Vector3());
  const screenNormal = useRef(new Vector3());
  const directionToCamera = useRef(new Vector3());

  useFrame(() => {
    if (!screenGroupRef.current) return;

    screenGroupRef.current.getWorldPosition(screenWorldPosition.current);
    /*
      PlaneGeometry and Drei Html face local +Z by default.
      After the TV group's -90 degree Y rotation, local +Z points toward
      the real front glass of the GLB television (negative local X).
      Using +Z here prevents the iframe from rendering on the mirrored back.
    */
    screenNormal.current
      .set(0, 0, 1)
      .applyQuaternion(
        screenGroupRef.current.getWorldQuaternion(
          screenGroupRef.current.quaternion.clone()
        )
      )
      .normalize();

    directionToCamera.current
      .copy(camera.position)
      .sub(screenWorldPosition.current)
      .normalize();

    const nextFacingState =
      screenNormal.current.dot(directionToCamera.current) > 0.02;

    if (nextFacingState !== previousFacingState.current) {
      previousFacingState.current = nextFacingState;
      setIsFacingCamera(nextFacingState);
    }
  });

  if (!isOn) {
    return null;
  }

  return (
    <group
      ref={screenGroupRef}
      position={[6.865, 2.842, 3.846]}
      rotation={[0, -Math.PI / 2, 0]}
    >
      {/**
       * Keep the iframe mounted while the TV is on.
       *
       * Unmounting the iframe when the camera rotates behind the TV would
       * stop and restart the YouTube player. Instead, hide it visually from
       * the backside while preserving playback in the existing iframe.
       */}
      <Html
        transform
        center
        occlude="blending"
        distanceFactor={3.78}
        zIndexRange={[10, 0]}
        style={{
          pointerEvents: isFacingCamera ? "auto" : "none",
          opacity: isFacingCamera ? 1 : 0,
          visibility: isFacingCamera ? "visible" : "hidden",
        }}
      >
        <div
          aria-hidden={!isFacingCamera}
          style={{
            position: "relative",
            width: "300px",
            height: "154px",
            overflow: "hidden",
            borderRadius: "3px",
            background: "#000",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/nZXd0TMEJfo?autoplay=1&mute=1&controls=1&playsinline=1&rel=0&modestbranding=1"
            title="Portfolio TV video"
            width="300"
            height="154"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{
              display: "block",
              width: "300px",
              height: "154px",
              border: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />

          <button
            type="button"
            aria-label="Turn off TV"
            onClick={(event) => {
              event.stopPropagation();
              onTurnOff();
            }}
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "20px",
              height: "20px",
              border: "1px solid rgba(255, 255, 255, 0.7)",
              borderRadius: "999px",
              background: "rgba(0, 0, 0, 0.58)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "14px",
              lineHeight: "16px",
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      </Html>
    </group>
  );
}

function SceneContent({
  shouldZoomOutFromLaptop,
  shouldZoomOutFromWindow,
  shouldZoomOutFromCredits,
  onSceneReady,
  viewportWidth,
  theme,
}: {
  shouldZoomOutFromLaptop: boolean;
  shouldZoomOutFromWindow: boolean;
  shouldZoomOutFromCredits: boolean;
  onSceneReady?: () => void;
  viewportWidth: number;
  theme: "day" | "night";
}) {
  const router = useRouter();
  const controlsRef = useRef<any>(null);
  const hasPlayedReturnAnimation = useRef(false);
  const hasCalledSceneReady = useRef(false);
  const [isMoving, setIsMoving] = useState(false);
  const [lampOn, setLampOn] = useState(false);
  const [cactusLampOn, setCactusLampOn] = useState(false);
  const [tvOn, setTvOn] = useState(false);
  const [bathtubMode, setBathtubMode] = useState<
    "empty" | "filling" | "full" | "draining"
  >("empty");
  const [sinkMode, setSinkMode] = useState<
    "empty" | "filling" | "full" | "draining"
  >("empty");
  const [mirrorLightOn, setMirrorLightOn] = useState(false);
  const [bedAnimationKey, setBedAnimationKey] = useState(0);
  const [ladderHovered, setLadderHovered] = useState(false);
  const [ladderReplayKey, setLadderReplayKey] = useState(0);
  const lampLightRef = useRef<any>(null);
  const isNightMode = theme === "night";

  const { camera } = useThree();

  const isCompactViewport = viewportWidth < 768;
  const isTabletViewport = viewportWidth >= 768 && viewportWidth < 1280;
  const homeCamera: [number, number, number] = isCompactViewport
    ? [20, 18, 24]
    : isTabletViewport
      ? [18.8, 16.8, 22]
      : HOME_CAMERA;
  const homeTarget: [number, number, number] = isCompactViewport
    ? [0.4, 5.8, 0]
    : isTabletViewport
      ? [0.15, 5.6, 0]
      : HOME_TARGET;
  const homeFov = isCompactViewport ? 42 : isTabletViewport ? 38 : 35;

  const initialOrbitTarget = useRef<[number, number, number]>(
    shouldZoomOutFromLaptop
      ? getRoomPositionForViewport(LAPTOP_TARGET, viewportWidth)
      : shouldZoomOutFromWindow
        ? getRoomPositionForViewport(WINDOW_TARGET, viewportWidth)
        : shouldZoomOutFromCredits
          ? CREDITS_TARGET
          : HOME_TARGET
  );

  // viewportWidth is passed from the parent HeroScene to avoid duplicate listeners

  useEffect(() => {
    // camera may be typed as a generic Camera; cast to PerspectiveCamera to update fov safely
    (camera as PerspectiveCamera).fov = homeFov;
    (camera as PerspectiveCamera).updateProjectionMatrix();
  }, [camera, homeFov]);

  const moveCamera = (
    position: [number, number, number],
    target: [number, number, number],
    _section: SectionName,
    onCompleteCallback?: () => void,
    duration = 1.45
  ) => {
    setIsMoving(true);

    const timeline = gsap.timeline({
      onUpdate: () => {
        controlsRef.current?.update();
      },
      onComplete: () => {
        setIsMoving(false);

        if (onCompleteCallback) {
          onCompleteCallback();
        }
      },
    });

    timeline.to(
      camera.position,
      {
        x: position[0],
        y: position[1],
        z: position[2],
        duration,
        ease: "power3.inOut",
      },
      0
    );

    if (controlsRef.current) {
      timeline.to(
        controlsRef.current.target,
        {
          x: target[0],
          y: target[1],
          z: target[2],
          duration,
          ease: "power3.inOut",
        },
        0
      );
    }
  };

  const playIntroAnimation = () => {
    if (!controlsRef.current) return;

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controlsRef.current.target);

    camera.position.set(...INTRO_CAMERA);
    controlsRef.current.target.set(...INTRO_TARGET);
    controlsRef.current.update();

    moveCamera(homeCamera, homeTarget, "home", undefined, 2.15);
  };

  const goAbout = () => {
    const cameraTarget = getRoomPositionForViewport(
      LAPTOP_CAMERA,
      viewportWidth
    );
    const focusTarget = getRoomPositionForViewport(LAPTOP_TARGET, viewportWidth);

    moveCamera(cameraTarget, focusTarget, "home", () => {
      router.push("/about");
    });
  };

  const goProjects = () => {
    const cameraTarget = getRoomPositionForViewport(
      WINDOW_CAMERA,
      viewportWidth
    );
    const focusTarget = getRoomPositionForViewport(WINDOW_TARGET, viewportWidth);

    moveCamera(cameraTarget, focusTarget, "home", () => {
      router.push("/projects");
    });
  };

  const goCredits = () => {
    moveCamera(CREDITS_CAMERA, CREDITS_TARGET, "home", () => {
      router.push("/credits");
    });
  };

  useEffect(() => {
    if (hasCalledSceneReady.current) return;
    if (!controlsRef.current) return;

    hasCalledSceneReady.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onSceneReady?.();
      });
    });
  }, [onSceneReady]);

  useEffect(() => {
    const shouldReturn =
      shouldZoomOutFromLaptop ||
      shouldZoomOutFromWindow ||
      shouldZoomOutFromCredits;

    if (!shouldReturn || hasPlayedReturnAnimation.current) return;
    if (!controlsRef.current) return;

    hasPlayedReturnAnimation.current = true;

    let startCamera = getRoomPositionForViewport(LAPTOP_CAMERA, viewportWidth);
    let startTarget = getRoomPositionForViewport(LAPTOP_TARGET, viewportWidth);

    if (shouldZoomOutFromWindow) {
      startCamera = getRoomPositionForViewport(WINDOW_CAMERA, viewportWidth);
      startTarget = getRoomPositionForViewport(WINDOW_TARGET, viewportWidth);
    }

    if (shouldZoomOutFromCredits) {
      startCamera = CREDITS_CAMERA;
      startTarget = CREDITS_TARGET;
    }

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controlsRef.current.target);

    camera.position.set(...startCamera);
    controlsRef.current.target.set(...startTarget);
    controlsRef.current.update();

    setIsMoving(true);

    const timer = window.setTimeout(() => {
      moveCamera(homeCamera, homeTarget, "home", () => {
        router.replace("/", { scroll: false });
      });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [
    camera,
    router,
    shouldZoomOutFromLaptop,
    shouldZoomOutFromWindow,
    shouldZoomOutFromCredits,
  ]);

  useEffect(() => {
    const handleIntro = () => {
      playIntroAnimation();
    };

    window.addEventListener("room:intro", handleIntro);

    return () => {
      window.removeEventListener("room:intro", handleIntro);
    };
  }, []);

  useEffect(() => {
    const handleRoomNavigation = (event: Event) => {
      const customEvent = event as CustomEvent<{ target?: string }>;
      const target = customEvent.detail?.target;

      if (isMoving) return;

      if (target === "about") {
        goAbout();
      }

      if (target === "projects") {
        goProjects();
      }

      if (target === "credits") {
        goCredits();
      }
    };

    window.addEventListener("room:navigate", handleRoomNavigation);

    return () => {
      window.removeEventListener("room:navigate", handleRoomNavigation);
    };
  }, [isMoving]);

  useEffect(() => {
    if (!lampLightRef.current) return;

    gsap.to(lampLightRef.current, {
      intensity: lampOn ? 1.2 : 0,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [lampOn]);

  return (
    <>
      <ambientLight intensity={isNightMode ? 0.42 : 1.0} />
      <hemisphereLight
        args={isNightMode ? ["#b9c8ff", "#17111f", 0.42] : ["#ffffff", "#f0ebe8", 0.85]}
      />

      <directionalLight
        position={[5, 8, 5]}
        intensity={isNightMode ? 0.5 : 1.05}
        color={isNightMode ? "#c7d3ff" : "#ffffff"}
        castShadow
      />

      <pointLight
        position={[-4, 3, 4]}
        intensity={isNightMode ? 0.08 : 0.22}
        distance={11}
        color={isNightMode ? "#8d74cc" : "#ffbfdc"}
      />

      <pointLight
        position={[4, 3, 3]}
        intensity={isNightMode ? 0.1 : 0.18}
        distance={11}
        color={isNightMode ? "#6ea5ff" : "#b9dcff"}
      />

      {isNightMode ? null : <SoftWebsiteGlow />}
      {isNightMode ? null : <SoftGroundGlow />}

      <group
        position={[0, isCompactViewport ? -0.84 : isTabletViewport ? -0.58 : -0.45, 0]}
        rotation={[0, -0.72, 0]}
        scale={isCompactViewport ? 0.78 : isTabletViewport ? 0.9 : 1}
      >
        <IsometricRoom
          theme={theme}
          lampOn={lampOn}
          cactusLampOn={cactusLampOn}
        />

        {/*
          AUTOMATIC KITCHEN AMBIENCE

          These run continuously without requiring a click, so the Credits
          hotspot remains available for navigation.
        */}
        <KitchenAmbientAnimations isNightMode={isNightMode} />

        {/*
          KEYBOARD-CONTROLLED BANANA CAT

          Desktop controls: WASD or arrow keys. The cat stays inside the
          lower-floor room boundaries and plays its Sketchfab animation.
        */}
        <CuteCatBananaController />

        {/*
          AUTOMATIC FLYING OKAME BIRD

          The bird follows a smooth closed route above the lower floor and
          plays its embedded Sketchfab animation continuously.
        */}
        <OkameBirdFlyer />

        {/*
          CACTUS FLOOR LAMP

          The cactus-shaped floor lamp is stored in the GLB as the
          neon_flower_* meshes. These coordinates are model-local, so the
          glow stays attached to the lamp when the room is rotated or scaled.
        */}
        {isNightMode && (
          <>
            <pointLight
              position={[6.85, 2.1, 0.42]}
              intensity={cactusLampOn ? 2.6 : 0}
              distance={1.9}
              decay={2}
              color="#69ff75"
            />

            <pointLight
              position={[6.85, 1.38, 0.42]}
              intensity={cactusLampOn ? 0.85 : 0}
              distance={1.15}
              decay={2}
              color="#a4ffab"
            />

            {/* Larger invisible click area around the cactus lamp */}
            <mesh
              position={[6.85, 1.58, 0.42]}
              onClick={(event) => {
                event.stopPropagation();

                if (!isMoving) {
                  setCactusLampOn((value) => !value);
                }
              }}
              onPointerOver={() => {
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "default";
              }}
            >
              <boxGeometry args={[1.35, 2.9, 1.35]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </>
        )}

        {/*
          TV INTERACTION

          The TV screen and its hotspot use model-local coordinates, so the
          effect remains attached to the television on desktop and mobile.
          This interaction is intentionally available in both day and night
          mode.
        */}
        <TvScreenEffect
          isOn={tvOn}
          onTurnOff={() => {
            setTvOn(false);
          }}
        />

        <mesh
          position={[6.865, 2.842, 3.846]}
          rotation={[0, -Math.PI / 2, 0]}
          onClick={(event) => {
            event.stopPropagation();

            if (!isMoving) {
              setTvOn((value) => {
                const nextValue = !value;

                if (nextValue) {
                  window.dispatchEvent(
                    new CustomEvent("ambient:set-muted", {
                      detail: { muted: true },
                    })
                  );
                }

                return nextValue;
              });
            }
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <planeGeometry args={[3.35, 1.72]} />
          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
            side={FrontSide}
          />
        </mesh>

        {/*
          BATHTUB INTERACTION

          The water effect and hotspot use model-local coordinates, so they
          remain attached to the bathroom after responsive scaling and room
          rotation.
        */}
        <BathtubWaterEffect
          mode={bathtubMode}
          onFilled={() => {
            setBathtubMode("full");
          }}
          onDrained={() => {
            setBathtubMode("empty");
          }}
        />

        <mesh
          position={[-4.79, 1.36, 4.84]}
          onClick={(event) => {
            event.stopPropagation();

            if (!isMoving) {
              setBathtubMode((currentMode) => {
                if (currentMode === "empty") return "filling";
                if (currentMode === "filling") return "draining";
                if (currentMode === "full") return "draining";
                return "filling";
              });
            }
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <boxGeometry args={[6.7, 2.15, 3.15]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>


        {/*
          BATHROOM SINK INTERACTION

          Click the sink to start the faucet and fill the basin. The faucet
          automatically stops when the sink is full. Click again to drain it.
        */}
        <SinkWaterEffect
          mode={sinkMode}
          onFilled={() => {
            setSinkMode("full");
          }}
          onDrained={() => {
            setSinkMode("empty");
          }}
        />

        <mesh
          position={[-7.43, 3.18, 1.58]}
          onClick={(event) => {
            event.stopPropagation();

            if (!isMoving) {
              setSinkMode((currentMode) => {
                if (currentMode === "empty") return "filling";
                if (currentMode === "filling") return "draining";
                if (currentMode === "full") return "draining";
                return "filling";
              });
            }
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <boxGeometry args={[1.95, 1.45, 2.1]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/*
          BATHROOM MIRROR INTERACTION

          Click the mirror above the sink to toggle its illuminated border.
          The hotspot and border are model-local, so they stay attached to
          the mirror while the room rotates and scales responsively.
        */}
        <MirrorBorderLight
          isOn={mirrorLightOn}
          isNightMode={isNightMode}
          disabled={isMoving}
          onToggle={() => {
            setMirrorLightOn((value) => !value);
          }}
        />

        {/*
          COZY BED INTERACTION

          Click the upstairs bed to replay the dream cloud, floating Zzzz...
          text, sparkles, and soft cat-headboard glow.
        */}
        <BedtimeEffect replayKey={bedAnimationKey} />

        {/*
          DREAM GALLERY FRAMES

          Click the three pastel frames above the bed to reveal a heart,
          crescent moon, and star. Activating all three triggers a short
          left-to-right sparkle wave toward the bed.
        */}
        <DreamGalleryFrames disabled={isMoving} />

        {/*
          LADDER INTERACTION

          Hover over the ladder to play a bottom-to-top rung glow. Clicking
          the ladder replays a stronger wave, which also works on mobile.
        */}
        <LadderHighlight
          isHovered={ladderHovered}
          replayKey={ladderReplayKey}
          disabled={isMoving}
          onHoverChange={setLadderHovered}
          onReplay={() => {
            setLadderReplayKey((value) => value + 1);
          }}
        />

        <mesh
          position={[-4.54, 10.46, 4.59]}
          onClick={(event) => {
            event.stopPropagation();

            if (!isMoving) {
              setBedAnimationKey((value) => value + 1);
            }
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <boxGeometry args={[6.65, 2.35, 4.35]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {/* Lamp point light controlled by the lamp hotspot (night mode only) */}
      {theme === "night" && (
        <pointLight
          ref={lampLightRef}
          position={[-6.25, 12.85, -4.15]}
          intensity={lampOn ? 1.2 : 0}
          distance={6}
          decay={2}
          color={lampOn ? "#ffd9b3" : "#000000"}
        />
      )}

      {/* ABOUT: laptop screen hotspot */}
      <group
        position={
          getRoomPositionForViewport(LAPTOP_TARGET, viewportWidth)
        }
        rotation={[-0.85, -0.55, -0.2]}
      >
        <mesh
          onClick={(event) => {
            event.stopPropagation();

            if (!isMoving) {
              goAbout();
            }
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <planeGeometry args={isCompactViewport ? [2.8, 1.8] : [2.1, 1.35]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {/* LAMP: separate clickable hotspot near the desk lamp */}
      <mesh
        position={getRoomPositionForViewport([-6.25, 12.85, -4.15], viewportWidth)}
        onClick={(event) => {
          event.stopPropagation();

          if (!isMoving && isNightMode) {
            setLampOn((v) => !v);
          }
        }}
        onPointerOver={() => {
          if (isNightMode) document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* PROJECTS: big blue window hotspot */}
      <group
        position={
          getRoomPositionForViewport([7.1, 12.0, -4.5], viewportWidth)
        }
        rotation={[0, -0.72, 0]}
      >
        <mesh
          onClick={(event) => {
            event.stopPropagation();

            if (!isMoving) {
              goProjects();
            }
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <planeGeometry args={isCompactViewport ? [9.4, 5.7] : [8.4, 5.1]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {/* CREDITS: kitchen hotspot */}
      <group position={[5.1, 4.1, -1.0]} rotation={[0, -0.72, 0]}>
        <mesh
          onClick={(event) => {
            event.stopPropagation();

            if (!isMoving) {
              goCredits();
            }
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <boxGeometry args={[5.4, 4.6, 5.4]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      <ContactShadows
        position={[0, isCompactViewport ? -1.2 : -1.15, 0]}
        opacity={isNightMode ? 0.04 : 0.1}
        scale={isCompactViewport ? 8.8 : 10}
        blur={isCompactViewport ? 2.3 : 2.8}
        far={4}
        color="#9e938f"
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={initialOrbitTarget.current}
        enablePan={false}
        enableZoom
        zoomSpeed={isCompactViewport ? 0.9 : 0.15}
        touches={{
          ONE: TOUCH.ROTATE,
          TWO: TOUCH.DOLLY_ROTATE,
        }}
        rotateSpeed={isCompactViewport ? 0.24 : 0.35}
        minDistance={isCompactViewport ? 4.2 : 2.8}
        maxDistance={isCompactViewport ? 42 : 30}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.4}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

const HeroScene = ({
  onSceneReady,
  theme = "day",
}: {
  onSceneReady?: () => void;
  theme?: "day" | "night";
}) => {
  const searchParams = useSearchParams();
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window === "undefined") return 1440;
    return window.innerWidth;
  });

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isCompactViewport = viewportWidth < 768;
  const isTabletViewport = viewportWidth >= 768 && viewportWidth < 1280;
  const homeCameraVar: [number, number, number] = isCompactViewport
    ? [20, 18, 24]
    : isTabletViewport
      ? [18.8, 16.8, 22]
      : HOME_CAMERA;
  const homeFovVar = isCompactViewport ? 42 : isTabletViewport ? 38 : 35;
  const returnFrom = searchParams.get("from");

  const shouldZoomOutFromLaptop = returnFrom === "about";
  const shouldZoomOutFromWindow = returnFrom === "projects";
  const shouldZoomOutFromCredits = returnFrom === "credits";

  return (
    <section
      className="pointer-events-auto relative h-[100dvh] w-full overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {theme === "night" && <ScreenNightSkyStars />}

      <Canvas
        shadows
        dpr={viewportWidth < 768 ? [1, 1.25] : [1, 1.7]}
        camera={{
          position: shouldZoomOutFromLaptop
            ? getRoomPositionForViewport(LAPTOP_CAMERA, viewportWidth)
            : shouldZoomOutFromWindow
              ? getRoomPositionForViewport(WINDOW_CAMERA, viewportWidth)
              : shouldZoomOutFromCredits
                ? CREDITS_CAMERA
                : homeCameraVar,
          fov: homeFovVar,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = NoToneMapping;
        }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          background: "transparent",
          touchAction: "none",
        }}
      >
        <Suspense fallback={null}>
          <SceneContent
            shouldZoomOutFromLaptop={shouldZoomOutFromLaptop}
            shouldZoomOutFromWindow={shouldZoomOutFromWindow}
            shouldZoomOutFromCredits={shouldZoomOutFromCredits}
            onSceneReady={onSceneReady}
            viewportWidth={viewportWidth}
            theme={theme}
          />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default HeroScene;