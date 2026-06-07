"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Bloom, EffectComposer, SSAO, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { Object3D, PerspectiveCamera, SpotLight } from "three";
import { ACESFilmicToneMapping, SRGBColorSpace, TOUCH } from "three";
import gsap from "gsap";
import MysteriousAdventureModel from "../models/MysteriousAdventureModel";

type SectionId = "about" | "projects" | "credits";
type ProjectId = "sigma-autonomous-car" | "podmanager" | "practicepal";

type ProjectCaseStudy = {
  id: ProjectId;
  title: string;
  type: string;
  role: string;
  period: string;
  summary: string;
  technologies: string[];
  contributions: string[];
  images: string[];
  video?: string;
};

type PortfolioSection = {
  id: SectionId;
  number: string;
  markerNumber?: string;
  title: string;
  eyebrow: string;
  hotspot: [number, number, number];
  camera: [number, number, number];
  focus: [number, number, number];
};

const HOME_CAMERA_DESKTOP: [number, number, number] = [19.4, 10.45, 24.6];
const HOME_CAMERA_MOBILE: [number, number, number] = [24.8, 13.8, 31.4];
const HOME_TARGET: [number, number, number] = [0, 4.18, 0];
const INTRO_CAMERA: [number, number, number] = [-25, 17.5, 29];
const INTRO_TARGET: [number, number, number] = [0, 5.2, 0];

const STREET_LAMP_BULB_POSITION: [number, number, number] = [6.58, 4.586, 7.331];
const STREET_LAMP_SPILL_TARGET_POSITION: [number, number, number] = [4.55, 0.08, 6.94];

function TokyoStreetLampGlow() {
  const spillLightRef = useRef<SpotLight>(null);
  const spillTargetRef = useRef<Object3D>(null);

  useEffect(() => {
    if (!spillLightRef.current || !spillTargetRef.current) return;
    spillLightRef.current.target = spillTargetRef.current;
    spillLightRef.current.target.updateMatrixWorld();
  }, []);

  return (
    <>
      <object3D ref={spillTargetRef} position={STREET_LAMP_SPILL_TARGET_POSITION} />

      <group position={STREET_LAMP_BULB_POSITION}>
        <mesh position={[0, 0.18, -0.03]}>
          <cylinderGeometry args={[0.014, 0.014, 0.24, 10]} />
          <meshStandardMaterial color="#252a31" metalness={0.82} roughness={0.32} />
        </mesh>

        <mesh position={[0, 0.035, 0]}>
          <boxGeometry args={[0.17, 0.22, 0.17]} />
          <meshStandardMaterial
            color="#231912"
            metalness={0.28}
            roughness={0.72}
            emissive="#2a170a"
            emissiveIntensity={0.18}
          />
        </mesh>

        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.105, 0.145, 0.105]} />
          <meshStandardMaterial
            color="#ffd9a2"
            emissive="#ffbd6d"
            emissiveIntensity={1.55}
            transparent
            opacity={0.92}
            toneMapped={false}
          />
        </mesh>

        {/* Bulb — softened further */}
        <pointLight
          position={[0, 0.02, 0]}
          intensity={4}
          distance={7}
          decay={2.0}
          color="#ffcc88"
        />
      </group>

      {/* Wide spill — softened further */}
      <spotLight
        ref={spillLightRef}
        position={STREET_LAMP_BULB_POSITION}
        angle={1.45}
        penumbra={1}
        intensity={6}
        distance={15}
        decay={1.8}
        color="#ffb86a"
      />

      {/* Ground fills — softened further */}
      <pointLight position={[3.8, 0.18, 7.1]}  intensity={2.5} distance={10} decay={1.9} color="#ffb05a" />
      <pointLight position={[5.72, 0.18, 7.08]} intensity={2}   distance={8}  decay={1.9} color="#ffc878" />
      <pointLight position={[7.4, 0.18, 7.2]}   intensity={1.5} distance={7}  decay={2.0} color="#ffd090" />
      <pointLight position={[5.5, 0.08, 8.5]}   intensity={2.5} distance={10} decay={1.8} color="#ffa840" />
      <pointLight position={[5.2, 1.2, 7.0]}    intensity={1.5} distance={6}  decay={2.0} color="#ffbe6e" />
    </>
  );
}

