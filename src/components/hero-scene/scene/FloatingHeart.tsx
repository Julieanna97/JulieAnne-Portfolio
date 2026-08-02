"use client";

import {
  Html,
} from "@react-three/drei";

import {
  useFrame,
  type ThreeEvent,
} from "@react-three/fiber";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AdditiveBlending,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PointLight,
  Shape,
  Vector3,
} from "three";

type FloatingHeartProps = {
  position?: [
    number,
    number,
    number,
  ];

  scale?: number;

  /*
   * Message displayed when the heart explodes.
   */
  message?: string;
};

type HeartParticleData = {
  velocity: Vector3;
  spin: Vector3;
  baseScale: number;
  delay: number;
  color: string;
};

const HEART_PARTICLE_COUNT =
  42;

const HEART_BURST_DURATION =
  2.65;

const MESSAGE_DURATION =
  2700;

const HEART_PARTICLE_COLORS = [
  "#ff4fa9",
  "#ff79c8",
  "#ff9ad5",
  "#c97cff",
  "#8eeaff",
  "#fff0fa",
];

/*
 * Deterministic random values prevent the particle layout
 * from changing between component renders.
 */
function seededRandom(
  seed: number,
) {
  const value =
    Math.sin(
      seed * 12.9898,
    ) * 43758.5453;

  return (
    value -
    Math.floor(value)
  );
}

