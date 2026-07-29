"use client";

import {
  Billboard,
  useGLTF,
} from "@react-three/drei";
import {
  useFrame,
} from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  SRGBColorSpace,
} from "three";

type SakuraGLTF = {
  nodes: {
    Object001_mossybark02_0Mat_0: {
      geometry: any;
    };

    Object002_sakura_branch_new01_1Mat_0: {
      geometry: any;
    };
  };

  materials: {
    mossybark02_0Mat:
      MeshStandardMaterial;

    sakura_branch_new01_1Mat:
      MeshStandardMaterial;
  };
};

/*
  Stable position shared by the tree, the falling petals,
  and the petals lying on the floor.
*/
const RIGHT_TREE_BASE: [
  number,
  number,
  number,
] = [
  7.2,
  -0.04,
  -15.8,
];

const FALLING_PETAL_COUNT =
  58;

function randomRange(
  min: number,
  max: number
) {
  return (
    min +
    Math.random() *
      (max - min)
  );
}

function createPetalTexture() {
  if (
    typeof document ===
    "undefined"
  ) {
    return null;
  }

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    128;

  canvas.height =
    128;

  const ctx =
    canvas.getContext(
      "2d"
    );

  if (!ctx) {
    return null;
  }

  ctx.clearRect(
    0,
    0,
    128,
    128
  );

  ctx.translate(
    64,
    64
  );

  ctx.beginPath();

  ctx.moveTo(
    0,
    -28
  );

  ctx.bezierCurveTo(
    18,
    -26,
    28,
    -10,
    18,
    10
  );

  ctx.bezierCurveTo(
    12,
    22,
    4,
    30,
    0,
    36
  );

  ctx.bezierCurveTo(
    -4,
    30,
    -12,
    22,
    -18,
    10
  );

  ctx.bezierCurveTo(
    -28,
    -10,
    -18,
    -26,
    0,
    -28
  );

  ctx.closePath();

  const gradient =
    ctx.createLinearGradient(
      0,
      -28,
      0,
      36
    );

  gradient.addColorStop(
    0,
    "rgba(255,245,252,1)"
  );

  gradient.addColorStop(
    0.42,
    "rgba(255,186,224,1)"
  );

  gradient.addColorStop(
    1,
    "rgba(255,105,184,1)"
  );

  ctx.fillStyle =
    gradient;

  ctx.shadowColor =
    "rgba(255,85,185,0.5)";

  ctx.shadowBlur =
    11;

  ctx.fill();

  ctx.shadowBlur =
    0;

  ctx.beginPath();

  ctx.moveTo(
    0,
    -18
  );

  ctx.lineTo(
    0,
    20
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.3)";

  ctx.lineWidth =
    2;

  ctx.stroke();

  const texture =
    new CanvasTexture(
      canvas
    );

  texture.colorSpace =
    SRGBColorSpace;

  texture.needsUpdate =
    true;

  return texture;
}

