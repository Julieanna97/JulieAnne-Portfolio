"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { NoToneMapping, SRGBColorSpace } from "three";
import gsap from "gsap";
import Loader from "../components/Loader";
import IsometricRoom from "../models/IsometricRoom";

type SectionName = "home";

const HOME_CAMERA: [number, number, number] = [18, 16, 20];
const HOME_TARGET: [number, number, number] = [0, 5.5, 0];

const INTRO_CAMERA: [number, number, number] = [-28, 24, 30];
const INTRO_TARGET: [number, number, number] = [0, 7.5, 0];

const INTRO_MID_CAMERA: [number, number, number] = [10, 26, 26];
const INTRO_MID_TARGET: [number, number, number] = [0, 8.5, 0];

const LAPTOP_CAMERA: [number, number, number] = [-4.05, 11.56, -3.37];
const LAPTOP_TARGET: [number, number, number] = [-5.56, 11.26, -4.95];

const WINDOW_CAMERA: [number, number, number] = [-2.5, 11.3, 8.5];
const WINDOW_TARGET: [number, number, number] = [7.1, 10, -4.67];

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

function SceneContent({
  shouldZoomOutFromLaptop,
  shouldZoomOutFromWindow,
}: {
  shouldZoomOutFromLaptop: boolean;
  shouldZoomOutFromWindow: boolean;
}) {
  const router = useRouter();
  const controlsRef = useRef<any>(null);
  const hasPlayedReturnAnimation = useRef(false);

  const [activeSection, setActiveSection] = useState<SectionName>("home");
  const [isMoving, setIsMoving] = useState(false);

  const { camera } = useThree();

  const moveCamera = (
    position: [number, number, number],
    target: [number, number, number],
    section: SectionName,
    onCompleteCallback?: () => void,
    duration = 1.45
  ) => {
    setIsMoving(true);
    setActiveSection(section);

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

    moveCamera(HOME_CAMERA, HOME_TARGET, "home", undefined, 2.15);
  };

  const goAbout = () => {
    moveCamera(LAPTOP_CAMERA, LAPTOP_TARGET, "home", () => {
      router.push("/about");
    });
  };

  const goProjects = () => {
    moveCamera(WINDOW_CAMERA, WINDOW_TARGET, "home", () => {
      router.push("/projects");
    });
  };

  useEffect(() => {
    const shouldReturn = shouldZoomOutFromLaptop || shouldZoomOutFromWindow;

    if (!shouldReturn || hasPlayedReturnAnimation.current) return;
    if (!controlsRef.current) return;

    hasPlayedReturnAnimation.current = true;

    const startCamera = shouldZoomOutFromLaptop ? LAPTOP_CAMERA : WINDOW_CAMERA;
    const startTarget = shouldZoomOutFromLaptop ? LAPTOP_TARGET : WINDOW_TARGET;

    camera.position.set(...startCamera);
    controlsRef.current.target.set(...startTarget);
    controlsRef.current.update();

    setIsMoving(true);

    const timer = window.setTimeout(() => {
      moveCamera(HOME_CAMERA, HOME_TARGET, "home", () => {
        router.replace("/", { scroll: false });
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [camera, router, shouldZoomOutFromLaptop, shouldZoomOutFromWindow]);

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
    };

    window.addEventListener("room:navigate", handleRoomNavigation);

    return () => {
      window.removeEventListener("room:navigate", handleRoomNavigation);
    };
  }, [isMoving]);

  return (
    <>
      <ambientLight intensity={1.0} />
      <hemisphereLight args={["#ffffff", "#f0ebe8", 0.85]} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={1.05}
        color="#ffffff"
        castShadow
      />

      <pointLight
        position={[-4, 3, 4]}
        intensity={0.22}
        distance={11}
        color="#ffc0d2"
      />

      <pointLight
        position={[4, 3, 3]}
        intensity={0.18}
        distance={11}
        color="#b9dcff"
      />

      <SoftWebsiteGlow />
      <SoftGroundGlow />

      <group position={[0, -0.45, 0]} rotation={[0, -0.72, 0]} scale={1}>
        <IsometricRoom />
      </group>

      <group position={[-5.56, 11.26, -4.95]} rotation={[-0.85, -0.55, -0.2]}>
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
          <planeGeometry args={[2.1, 1.35]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      <group position={[7.1, 12.0, -4.5]} rotation={[0, -0.72, 0]}>
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
          <planeGeometry args={[8.4, 5.1]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.12}
        scale={10}
        blur={2.8}
        far={4}
        color="#9e938f"
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={
          shouldZoomOutFromLaptop
            ? LAPTOP_TARGET
            : shouldZoomOutFromWindow
              ? WINDOW_TARGET
              : HOME_TARGET
        }
        enablePan={false}
        enableZoom
        zoomSpeed={0.15}
        rotateSpeed={0.35}
        minDistance={2.8}
        maxDistance={30}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.4}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

const HeroScene = () => {
  const searchParams = useSearchParams();
  const returnFrom = searchParams.get("from");

  const shouldZoomOutFromLaptop = returnFrom === "about";
  const shouldZoomOutFromWindow = returnFrom === "projects";

  return (
    <section className="pointer-events-auto relative h-screen w-full overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 1.7]}
        camera={{
          position: shouldZoomOutFromLaptop
            ? LAPTOP_CAMERA
            : shouldZoomOutFromWindow
              ? WINDOW_CAMERA
              : HOME_CAMERA,
          fov: 35,
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
        <Suspense fallback={<Loader />}>
          <SceneContent
            shouldZoomOutFromLaptop={shouldZoomOutFromLaptop}
            shouldZoomOutFromWindow={shouldZoomOutFromWindow}
          />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default HeroScene;