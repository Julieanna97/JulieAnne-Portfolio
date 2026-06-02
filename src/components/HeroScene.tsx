"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import {
  DoubleSide,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NoToneMapping,
  SRGBColorSpace,
  Shape,
} from "three";
import gsap from "gsap";
import IsometricRoom from "../models/IsometricRoom";

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

  const showerX = -7.69;
  const showerZ = 4.97;
  const showerStartY = 6.48;

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

    const streamHeight = showerStartY - streamBottomY;

    if (streamRef.current) {
      streamRef.current.visible = showerRunning;

      streamRef.current.position.set(
        showerX,
        streamBottomY + streamHeight / 2,
        showerZ
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
      ring.position.y = currentWaterY + 0.018;

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
          showerX,
          3.8,
          showerZ,
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
          showerX,
          minimumWaterY + 0.018,
          showerZ,
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
          showerX,
          minimumWaterY + 0.02,
          showerZ,
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
  const [bathtubMode, setBathtubMode] = useState<
    "empty" | "filling" | "full" | "draining"
  >("empty");
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
        enableZoom={!isCompactViewport}
        zoomSpeed={isCompactViewport ? 0.09 : 0.15}
        rotateSpeed={isCompactViewport ? 0.24 : 0.35}
        minDistance={isCompactViewport ? 4.2 : 2.8}
        maxDistance={isCompactViewport ? 24 : 30}
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
    <section className="pointer-events-auto relative h-[100dvh] w-full overflow-hidden">
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
          width: "100%",
          height: "100%",
          background: "transparent",
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