function GroundPetals({
  center,
  petalTexture,
  count = 42,
  radiusX = 2.5,
  radiusZ = 2.2,
}: {
  center: [
    number,
    number,
    number,
  ];

  petalTexture:
    | CanvasTexture
    | null;

  count?: number;
  radiusX?: number;
  radiusZ?: number;
}) {
  const petals =
    useMemo(
      () =>
        Array.from(
          {
            length:
              count,
          },
          () => {
            const angle =
              Math.random() *
              Math.PI *
              2;

            /*
              Square-root distribution keeps the petals naturally
              scattered instead of forming a hard ring.
            */
            const distance =
              Math.sqrt(
                Math.random()
              );

            return {
              x:
                center[0] +
                Math.cos(
                  angle
                ) *
                  radiusX *
                  distance,

              y:
                center[1] +
                0.013 +
                Math.random() *
                  0.009,

              z:
                center[2] +
                Math.sin(
                  angle
                ) *
                  radiusZ *
                  distance,

              rotY:
                Math.random() *
                Math.PI *
                2,

              rotZ:
                Math.random() *
                Math.PI *
                2,

              scaleX:
                randomRange(
                  0.12,
                  0.21
                ),

              scaleY:
                randomRange(
                  0.16,
                  0.25
                ),

              opacity:
                randomRange(
                  0.42,
                  0.76
                ),

              color:
                Math.random() >
                0.5
                  ? "#ffadd8"
                  : "#ffd6eb",
            };
          }
        ),
      [
        center,
        count,
        radiusX,
        radiusZ,
      ]
    );

  return (
    <group>
      {petals.map(
        (
          petal,
          index
        ) => (
          <mesh
            key={
              index
            }
            position={[
              petal.x,
              petal.y,
              petal.z,
            ]}
            rotation={[
              -Math.PI /
                2,
              petal.rotY,
              petal.rotZ,
            ]}
            scale={[
              petal.scaleX,
              petal.scaleY,
              1,
            ]}
          >
            <planeGeometry
              args={[
                1,
                1,
              ]}
            />

            <meshBasicMaterial
              map={
                petalTexture ??
                undefined
              }
              alphaMap={
                petalTexture ??
                undefined
              }
              color={
                petal.color
              }
              transparent
              opacity={
                petal.opacity
              }
              alphaTest={
                0.04
              }
              side={
                DoubleSide
              }
              depthWrite={
                false
              }
              toneMapped={
                false
              }
            />
          </mesh>
        )
      )}
    </group>
  );
}