/*
  BackAlleyPinkGlow — mimics a pink/magenta neon sign or lantern string
  tucked in the back alley behind the buildings. All lights sit at negative
  Z values (behind the front facade) with short distance so they can't
  bleed through to the street. The color matches the warm-pink lantern
  reflections visible in the reference screenshot.
*/
function BackAlleyPinkGlow() {
  return (
    <>
      {/*
        Primary neon source — imagined sign mounted mid-height on the alley's
        back wall. Pink-magenta, tight distance so it only paints the
        immediate wall surfaces around the lanterns.
      */}
      <pointLight
        position={[1.8, 5.2, -1.8]}
        intensity={22}
        distance={12}
        decay={1.5}
        color="#ff6eb4"
      />

      <pointLight
        position={[2.4, 3.2, -2.6]}
        intensity={18}
        distance={11}
        decay={1.55}
        color="#ff82b8"
      />

      <pointLight
        position={[2.0, 0.6, -2.2]}
        intensity={14}
        distance={10}
        decay={1.6}
        color="#ff90c0"
      />

      <pointLight
        position={[1.6, 7.8, -1.4]}
        intensity={12}
        distance={10}
        decay={1.65}
        color="#ff78be"
      />

      <pointLight
        position={[3.0, 4.0, -4.5]}
        intensity={10}
        distance={9}
        decay={1.7}
        color="#e86aaa"
      />
    </>
  );
}

const PROJECT_CASE_STUDIES: Record<ProjectId, ProjectCaseStudy> = {
  "sigma-autonomous-car": {
    id: "sigma-autonomous-car",
    title: "Sigma Autonomous Car",
    type: "Embedded / Software Project",
    role: "Team Lead & Developer",
    period: "September 2023 – October 2023",
    summary:
      "A team-built autonomous-car project focused on real-time perception, obstacle detection, and navigation. I helped lead the team while contributing to the software implementation and testing process.",
    technologies: ["Python", "C++", "ROS", "OpenCV", "YOLOv8", "LiDAR", "Computer Vision"],
    contributions: [
      "Worked on real-time object and obstacle detection for autonomous navigation.",
      "Used camera and LiDAR input to support environmental awareness.",
      "Helped test and iterate on the car's movement and perception behavior.",
      "Coordinated tasks as team lead and supported integration between different parts of the project.",
    ],
    images: [
      "/projects/sigma-autonomous-car/cover.jpg",
      "/projects/sigma-autonomous-car/image-1.jpg",
      "/projects/sigma-autonomous-car/image-2.jpg",
      "/projects/sigma-autonomous-car/image-3.jpg",
    ],
    video: "/projects/sigma-autonomous-car/demo.mp4",
  },
  podmanager: {
    id: "podmanager",
    title: "PodManager.ai",
    type: "Production Internship · Fullstack Development",
    role: "Fullstack Developer Intern",
    period: "2025 – 2026",
    summary:
      "During my internship, I worked inside a real production codebase for a podcast SaaS platform. I contributed to recording, editing, publishing, and AI-assisted workflow features while following team conventions and code-review practices.",
    technologies: ["Next.js", "TypeScript", "FastAPI", "Python", "AI Workflows", "Production Codebase"],
    contributions: [
      "Implemented waveform visualization to make podcast audio easier to navigate and edit.",
      "Worked on the video-track strip for a clearer visual editing experience.",
      "Added support for sound effects and music inside the podcast editor.",
      "Built publish-page toggles for optional intro, outro, and watermark settings.",
      "Refactored existing components to improve structure and maintainability.",
    ],
    images: [
      "/projects/podmanager/cover.png",
      "/projects/podmanager/image-1.png",
      "/projects/podmanager/image-2.png",
    ],
  },
  practicepal: {
    id: "practicepal",
    title: "PracticePal",
    type: "Fullstack Web Application",
    role: "Creator & Fullstack Developer",
    period: "Degree Project",
    summary:
      "A music-practice tracking platform designed to help musicians plan sessions, stay consistent, and review their progress. The application includes authentication, practice planning, statistics, and a subscription flow.",
    technologies: ["Next.js", "TypeScript", "MongoDB", "NextAuth", "Stripe", "Recharts"],
    contributions: [
      "Built authentication with credentials and social-login options.",
      "Created practice-session tracking, planning, and progress-statistics features.",
      "Integrated Stripe subscriptions and webhook handling for the Pro plan.",
      "Used MongoDB for account, practice-session, and subscription data.",
    ],
    images: [],
  },
};