export default function FloatingHeart({
  position = [
    0,
    15.2,
    0,
  ],
  scale = 0.72,
  message =
    "THANK YOU FOR VISITING ♥",
}: FloatingHeartProps) {
  const animatedGroupRef =
    useRef<Group>(null);

  const burstGroupRef =
    useRef<Group>(null);

  const burstLightRef =
    useRef<PointLight>(null);

  const burstRingRef =
    useRef<Mesh>(null);

  const burstRingMaterialRef =
    useRef<MeshBasicMaterial>(
      null,
    );

  const heartMaterialRef =
    useRef<MeshPhysicalMaterial>(
      null,
    );

  const particleRefs =
    useRef<
      Array<Mesh | null>
    >([]);

  const particleMaterialRefs =
    useRef<
      Array<
        MeshBasicMaterial | null
      >
    >([]);

  const latestElapsedRef =
    useRef(0);

  const burstStartRef =
    useRef<number | null>(
      null,
    );

  const burstOriginYRef =
    useRef(0);

  const messageTimeoutRef =
    useRef<number | null>(
      null,
    );

  const lastClickTimeRef =
    useRef(0);

  const [
    hovered,
    setHovered,
  ] = useState(false);

  const [
    burstId,
    setBurstId,
  ] = useState(0);

  const [
    messageVisible,
    setMessageVisible,
  ] = useState(false);

  const heartGeometry =
    useMemo(() => {
      const shape =
        new Shape();

      /*
       * Bottom tip.
       */
      shape.moveTo(
        0,
        -1.05,
      );

      /*
       * Left side.
       */
      shape.bezierCurveTo(
        -0.18,
        -0.78,
        -1.18,
        -0.14,
        -1.18,
        0.62,
      );

      shape.bezierCurveTo(
        -1.18,
        1.25,
        -0.56,
        1.57,
        0,
        0.93,
      );

      /*
       * Right side.
       */
      shape.bezierCurveTo(
        0.56,
        1.57,
        1.18,
        1.25,
        1.18,
        0.62,
      );

      shape.bezierCurveTo(
        1.18,
        -0.14,
        0.18,
        -0.78,
        0,
        -1.05,
      );

      const geometry =
        new ExtrudeGeometry(
          shape,
          {
            depth: 0.34,
            curveSegments: 24,
            bevelEnabled: true,
            bevelSegments: 5,
            bevelSize: 0.07,
            bevelThickness: 0.07,
            steps: 1,
          },
        );

      geometry.center();
      geometry.computeVertexNormals();

      return geometry;
    }, []);

  /*
   * Generate heart-shaped firework particles.
   *
   * The particles burst primarily across the X/Y plane,
   * with smaller movement along Z to create depth.
   */
  const particles =
    useMemo<
      HeartParticleData[]
    >(
      () =>
        Array.from(
          {
            length:
              HEART_PARTICLE_COUNT,
          },
          (
            _,
            index,
          ) => {
            const angle =
              (index /
                HEART_PARTICLE_COUNT) *
                Math.PI *
                2 +
              seededRandom(
                index + 1,
              ) *
                0.22;

            const speed =
              4.4 +
              seededRandom(
                index + 20,
              ) *
                3.1;

            const verticalBoost =
              0.65 +
              seededRandom(
                index + 40,
              ) *
                0.75;

            const depth =
              (seededRandom(
                index + 60,
              ) -
                0.5) *
              3.1;

            return {
              velocity:
                new Vector3(
                  Math.cos(
                    angle,
                  ) * speed,

                  Math.sin(
                    angle,
                  ) *
                    speed *
                    0.88 +
                    verticalBoost,

                  depth,
                ),

              spin:
                new Vector3(
                  seededRandom(
                    index + 80,
                  ) *
                    5 -
                    2.5,

                  seededRandom(
                    index + 100,
                  ) *
                    6 -
                    3,

                  seededRandom(
                    index + 120,
                  ) *
                    7 -
                    3.5,
                ),

              baseScale:
                0.075 +
                seededRandom(
                  index + 140,
                ) *
                  0.065,

              delay:
                (index % 4) *
                0.018,

              color:
                HEART_PARTICLE_COLORS[
                  index %
                    HEART_PARTICLE_COLORS.length
                ],
            };
          },
        ),
      [],
    );

  useEffect(() => {
    return () => {
      heartGeometry.dispose();

      document.body.style.cursor =
        "";

      if (
        messageTimeoutRef.current !==
        null
      ) {
        window.clearTimeout(
          messageTimeoutRef.current,
        );
      }
    };
  }, [heartGeometry]);

  const startHeartFirework =
    useCallback(
      (
        event:
          ThreeEvent<MouseEvent>,
      ) => {
        event.stopPropagation();

        const currentTime =
          performance.now();

        /*
         * Prevent accidental rapid double triggering.
         */
        if (
          currentTime -
            lastClickTimeRef.current <
          300
        ) {
          return;
        }

        lastClickTimeRef.current =
          currentTime;

        burstOriginYRef.current =
          animatedGroupRef.current
            ?.position.y ?? 0;

        burstStartRef.current =
          latestElapsedRef.current;

        if (
          burstGroupRef.current
        ) {
          burstGroupRef.current.visible =
            true;

          burstGroupRef.current.position.set(
            0,
            burstOriginYRef.current,
            0,
          );
        }

        setBurstId(
          (current) =>
            current + 1,
        );

        setMessageVisible(
          true,
        );

        if (
          messageTimeoutRef.current !==
          null
        ) {
          window.clearTimeout(
            messageTimeoutRef.current,
          );
        }

        messageTimeoutRef.current =
          window.setTimeout(
            () => {
              setMessageVisible(
                false,
              );

              messageTimeoutRef.current =
                null;
            },
            MESSAGE_DURATION,
          );
      },
      [],
    );

  const handlePointerOver =
    useCallback(
      (
        event:
          ThreeEvent<PointerEvent>,
      ) => {
        event.stopPropagation();

        setHovered(true);

        document.body.style.cursor =
          "pointer";
      },
      [],
    );

  const handlePointerOut =
    useCallback(
      (
        event:
          ThreeEvent<PointerEvent>,
      ) => {
        event.stopPropagation();

        setHovered(false);

        document.body.style.cursor =
          "";
      },
      [],
    );

  useFrame(
    (
      state,
      delta,
    ) => {
      const elapsed =
        state.clock.elapsedTime;

      latestElapsedRef.current =
        elapsed;

      const heartGroup =
        animatedGroupRef.current;

      if (!heartGroup) {
        return;
      }

      /*
       * Smooth vertical floating.
       */
      heartGroup.position.y =
        Math.sin(
          elapsed * 1.25,
        ) * 0.24;

      /*
       * Continuous rotation.
       */
      heartGroup.rotation.y +=
        delta * 0.72;

      /*
       * Small natural tilting.
       */
      heartGroup.rotation.x =
        -0.08 +
        Math.sin(
          elapsed * 0.62,
        ) *
          0.07;

      heartGroup.rotation.z =
        Math.sin(
          elapsed * 0.82,
        ) *
        0.055;

      const burstStart =
        burstStartRef.current;

      let burstPulse = 1;

      if (
        burstStart !== null
      ) {
        const burstElapsed =
          elapsed -
          burstStart;

        if (
          burstElapsed <
          0.38
        ) {
          burstPulse =
            1 +
            Math.sin(
              (burstElapsed /
                0.38) *
                Math.PI,
            ) *
              0.24;
        }

        const burstGroup =
          burstGroupRef.current;

        if (
          burstElapsed <=
          HEART_BURST_DURATION
        ) {
          if (burstGroup) {
            burstGroup.visible =
              true;

            burstGroup.position.y =
              burstOriginYRef.current;
          }

          /*
           * Bright flash at the beginning of the burst.
           */
          if (
            burstLightRef.current
          ) {
            const lightFade =
              Math.max(
                0,
                1 -
                  burstElapsed /
                    0.72,
              );

            burstLightRef.current.intensity =
              lightFade *
              18;
          }

          /*
           * Expanding neon ring.
           */
          if (
            burstRingRef.current
          ) {
            const ringProgress =
              Math.min(
                1,
                burstElapsed /
                  0.7,
              );

            const ringScale =
              0.3 +
              ringProgress *
                4.2;

            burstRingRef.current.scale.setScalar(
              ringScale,
            );
          }

          if (
            burstRingMaterialRef.current
          ) {
            burstRingMaterialRef.current.opacity =
              Math.max(
                0,
                0.9 -
                  burstElapsed /
                    0.75,
              );
          }

          particles.forEach(
            (
              particle,
              index,
            ) => {
              const mesh =
                particleRefs.current[
                  index
                ];

              const material =
                particleMaterialRefs
                  .current[index];

              if (
                !mesh ||
                !material
              ) {
                return;
              }

              const particleTime =
                burstElapsed -
                particle.delay;

              if (
                particleTime <
                  0 ||
                particleTime >
                  HEART_BURST_DURATION
              ) {
                mesh.visible =
                  false;

                material.opacity =
                  0;

                return;
              }

              mesh.visible =
                true;

              /*
               * Firework movement with gravity.
               */
              mesh.position.set(
                particle.velocity.x *
                  particleTime,

                particle.velocity.y *
                  particleTime -
                  2.4 *
                    particleTime *
                    particleTime,

                particle.velocity.z *
                  particleTime,
              );

              mesh.rotation.set(
                particle.spin.x *
                  particleTime,

                particle.spin.y *
                  particleTime,

                particle.spin.z *
                  particleTime,
              );

              const lifeProgress =
                particleTime /
                HEART_BURST_DURATION;

              const fade =
                Math.max(
                  0,
                  1 -
                    lifeProgress,
                );

              const particleScale =
                particle.baseScale *
                (0.55 +
                  fade *
                    0.75);

              mesh.scale.setScalar(
                particleScale,
              );

              material.opacity =
                Math.min(
                  1,
                  fade * 1.6,
                );
            },
          );
        } else {
          if (burstGroup) {
            burstGroup.visible =
              false;
          }

          if (
            burstLightRef.current
          ) {
            burstLightRef.current.intensity =
              0;
          }

          burstStartRef.current =
            null;
        }
      } else {
        if (
          burstGroupRef.current
        ) {
          burstGroupRef.current.visible =
            false;
        }

        if (
          burstLightRef.current
        ) {
          burstLightRef.current.intensity =
            0;
        }
      }

      /*
       * Smooth hover enlargement plus click pulse.
       */
      const hoverScale =
        hovered
          ? 1.13
          : 1;

      const targetScale =
        hoverScale *
        burstPulse;

      const smoothing =
        1 -
        Math.exp(
          -delta * 12,
        );

      const nextScale =
        heartGroup.scale.x +
        (targetScale -
          heartGroup.scale.x) *
          smoothing;

      heartGroup.scale.setScalar(
        nextScale,
      );

      if (
        heartMaterialRef.current
      ) {
        heartMaterialRef.current.emissiveIntensity =
          hovered
            ? 3.45
            : burstStart !==
                null
              ? 3.8
              : 2.1;
      }
    },
  );

  return (
    <group
      position={position}
      scale={scale}
    >
      {/*
       * The visible floating heart and hologram platform.
       */}
      <group
        ref={
          animatedGroupRef
        }
        onClick={
          startHeartFirework
        }
        onPointerDown={(
          event,
        ) => {
          event.stopPropagation();
        }}
        onPointerOver={
          handlePointerOver
        }
        onPointerOut={
          handlePointerOut
        }
      >
        {/*
         * Invisible hit area makes the heart easier to
         * click without changing its appearance.
         */}
        <mesh>
          <sphereGeometry
            args={[
              1.65,
              16,
              16,
            ]}
          />

          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>

        {/*
         * Solid glowing heart.
         */}
        <mesh
          geometry={
            heartGeometry
          }
          castShadow
        >
          <meshPhysicalMaterial
            ref={
              heartMaterialRef
            }
            color="#ff79c8"
            emissive="#ff2f9f"
            emissiveIntensity={
              2.1
            }
            roughness={0.2}
            metalness={0.22}
            clearcoat={1}
            clearcoatRoughness={
              0.12
            }
            transparent
            opacity={0.95}
            toneMapped={false}
          />
        </mesh>

        {/*
         * Slightly larger holographic wireframe.
         */}
        <mesh
          geometry={
            heartGeometry
          }
          scale={1.055}
        >
          <meshBasicMaterial
            color="#ffd5f0"
            wireframe
            transparent
            opacity={0.3}
            depthWrite={false}
            toneMapped={false}
            blending={
              AdditiveBlending
            }
          />
        </mesh>

        {/*
         * Soft hologram beam below the heart.
         */}
        <mesh
          position={[
            0,
            -1.12,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.45,
              0.82,
              1.6,
              40,
              1,
              true,
            ]}
          />

          <meshBasicMaterial
            color="#ff74c7"
            transparent
            opacity={0.055}
            side={DoubleSide}
            depthWrite={false}
            toneMapped={false}
            blending={
              AdditiveBlending
            }
          />
        </mesh>

        {/*
         * Main hologram ring.
         */}
        <mesh
          position={[
            0,
            -1.93,
            0,
          ]}
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
        >
          <torusGeometry
            args={[
              0.82,
              0.025,
              10,
              72,
            ]}
          />

          <meshBasicMaterial
            color="#ff90d3"
            transparent
            opacity={0.78}
            depthWrite={false}
            toneMapped={false}
            blending={
              AdditiveBlending
            }
          />
        </mesh>

        {/*
         * Secondary cyan ring.
         */}
        <mesh
          position={[
            0,
            -1.91,
            0,
          ]}
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
        >
          <torusGeometry
            args={[
              0.58,
              0.016,
              8,
              64,
            ]}
          />

          <meshBasicMaterial
            color="#7cecff"
            transparent
            opacity={0.5}
            depthWrite={false}
            toneMapped={false}
            blending={
              AdditiveBlending
            }
          />
        </mesh>

        {/*
         * Faint glowing base.
         */}
        <mesh
          position={[
            0,
            -1.94,
            0,
          ]}
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
        >
          <circleGeometry
            args={[
              0.7,
              64,
            ]}
          />

          <meshBasicMaterial
            color="#ff4fb7"
            transparent
            opacity={0.08}
            side={DoubleSide}
            depthWrite={false}
            toneMapped={false}
            blending={
              AdditiveBlending
            }
          />
        </mesh>

        <pointLight
          position={[
            0,
            -0.2,
            0.4,
          ]}
          color="#ff64bd"
          intensity={2.2}
          distance={7}
          decay={1.8}
        />

        <pointLight
          position={[
            0,
            -1.8,
            0,
          ]}
          color="#63dfff"
          intensity={0.75}
          distance={4}
          decay={2}
        />
      </group>

      {/*
       * Heart-shaped firework explosion.
       */}
      <group
        ref={
          burstGroupRef
        }
        visible={false}
      >
        <pointLight
          ref={
            burstLightRef
          }
          color="#ff65bc"
          intensity={0}
          distance={20}
          decay={2}
        />

        {/*
         * Expanding flash ring.
         */}
        <mesh
          ref={
            burstRingRef
          }
        >
          <torusGeometry
            args={[
              0.8,
              0.035,
              12,
              80,
            ]}
          />

          <meshBasicMaterial
            ref={
              burstRingMaterialRef
            }
            color="#ff9bd5"
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
            blending={
              AdditiveBlending
            }
          />
        </mesh>

        {particles.map(
          (
            particle,
            index,
          ) => (
            <mesh
              key={index}
              ref={(mesh) => {
                particleRefs.current[
                  index
                ] = mesh;
              }}
              geometry={
                heartGeometry
              }
              visible={false}
              scale={
                particle.baseScale
              }
            >
              <meshBasicMaterial
                ref={(
                  material,
                ) => {
                  particleMaterialRefs.current[
                    index
                  ] =
                    material;
                }}
                color={
                  particle.color
                }
                transparent
                opacity={0}
                depthWrite={false}
                toneMapped={false}
                blending={
                  AdditiveBlending
                }
              />
            </mesh>
          ),
        )}
      </group>

      {/*
       * Firework message.
       */}
      {messageVisible && (
        <Html
          key={
            burstId
          }
          position={[
            0,
            2.65,
            0,
          ]}
          center
          distanceFactor={8}
          zIndexRange={[
            90,
            0,
          ]}
          style={{
            pointerEvents:
              "none",
          }}
        >
          <div className="floating-heart-firework-message">
            <span>
              {message}
            </span>
          </div>

          <style>{`
            @keyframes floating-heart-message-burst {
              0% {
                opacity: 0;
                transform:
                  translateY(18px)
                  scale(0.3);
                filter: blur(10px);
              }

              18% {
                opacity: 1;
                transform:
                  translateY(0)
                  scale(1.16);
                filter: blur(0);
              }

              32% {
                transform:
                  translateY(0)
                  scale(1);
              }

              76% {
                opacity: 1;
                transform:
                  translateY(-6px)
                  scale(1);
                filter: blur(0);
              }

              100% {
                opacity: 0;
                transform:
                  translateY(-28px)
                  scale(0.86);
                filter: blur(8px);
              }
            }

            .floating-heart-firework-message {
              position: relative;

              width: max-content;
              max-width: min(
                430px,
                78vw
              );

              border:
                1px solid
                rgba(
                  255,
                  181,
                  224,
                  0.78
                );

              border-radius: 999px;

              background:
                linear-gradient(
                  135deg,
                  rgba(
                    46,
                    14,
                    67,
                    0.9
                  ),
                  rgba(
                    22,
                    8,
                    40,
                    0.92
                  )
                );

              box-shadow:
                0 0 14px
                  rgba(
                    255,
                    79,
                    169,
                    0.7
                  ),
                0 0 42px
                  rgba(
                    188,
                    91,
                    255,
                    0.48
                  ),
                0 14px 35px
                  rgba(
                    0,
                    0,
                    0,
                    0.38
                  );

              padding:
                11px 21px;

              color: #fff4fb;

              font-family:
                Arial,
                sans-serif;

              font-size: 12px;
              font-weight: 900;
              letter-spacing:
                0.14em;

              text-align: center;
              text-transform:
                uppercase;

              white-space: nowrap;

              animation:
                floating-heart-message-burst
                ${MESSAGE_DURATION}ms
                cubic-bezier(
                  0.22,
                  1,
                  0.36,
                  1
                )
                forwards;

              backdrop-filter:
                blur(12px);
            }

            .floating-heart-firework-message::before,
            .floating-heart-firework-message::after {
              content: "♥";

              position: absolute;

              top: 50%;

              color: #ff82c7;

              font-size: 15px;

              text-shadow:
                0 0 10px
                rgba(
                  255,
                  91,
                  181,
                  0.9
                );

              transform:
                translateY(-50%);
            }

            .floating-heart-firework-message::before {
              left: -25px;
            }

            .floating-heart-firework-message::after {
              right: -25px;
            }

            @media (
              max-width: 767px
            ) {
              .floating-heart-firework-message {
                max-width: 72vw;

                padding:
                  9px 15px;

                font-size: 9px;
                letter-spacing:
                  0.1em;

                white-space: normal;
              }
            }

            @media (
              prefers-reduced-motion:
                reduce
            ) {
              .floating-heart-firework-message {
                animation-duration:
                  0.01ms;
              }
            }
          `}</style>
        </Html>
      )}
    </group>
  );
}