function SakuraTree({
  position,
  rotation = [
    0,
    0,
    0,
  ],
  scale = 0.43,
}: {
  position: [
    number,
    number,
    number,
  ];

  rotation?: [
    number,
    number,
    number,
  ];

  scale?: number;
}) {
  const pinkLightRef =
    useRef<PointLight>(
      null
    );

  const purpleLightRef =
    useRef<PointLight>(
      null
    );

  const {
    nodes,
    materials,
  } = useGLTF(
    "/sakura.glb"
  ) as unknown as SakuraGLTF;

  const barkMaterial =
    useMemo(() => {
      const mat =
        materials.mossybark02_0Mat.clone();

      mat.color =
        new Color(
          "#3b171f"
        );

      mat.roughness =
        0.9;

      mat.metalness =
        0.03;

      mat.emissive =
        new Color(
          "#5a153d"
        );

      mat.emissiveIntensity =
        0.16;

      return mat;
    }, [
      materials
        .mossybark02_0Mat,
    ]);

  const blossomMaterial =
    useMemo(() => {
      const mat =
        materials.sakura_branch_new01_1Mat.clone();

      mat.color =
        new Color(
          "#ff8fd1"
        );

      mat.roughness =
        0.62;

      mat.metalness =
        0.02;

      mat.emissive =
        new Color(
          "#ff249f"
        );

      mat.emissiveIntensity =
        1.05;

      /*
        Keep the blossoms vivid against the pure-black background.
      */
      mat.toneMapped =
        false;

      return mat;
    }, [
      materials
        .sakura_branch_new01_1Mat,
    ]);

  const blossomGlowMaterial =
    useMemo(
      () =>
        new MeshBasicMaterial(
          {
            color:
              "#ff3cac",

            transparent:
              true,

            opacity:
              0.075,

            side:
              DoubleSide,

            depthWrite:
              false,

            toneMapped:
              false,

            blending:
              AdditiveBlending,
          }
        ),
      []
    );

  const blossomWireMaterial =
    useMemo(
      () =>
        new MeshBasicMaterial(
          {
            color:
              "#ffd2ed",

            wireframe:
              true,

            transparent:
              true,

            opacity:
              0.11,

            depthWrite:
              false,

            toneMapped:
              false,

            blending:
              AdditiveBlending,
          }
        ),
      []
    );

  useEffect(() => {
    return () => {
      barkMaterial.dispose();
      blossomMaterial.dispose();
      blossomGlowMaterial.dispose();
      blossomWireMaterial.dispose();
    };
  }, [
    barkMaterial,
    blossomMaterial,
    blossomGlowMaterial,
    blossomWireMaterial,
  ]);

  useFrame(
    (
      state
    ) => {
      const elapsed =
        state.clock.elapsedTime;

      const pulse =
        (
          Math.sin(
            elapsed *
              1.35
          ) +
          1
        ) /
        2;

      /*
        Gentle holographic pulsing, similar to the floating heart.
      */
      blossomMaterial.emissiveIntensity =
        0.95 +
        pulse *
          0.32;

      blossomGlowMaterial.opacity =
        0.055 +
        pulse *
          0.035;

      blossomWireMaterial.opacity =
        0.085 +
        pulse *
          0.04;

      if (
        pinkLightRef.current
      ) {
        pinkLightRef.current.intensity =
          2.15 +
          pulse *
            0.5;
      }

      if (
        purpleLightRef.current
      ) {
        purpleLightRef.current.intensity =
          1.05 +
          pulse *
            0.3;
      }
    }
  );

  return (
    <group
      position={
        position
      }
      rotation={
        rotation
      }
      scale={
        scale
      }
    >
      <group
        scale={
          0.01
        }
      >
        <group
          position={[
            -100.419,
            1682.519,
            -57.096,
          ]}
          rotation={[
            -Math.PI /
              2,
            0,
            0,
          ]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={
              nodes
                .Object001_mossybark02_0Mat_0
                .geometry
            }
            material={
              barkMaterial
            }
            position={[
              -5246.426,
              -139.037,
              -1682.519,
            ]}
          />
        </group>

        <group
          position={[
            -311.737,
            2156.01,
            -26.624,
          ]}
          rotation={[
            -Math.PI /
              2,
            0,
            0,
          ]}
        >
          {/*
            Original blossom surface.
          */}
          <mesh
            castShadow
            receiveShadow
            geometry={
              nodes
                .Object002_sakura_branch_new01_1Mat_0
                .geometry
            }
            material={
              blossomMaterial
            }
            position={[
              -5005.651,
              -106.103,
              -2156.01,
            ]}
          />

          {/*
            Soft additive shell.
          */}
          <mesh
            geometry={
              nodes
                .Object002_sakura_branch_new01_1Mat_0
                .geometry
            }
            material={
              blossomGlowMaterial
            }
            position={[
              -5005.651,
              -106.103,
              -2156.01,
            ]}
            scale={
              1.008
            }
            renderOrder={
              4
            }
          />

          {/*
            Very subtle holographic linework.
          */}
          <mesh
            geometry={
              nodes
                .Object002_sakura_branch_new01_1Mat_0
                .geometry
            }
            material={
              blossomWireMaterial
            }
            position={[
              -5005.651,
              -106.103,
              -2156.01,
            ]}
            scale={
              1.014
            }
            renderOrder={
              5
            }
          />
        </group>
      </group>

      {/*
        Holographic beam and rings at the base of the tree.
      */}
      <mesh
        position={[
          0,
          2.15,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.55,
            1.75,
            4.3,
            40,
            1,
            true,
          ]}
        />

        <meshBasicMaterial
          color="#ff58b6"
          transparent
          opacity={
            0.035
          }
          side={
            DoubleSide
          }
          depthWrite={
            false
          }
          toneMapped={
            false
          }
          blending={
            AdditiveBlending
          }
        />
      </mesh>

      <mesh
        position={[
          0,
          0.055,
          0,
        ]}
        rotation={[
          -Math.PI /
            2,
          0,
          0,
        ]}
      >
        <ringGeometry
          args={[
            1.45,
            2.05,
            72,
          ]}
        />

        <meshBasicMaterial
          color="#ff6fc1"
          transparent
          opacity={
            0.34
          }
          side={
            DoubleSide
          }
          depthWrite={
            false
          }
          toneMapped={
            false
          }
          blending={
            AdditiveBlending
          }
        />
      </mesh>

      <mesh
        position={[
          0,
          0.06,
          0,
        ]}
        rotation={[
          -Math.PI /
            2,
          0,
          0,
        ]}
      >
        <torusGeometry
          args={[
            1.72,
            0.035,
            10,
            80,
          ]}
        />

        <meshBasicMaterial
          color="#ffd3ee"
          transparent
          opacity={
            0.78
          }
          depthWrite={
            false
          }
          toneMapped={
            false
          }
          blending={
            AdditiveBlending
          }
        />
      </mesh>

      <pointLight
        ref={
          pinkLightRef
        }
        position={[
          0,
          3.2,
          0.4,
        ]}
        intensity={
          2.4
        }
        distance={
          11
        }
        decay={
          1.75
        }
        color="#ff48ac"
      />

      <pointLight
        position={[
          1.7,
          5.2,
          1,
        ]}
        intensity={
          1.45
        }
        distance={
          9
        }
        decay={
          1.85
        }
        color="#ffc1e8"
      />

      <pointLight
        ref={
          purpleLightRef
        }
        position={[
          -1.8,
          4.1,
          -1,
        ]}
        intensity={
          1.2
        }
        distance={
          9
        }
        decay={
          1.85
        }
        color="#b56cff"
      />

      <pointLight
        position={[
          0,
          0.6,
          0,
        ]}
        intensity={
          1.15
        }
        distance={
          6.5
        }
        decay={
          2
        }
        color="#ff62b7"
      />
    </group>
  );
}

function SceneMoon() {
  return (
    <Billboard
      position={[
        -26,
        18,
        -46,
      ]}
      follow
    >
      <group>
        <mesh
          position={[
            0,
            0,
            -0.03,
          ]}
        >
          <circleGeometry
            args={[
              4.2,
              64,
            ]}
          />

          <meshBasicMaterial
            color="#9e8dff"
            transparent
            opacity={
              0.08
            }
            depthWrite={
              false
            }
          />
        </mesh>

        <mesh
          position={[
            0,
            0,
            -0.02,
          ]}
        >
          <circleGeometry
            args={[
              3.2,
              64,
            ]}
          />

          <meshBasicMaterial
            color="#cbbcff"
            transparent
            opacity={
              0.12
            }
            depthWrite={
              false
            }
          />
        </mesh>

        <mesh>
          <circleGeometry
            args={[
              2.1,
              64,
            ]}
          />

          <meshBasicMaterial
            color="#f7f4ff"
            transparent
            opacity={
              0.96
            }
          />
        </mesh>
      </group>
    </Billboard>
  );
}

function FallingPetals({
  center,
  petalTexture,
}: {
  center: [
    number,
    number,
    number,
  ];

  petalTexture:
    | CanvasTexture
    | null;
}) {
  const petalRefs =
    useRef<
      (
        | Mesh
        | null
      )[]
    >(
      []
    );

  const petals =
    useMemo(
      () =>
        Array.from(
          {
            length:
              FALLING_PETAL_COUNT,
          },
          () => ({
            x:
              center[0] +
              randomRange(
                -5.1,
                5.1
              ),

            y:
              center[1] +
              randomRange(
                1.4,
                10.2
              ),

            z:
              center[2] +
              randomRange(
                -4.5,
                4.5
              ),

            speed:
              randomRange(
                0.17,
                0.39
              ),

            sway:
              randomRange(
                0.14,
                0.34
              ),

            wobble:
              randomRange(
                0.8,
                2.2
              ),

            driftX:
              randomRange(
                -0.075,
                -0.018
              ),

            driftZ:
              randomRange(
                -0.045,
                0.045
              ),

            spinX:
              randomRange(
                -1.15,
                1.15
              ),

            spinY:
              randomRange(
                -0.9,
                0.9
              ),

            spinZ:
              randomRange(
                -1.55,
                1.55
              ),

            scaleX:
              randomRange(
                0.09,
                0.14
              ),

            scaleY:
              randomRange(
                0.13,
                0.2
              ),

            seed:
              Math.random() *
              1000,

            opacity:
              randomRange(
                0.62,
                0.96
              ),

            color:
              Math.random() >
              0.5
                ? "#ff9fd2"
                : "#ffd2e8",
          }))
      ,
      [
        center,
      ]
    );

  useFrame(
    (
      state,
      delta
    ) => {
      petals.forEach(
        (
          petal,
          index
        ) => {
          const mesh =
            petalRefs.current[
              index
            ];

          if (!mesh) {
            return;
          }

          petal.y -=
            petal.speed *
            delta;

          petal.x +=
            (
              Math.sin(
                state.clock
                  .elapsedTime *
                  petal.wobble +
                  petal.seed
              ) *
                petal.sway +
              petal.driftX
            ) *
            delta;

          petal.z +=
            petal.driftZ *
            delta;

          if (
            petal.y <
            center[1] +
              0.04
          ) {
            petal.x =
              center[0] +
              randomRange(
                -4.8,
                4.8
              );

            petal.y =
              center[1] +
              randomRange(
                8,
                10.4
              );

            petal.z =
              center[2] +
              randomRange(
                -4.2,
                4.2
              );
          }

          mesh.position.set(
            petal.x,
            petal.y,
            petal.z
          );

          mesh.rotation.x +=
            petal.spinX *
            delta;

          mesh.rotation.y +=
            petal.spinY *
            delta;

          mesh.rotation.z +=
            petal.spinZ *
            delta;
        }
      );
    }
  );

  return (
    <group>
      {petals.map(
        (
          petal,
          index
        ) => (
          <mesh
            key={
              index
            }
            ref={(
              element
            ) => {
              petalRefs.current[
                index
              ] =
                element;
            }}
            position={[
              petal.x,
              petal.y,
              petal.z,
            ]}
            rotation={[
              Math.random() *
                Math.PI,

              Math.random() *
                Math.PI,

              Math.random() *
                Math.PI,
            ]}
            scale={[
              petal.scaleX,
              petal.scaleY,
              1,
            ]}
          >
            <planeGeometry
              args={[
                1,
                1,
              ]}
            />

            <meshBasicMaterial
              map={
                petalTexture ??
                undefined
              }
              alphaMap={
                petalTexture ??
                undefined
              }
              color={
                petal.color
              }
              transparent
              opacity={
                petal.opacity
              }
              alphaTest={
                0.035
              }
              side={
                DoubleSide
              }
              depthWrite={
                false
              }
              toneMapped={
                false
              }
            />
          </mesh>
        )
      )}
    </group>
  );
}

export default function SakuraAtmosphere() {
  const petalTexture =
    useMemo(
      () =>
        createPetalTexture(),
      []
    );

  useEffect(() => {
    return () => {
      petalTexture?.dispose();
    };
  }, [
    petalTexture,
  ]);

  return (
    <group>
      <SceneMoon />

      {/*
        These petals now fall around the actual tree location,
        instead of spawning several units in front of it.
      */}
      <FallingPetals
        center={
          RIGHT_TREE_BASE
        }
        petalTexture={
          petalTexture
        }
      />

      {/*
        Dense petal pile directly beneath and around the tree trunk.
      */}
      <GroundPetals
        center={
          RIGHT_TREE_BASE
        }
        petalTexture={
          petalTexture
        }
        count={
          78
        }
        radiusX={
          1.7
        }
        radiusZ={
          1.4
        }
      />

      {/*
        Lighter outer scatter so the pile fades naturally into the floor.
      */}
      <GroundPetals
        center={
          RIGHT_TREE_BASE
        }
        petalTexture={
          petalTexture
        }
        count={
          42
        }
        radiusX={
          3.35
        }
        radiusZ={
          2.7
        }
      />

      <SakuraTree
        position={
          RIGHT_TREE_BASE
        }
        rotation={[
          0,
          -1.08,
          0,
        ]}
        scale={
          0.43
        }
      />
    </group>
  );
}

useGLTF.preload(
  "/sakura.glb"
);