const SECTIONS: PortfolioSection[] = [
  {
    id: "about",
    number: "01",
    title: "About Me",
    eyebrow: "Fullstack · Embedded · Software Developer",
    hotspot: [-6.2, 7.48, 3.4],
    camera: [-11.7, 8.75, 11.25],
    focus: [-6.0, 6.95, 3.0],
  },
  {
    id: "projects",
    number: "02",
    title: "Projects",
    eyebrow: "Selected development work",
    hotspot: [-1.35, 4.42, 5.32],
    camera: [-1.05, 6.95, 13.7],
    focus: [-1.45, 4.2, 4.88],
  },
  {
    id: "credits",
    number: "03",
    markerNumber: "3",
    title: "Credits",
    eyebrow: "Attribution and tools",
    hotspot: [1.48, 10.48, -3.42],
    camera: [-5.45, 11.62, -10.7],
    focus: [1.12, 9.72, -3.06],
  },
];

function NightBackdrop() {
  return (
    <div className="adventure-backdrop adventure-backdrop--original" aria-hidden="true">
      <span className="adventure-original-glow original-glow-left" />
      <span className="adventure-original-glow original-glow-right" />
      <span className="adventure-original-glow original-glow-bottom" />
      <FullscreenNightStars />
      <span className="adventure-original-vignette" />
    </div>
  );
}

function FullscreenNightStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: `${(index * 37 + 13) % 100}%`,
        top: `${(index * 53 + 9) % 95}%`,
        size: 4 + ((index * 11) % 10),
        delay: `${-((index * 0.43) % 5.8)}s`,
        duration: `${2.8 + ((index * 7) % 22) / 10}s`,
      })),
    []
  );

  return (
    <div className="adventure-stars">
      {stars.map((star) => (
        <span
          key={star.id}
          className="adventure-star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}

function AnnotationContent({
  id,
  onProjectSelect,
}: {
  id: SectionId;
  onProjectSelect: (id: ProjectId) => void;
}) {
  if (id === "about") {
    return (
      <>
        <p>
          Hi, I&apos;m Julie Anne. I build playful, polished digital experiences
          with thoughtful details, warm visuals, and a little bit of wonder.
        </p>
        <p>
          I recently graduated from a two-year Fullstack Development program at
          Medieinstitutet in Sweden.
        </p>
        <p>
          React · Next.js · TypeScript · Node.js · Python · FastAPI · MongoDB
        </p>
      </>
    );
  }

  if (id === "projects") {
    return (
      <>
        {(Object.values(PROJECT_CASE_STUDIES) as ProjectCaseStudy[]).map((project) => (
          <button
            key={project.id}
            type="button"
            className="adventure-project-card-button"
            onClick={(event) => {
              event.stopPropagation();
              onProjectSelect(project.id);
            }}
          >
            <strong>{project.title}</strong>
            <span>{project.technologies.slice(0, 5).join(" · ")}</span>
            <em>Open case study →</em>
          </button>
        ))}
      </>
    );
  }

  return (
    <>
      <p>Portfolio concept and implementation by Julie Anne Cantillep.</p>
      <p>
        3D scene: "A Mysterious Adventure - 3D Editor Challenge" by Diosmel,
        used under the Creative Commons Attribution 4.0 license.
      </p>
      <p>Built with Next.js, TypeScript, React Three Fiber, Drei, Three.js, and GSAP.</p>
    </>
  );
}

function ProjectCaseStudyModal({
  projectId,
  onClose,
}: {
  projectId: ProjectId | null;
  onClose: () => void;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [projectId]);

  if (!projectId) return null;

  const project = PROJECT_CASE_STUDIES[projectId];
  const activeImage = project.images[activeImageIndex];

  return (
    <div
      className="adventure-case-study-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <article
        className="adventure-case-study-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} case study`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="adventure-case-study-close"
          onClick={onClose}
          aria-label="Close case study"
        >
          ×
        </button>

        <header className="adventure-case-study-header">
          <p>{project.type}</p>
          <h2>{project.title}</h2>
          <div className="adventure-case-study-meta">
            <span><b>Role</b>{project.role}</span>
            <span><b>Period</b>{project.period}</span>
          </div>
        </header>

        <div className="adventure-case-study-grid">
          <section className="adventure-case-study-gallery">
            {activeImage ? (
              <img
                src={activeImage}
                alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                className="adventure-case-study-main-image"
              />
            ) : (
              <div className="adventure-case-study-empty-gallery">
                <strong>Screenshots coming soon</strong>
                <p>Add PracticePal screenshots inside <code>public/projects/practicepal</code> when they are ready.</p>
              </div>
            )}

            {project.images.length > 1 && (
              <div className="adventure-case-study-thumbnails">
                {project.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={activeImageIndex === index ? "is-active" : ""}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Show screenshot ${index + 1}`}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}

            {project.video && (
              <video
                className="adventure-case-study-video"
                controls
                preload="metadata"
                poster={project.images[0]}
              >
                <source src={project.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </section>

          <section className="adventure-case-study-content">
            <p className="adventure-case-study-summary">{project.summary}</p>

            <div>
              <h3>What I worked on</h3>
              <ul>
                {project.contributions.map((contribution) => (
                  <li key={contribution}>{contribution}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Technologies</h3>
              <div className="adventure-case-study-tags">
                {project.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}

function NumberHotspot({
  section,
  disabled,
  selected,
  onSelect,
  onClose,
  onProjectSelect,
}: {
  section: PortfolioSection;
  disabled: boolean;
  selected: boolean;
  onSelect: (section: PortfolioSection) => void;
  onClose: () => void;
  onProjectSelect: (id: ProjectId) => void;
}) {
  return (
    <Html
      position={section.hotspot}
      center
      zIndexRange={[40, 0]}
      style={{ pointerEvents: "auto" }}
    >
      <div className={`adventure-annotation-wrap ${selected ? "is-open" : ""}`}>
        <button
          type="button"
          className={`adventure-number ${selected ? "is-selected" : ""}`}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(section);
          }}
          aria-label={`Open ${section.title}`}
        >
          <span className="adventure-number-ripple" />
          <span className="adventure-number-ripple ripple-two" />
          <span className="adventure-number-core">{section.markerNumber ?? section.number}</span>
        </button>

        {selected && (
          <section className="adventure-annotation-card">
            <button
              type="button"
              className="adventure-annotation-close"
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
              aria-label={`Close ${section.title}`}
            >
              ×
            </button>

            <p className="adventure-annotation-card-number">{section.number}</p>
            <h2>{section.title}</h2>
            <p className="adventure-annotation-card-eyebrow">{section.eyebrow}</p>

            <div className={`adventure-annotation-card-copy is-${section.id}`}>
              <AnnotationContent id={section.id} onProjectSelect={onProjectSelect} />
            </div>
          </section>
        )}
      </div>
    </Html>
  );
}

function AdventureSceneContent({
  viewportWidth,
  activeId,
  onActiveChange,
  onProjectSelect,
  onSceneReady,
}: {
  viewportWidth: number;
  activeId: SectionId | null;
  onActiveChange: (id: SectionId | null) => void;
  onProjectSelect: (id: ProjectId) => void;
  onSceneReady?: () => void;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const readyRef = useRef(false);
  const [moving, setMoving] = useState(false);

  const compact = viewportWidth < 768;
  const homeCamera = compact ? HOME_CAMERA_MOBILE : HOME_CAMERA_DESKTOP;

  useEffect(() => {
    const perspectiveCamera = camera as PerspectiveCamera;
    perspectiveCamera.fov = compact ? 43 : 36;
    perspectiveCamera.updateProjectionMatrix();
  }, [camera, compact]);

  const moveCamera = (
    nextCamera: [number, number, number],
    nextTarget: [number, number, number],
    duration = 1.35
  ) => {
    if (!controlsRef.current) return;

    setMoving(true);
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controlsRef.current.target);

    const timeline = gsap.timeline({
      onUpdate: () => controlsRef.current?.update(),
      onComplete: () => setMoving(false),
    });

    timeline.to(
      camera.position,
      { x: nextCamera[0], y: nextCamera[1], z: nextCamera[2], duration, ease: "power3.inOut" },
      0
    );
    timeline.to(
      controlsRef.current.target,
      { x: nextTarget[0], y: nextTarget[1], z: nextTarget[2], duration, ease: "power3.inOut" },
      0
    );
  };

  const closeAnnotation = () => {
    onActiveChange(null);
    moveCamera(homeCamera, HOME_TARGET, 1.35);
  };

  const moveToCreditsRooftop = (section: PortfolioSection) => {
    if (!controlsRef.current) return;

    setMoving(true);
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controlsRef.current.target);

    const timeline = gsap.timeline({
      onUpdate: () => controlsRef.current?.update(),
      onComplete: () => setMoving(false),
    });

    timeline.to(camera.position, { x: 9.15, y: 11.0, z: -0.8, duration: 0.9, ease: "power2.inOut" }, 0);
    timeline.to(controlsRef.current.target, { x: 1.5, y: 9.9, z: -2.85, duration: 0.9, ease: "power2.inOut" }, 0);
    timeline.to(camera.position, { x: section.camera[0], y: section.camera[1], z: section.camera[2], duration: 1.35, ease: "power3.inOut" }, 0.9);
    timeline.to(controlsRef.current.target, { x: section.focus[0], y: section.focus[1], z: section.focus[2], duration: 1.35, ease: "power3.inOut" }, 0.9);
  };

  const selectSection = (section: PortfolioSection) => {
    if (moving) return;
    onActiveChange(section.id);
    if (section.id === "credits") { moveToCreditsRooftop(section); return; }
    moveCamera(section.camera, section.focus);
  };

  useEffect(() => {
    const handleSelection = (event: Event) => {
      const customEvent = event as CustomEvent<{ id?: SectionId | "home" }>;
      const requestedId = customEvent.detail?.id;
      if (requestedId === "home") { onActiveChange(null); moveCamera(homeCamera, HOME_TARGET); return; }
      const section = SECTIONS.find((item) => item.id === requestedId);
      if (section) selectSection(section);
    };
    window.addEventListener("adventure:select", handleSelection);
    return () => window.removeEventListener("adventure:select", handleSelection);
  });

  useEffect(() => {
    const handleIntro = () => {
      if (!controlsRef.current) return;
      camera.position.set(...INTRO_CAMERA);
      controlsRef.current.target.set(...INTRO_TARGET);
      controlsRef.current.update();
      moveCamera(homeCamera, HOME_TARGET, 2.15);
    };
    window.addEventListener("adventure:intro", handleIntro);
    return () => window.removeEventListener("adventure:intro", handleIntro);
  }, [camera, homeCamera]);

  useEffect(() => {
    if (!controlsRef.current || readyRef.current) return;
    readyRef.current = true;
    requestAnimationFrame(() => { requestAnimationFrame(() => onSceneReady?.()); });
  }, [onSceneReady]);

  return (
    <>
      <color attach="background" args={["#010106"]} />
      <fog attach="fog" args={["#010106", 30, 74]} />
      <ambientLight intensity={0.12} />

      <spotLight
        position={[9, 17, 11]}
        angle={0.52}
        penumbra={0.86}
        intensity={4.15}
        color="#ffd0b6"
        distance={48}
        decay={1.45}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <spotLight
        position={[-11, 14, -10]}
        angle={0.68}
        penumbra={0.92}
        intensity={2.75}
        color="#727cff"
        distance={52}
        decay={1.55}
      />

      <pointLight position={[2.5, 8.2, 1.7]} intensity={1.7} color="#ff7665" distance={20} decay={1.5} />

      <Stars radius={78} depth={38} count={900} factor={2.35} saturation={0} fade speed={0.22} />

      <MysteriousAdventureModel />

      {/* Street lamp cone near the cones — intensity lowered */}
      <TokyoStreetLampGlow />

      {/* Right-side building wrap — same warm amber family as the street lamp */}
      <pointLight position={[10, 12, 4]} intensity={5}  distance={28} decay={1.6}  color="#ffc87a" />
      <pointLight position={[10, 7,  5]} intensity={6}  distance={24} decay={1.65} color="#ffbe72" />
      <pointLight position={[9,  3.5, 6]} intensity={7} distance={22} decay={1.6}  color="#ffba68" />
      <pointLight position={[8,  0.8, 8]} intensity={7} distance={20} decay={1.55} color="#ffb660" />
      <pointLight position={[7,  0.5, 3]} intensity={6} distance={18} decay={1.6}  color="#ffc070" />
      <pointLight position={[5,  2.5, 1]} intensity={5} distance={16} decay={1.7}  color="#ffbe74" />
      <pointLight position={[9,  0.1, 6]} intensity={8} distance={22} decay={1.5}  color="#ffb258" />

      {/*
        Back-alley pink glow — lantern/neon-sign light contained behind the
        buildings. Negative Z keeps all lights on the far side of the facade.
        Short distance values prevent any bleed through to the front street.
      */}
      <BackAlleyPinkGlow />

      {SECTIONS.map((section) => (
        <NumberHotspot
          key={section.id}
          section={section}
          disabled={moving}
          selected={activeId === section.id}
          onSelect={selectSection}
          onClose={closeAnnotation}
          onProjectSelect={onProjectSelect}
        />
      ))}

      <EffectComposer multisampling={0} enableNormalPass>
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          samples={12}
          rings={4}
          radius={0.075}
          intensity={1.2}
          luminanceInfluence={0.52}
          resolutionScale={0.65}
        />
        <Bloom mipmapBlur intensity={0.62} luminanceThreshold={0.58} luminanceSmoothing={0.24} />
        <Vignette eskil={false} offset={0.18} darkness={0.72} />
      </EffectComposer>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={HOME_TARGET}
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={compact ? 8.5 : 7.2}
        maxDistance={compact ? 42 : 34}
        minPolarAngle={Math.PI / 7}
        maxPolarAngle={Math.PI / 2.05}
        zoomSpeed={compact ? 0.9 : 0.5}
        rotateSpeed={compact ? 0.38 : 0.48}
        touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_ROTATE }}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

export default function HeroScene({ onSceneReady }: { onSceneReady?: () => void }) {
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 1440 : window.innerWidth
  );
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId | null>(null);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectFromBottomNav = (id: SectionId) => {
    window.dispatchEvent(new CustomEvent("adventure:select", { detail: { id } }));
  };

  return (
    <section className="adventure-scene-shell">
      <NightBackdrop />

      <Canvas
        shadows
        dpr={viewportWidth < 768 ? [1, 1.4] : [1, 1.85]}
        camera={{
          position: viewportWidth < 768 ? HOME_CAMERA_MOBILE : HOME_CAMERA_DESKTOP,
          fov: viewportWidth < 768 ? 43 : 36,
          near: 0.1,
          far: 300,
        }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.92;
        }}
        style={{ touchAction: "none", position: "relative", zIndex: 2 }}
      >
        <Suspense fallback={null}>
          <AdventureSceneContent
            viewportWidth={viewportWidth}
            activeId={activeId}
            onActiveChange={setActiveId}
            onProjectSelect={setSelectedProjectId}
            onSceneReady={onSceneReady}
          />
        </Suspense>
      </Canvas>

      <div className="adventure-intro-copy">
        <p className="adventure-kicker">Fullstack Developer</p>
        <h1>Julie Anne Cantillep</h1>
        <p>Click a numbered marker. Drag to rotate and scroll or pinch to zoom.</p>
      </div>

      <nav className="adventure-bottom-nav" aria-label="Portfolio sections">
        {SECTIONS.map((section) => (
          <button
            type="button"
            key={section.id}
            onClick={() => selectFromBottomNav(section.id)}
            className={activeId === section.id ? "is-active" : ""}
          >
            <span>{section.number}</span>
            {section.title}
          </button>
        ))}
      </nav>

      <ProjectCaseStudyModal
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
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
          border: 1px solid rgba(255,255,255,0.45);
          border-radius: 999px;
          background: rgba(6, 7, 11, 0.8);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.28), 0 0 13px rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.96);
          cursor: pointer;
          transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
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
          border: 1px solid rgba(255,255,255,0.44);
          border-radius: inherit;
          animation: adventure-annotation-ripple 2.25s ease-out infinite;
        }

        .adventure-number-ripple.ripple-two { animation-delay: 1.12s; }

        .adventure-number:hover,
        .adventure-number.is-selected {
          transform: scale(1.16);
          border-color: rgba(255,255,255,0.92);
          background: rgba(17, 14, 23, 0.96);
        }

        @keyframes adventure-annotation-ripple {
          0% { transform: scale(0.82); opacity: 0; }
          22% { opacity: 0.62; }
          100% { transform: scale(1.9); opacity: 0; }
        }

        .adventure-annotation-card {
          position: absolute;
          left: 48px;
          top: -18px;
          width: min(310px, 76vw);
          max-height: min(390px, 70vh);
          overflow-y: auto;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 16px;
          background: rgba(6, 7, 12, 0.82);
          box-shadow: 0 18px 44px rgba(0,0,0,0.42);
          padding: 16px;
          color: #fff;
          backdrop-filter: blur(15px);
          animation: adventure-card-enter 220ms ease both;
        }

        .adventure-annotation-close {
          position: absolute;
          right: 9px;
          top: 9px;
          display: grid;
          width: 26px;
          height: 26px;
          place-items: center;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
          color: #fff;
          cursor: pointer;
          font-size: 16px;
        }

        .adventure-annotation-card-number,
        .adventure-annotation-card-eyebrow,
        .adventure-kicker {
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
          color: rgba(255,255,255,0.78);
          font-size: 12px;
          line-height: 1.58;
        }

        .adventure-annotation-card-copy p { margin: 0; }

        .adventure-annotation-card-copy article {
          display: grid;
          gap: 4px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 11px;
          background: rgba(255,255,255,0.045);
          padding: 10px;
        }

        .adventure-annotation-card-copy article span {
          color: #dac7ff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.09em;
          line-height: 1.45;
          text-transform: uppercase;
        }

        @keyframes adventure-card-enter {
          from { opacity: 0; transform: translateX(-8px) translateY(4px) scale(0.97); }
          to { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
        }

        .adventure-intro-copy {
          pointer-events: none;
          position: absolute;
          left: clamp(18px, 5vw, 72px);
          top: clamp(22px, 7vh, 82px);
          z-index: 10;
          width: min(330px, 78vw);
          color: white;
          text-shadow: 0 3px 18px rgba(0, 0, 0, 0.62);
        }

        .adventure-intro-copy h1 {
          margin: 12px 0 8px;
          max-width: 330px;
          font-size: clamp(2.5rem, 6vw, 5.1rem);
          font-weight: 900;
          letter-spacing: -0.075em;
          line-height: 0.94;
        }

        .adventure-intro-copy > p:last-child {
          margin: 0;
          max-width: 285px;
          color: rgba(255,255,255,0.78);
          font-size: 13px;
          line-height: 1.6;
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
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px;
          background: rgba(10, 9, 16, 0.72);
          box-shadow: 0 12px 34px rgba(0,0,0,0.32);
          backdrop-filter: blur(16px);
        }

        .adventure-bottom-nav button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: rgba(255,255,255,0.82);
          cursor: pointer;
          padding: 11px 14px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: background 180ms ease, color 180ms ease;
          white-space: nowrap;
        }

        .adventure-bottom-nav button:hover,
        .adventure-bottom-nav button.is-active {
          background: rgba(255,255,255,0.92);
          color: #17121e;
        }

        .adventure-bottom-nav span { opacity: 0.72; }

        .adventure-project-card-button {
          display: grid;
          width: 100%;
          gap: 4px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 11px;
          background: rgba(255,255,255,0.045);
          padding: 10px;
          color: rgba(255,255,255,0.92);
          cursor: pointer;
          text-align: left;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .adventure-project-card-button:hover {
          transform: translateY(-2px);
          border-color: rgba(219,199,255,0.42);
          background: rgba(255,255,255,0.095);
        }

        .adventure-project-card-button strong { font-size: 12px; }
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
          color: rgba(255,255,255,0.58);
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
          animation: adventure-modal-fade-in 180ms ease both;
        }

        .adventure-case-study-modal {
          position: relative;
          width: min(1080px, 100%);
          max-height: min(900px, calc(100dvh - 44px));
          overflow-y: auto;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(13,15,28,0.97), rgba(26,18,39,0.95));
          box-shadow: 0 30px 90px rgba(0,0,0,0.55);
          color: white;
          padding: 24px;
          animation: adventure-modal-enter 220ms ease both;
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
          border: 1px solid rgba(255,255,255,0.17);
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          color: white;
          cursor: pointer;
          font-size: 23px;
          transition: background 180ms ease, transform 180ms ease;
        }

        .adventure-case-study-close:hover { background: rgba(255,255,255,0.16); transform: rotate(6deg); }

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
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          background: rgba(255,255,255,0.055);
          padding: 7px 10px;
          color: rgba(255,255,255,0.72);
          font-size: 11px;
        }

        .adventure-case-study-meta b { color: #dbc7ff; }

        .adventure-case-study-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(270px, 0.82fr);
          gap: 22px;
          margin-top: 24px;
        }

        .adventure-case-study-gallery,
        .adventure-case-study-content { min-width: 0; }

        .adventure-case-study-main-image,
        .adventure-case-study-empty-gallery {
          width: 100%;
          aspect-ratio: 16 / 10;
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 17px;
          background: rgba(255,255,255,0.05);
          object-fit: contain;
        }

        .adventure-case-study-empty-gallery {
          display: grid;
          place-content: center;
          gap: 6px;
          padding: 24px;
          color: rgba(255,255,255,0.76);
          text-align: center;
        }
        .adventure-case-study-empty-gallery p { margin: 0; font-size: 12px; line-height: 1.6; }
        .adventure-case-study-empty-gallery code { color: #dbc7ff; }

        .adventure-case-study-thumbnails {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-top: 9px;
        }

        .adventure-case-study-thumbnails button {
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 11px;
          background: rgba(255,255,255,0.05);
          padding: 0;
          cursor: pointer;
          opacity: 0.58;
          transition: opacity 160ms ease, border-color 160ms ease, transform 160ms ease;
        }
        .adventure-case-study-thumbnails button:hover,
        .adventure-case-study-thumbnails button.is-active { opacity: 1; border-color: rgba(219,199,255,0.66); transform: translateY(-2px); }
        .adventure-case-study-thumbnails img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; }

        .adventure-case-study-video {
          width: 100%;
          margin-top: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 16px;
          background: #05060a;
        }

        .adventure-case-study-content {
          display: grid;
          align-content: start;
          gap: 20px;
          color: rgba(255,255,255,0.76);
          font-size: 13px;
          line-height: 1.68;
        }

        .adventure-case-study-summary { margin: 0; }
        .adventure-case-study-content h3 { margin: 0 0 8px; color: white; font-size: 15px; }
        .adventure-case-study-content ul { display: grid; gap: 7px; margin: 0; padding-left: 18px; }
        .adventure-case-study-content li::marker { color: #dbc7ff; }

        .adventure-case-study-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .adventure-case-study-tags span {
          border: 1px solid rgba(219,199,255,0.19);
          border-radius: 999px;
          background: rgba(219,199,255,0.08);
          padding: 6px 9px;
          color: #dbc7ff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        @keyframes adventure-modal-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes adventure-modal-enter { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

        @media (max-width: 767px) {
          .adventure-intro-copy {
            top: 20px;
            width: min(260px, 76vw);
          }

          .adventure-intro-copy h1 { font-size: 2.85rem; }
          .adventure-intro-copy > p:last-child { max-width: 245px; font-size: 12px; }

          .adventure-bottom-nav {
            bottom: 13px;
            gap: 3px;
            padding: 5px;
          }

          .adventure-bottom-nav button {
            gap: 4px;
            padding: 9px 9px;
            font-size: 8px;
            letter-spacing: 0.1em;
          }

          .adventure-case-study-backdrop { padding: 12px; }
          .adventure-case-study-modal {
            max-height: calc(100dvh - 24px);
            border-radius: 18px;
            padding: 17px;
          }
          .adventure-case-study-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-top: 18px;
          }
          .adventure-case-study-header h2 { font-size: 2.15rem; }

          .adventure-annotation-card {
            left: 50%;
            top: 48px;
            width: min(290px, 82vw);
            transform: translateX(-50%);
            animation: adventure-card-enter-mobile 220ms ease both;
          }

          @keyframes adventure-card-enter-mobile {
            from { opacity: 0; transform: translateX(-50%) translateY(-6px) scale(0.97); }
            to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          }
        }
      `}</style>
    </section>
  );
}