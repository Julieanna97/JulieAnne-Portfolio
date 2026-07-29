"use client";

import {
  MeshReflectorMaterial,
} from "@react-three/drei";
import {
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  CanvasTexture,
  DoubleSide,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
} from "three";

type GradientStop = [
  number,
  string,
];

function drawEllipticalGlow(
  context:
    CanvasRenderingContext2D,
  x:
    number,
  y:
    number,
  radiusX:
    number,
  radiusY:
    number,
  stops:
    GradientStop[]
) {
  context.save();

  context.translate(
    x,
    y
  );

  context.scale(
    radiusX,
    radiusY
  );

  const gradient =
    context.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      1
    );

  stops.forEach(
    ([
      offset,
      color,
    ]) => {
      gradient.addColorStop(
        offset,
        color
      );
    }
  );

  context.fillStyle =
    gradient;

  context.fillRect(
    -1,
    -1,
    2,
    2
  );

  context.restore();
}

function seededRandom(
  index:
    number
) {
  const value =
    Math.sin(
      index *
        9173.31 +
        428.17
    ) *
    43758.5453;

  return (
    value -
    Math.floor(value)
  );
}

function createBakedFloorTexture() {
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
    1024;

  canvas.height =
    1024;

  const context =
    canvas.getContext(
      "2d"
    );

  if (!context) {
    return null;
  }

  const width =
    canvas.width;

  const height =
    canvas.height;

  /* ---------------------------------------------------------------------- */
  /* Base baked gradient                                                    */
  /* ---------------------------------------------------------------------- */

  const base =
    context.createLinearGradient(
      0,
      height,
      width,
      0
    );

  base.addColorStop(
    0,
    "#4d153f"
  );

  base.addColorStop(
    0.23,
    "#67315f"
  );

  base.addColorStop(
    0.48,
    "#4b3a62"
  );

  base.addColorStop(
    0.72,
    "#28516a"
  );

  base.addColorStop(
    1,
    "#133d4e"
  );

  context.fillStyle =
    base;

  context.fillRect(
    0,
    0,
    width,
    height
  );

  /*
    Darken the back of the floor while keeping the front softly lit.
  */
  const depthShade =
    context.createLinearGradient(
      0,
      0,
      0,
      height
    );

  depthShade.addColorStop(
    0,
    "rgba(5, 5, 18, 0.76)"
  );

  depthShade.addColorStop(
    0.38,
    "rgba(15, 8, 29, 0.24)"
  );

  depthShade.addColorStop(
    0.76,
    "rgba(56, 34, 69, 0.03)"
  );

  depthShade.addColorStop(
    1,
    "rgba(255, 194, 227, 0.08)"
  );

  context.fillStyle =
    depthShade;

  context.fillRect(
    0,
    0,
    width,
    height
  );

  /* ---------------------------------------------------------------------- */
  /* Wide colored illumination                                              */
  /* ---------------------------------------------------------------------- */

  drawEllipticalGlow(
    context,
    width * 0.16,
    height * 0.68,
    width * 0.47,
    height * 0.64,
    [
      [
        0,
        "rgba(255, 75, 198, 0.38)",
      ],
      [
        0.36,
        "rgba(220, 69, 228, 0.21)",
      ],
      [
        0.72,
        "rgba(143, 59, 190, 0.07)",
      ],
      [
        1,
        "rgba(0, 0, 0, 0)",
      ],
    ]
  );

  drawEllipticalGlow(
    context,
    width * 0.84,
    height * 0.53,
    width * 0.46,
    height * 0.62,
    [
      [
        0,
        "rgba(54, 220, 255, 0.3)",
      ],
      [
        0.4,
        "rgba(48, 165, 226, 0.16)",
      ],
      [
        0.76,
        "rgba(41, 102, 157, 0.05)",
      ],
      [
        1,
        "rgba(0, 0, 0, 0)",
      ],
    ]
  );

  /*
    Soft neutral light beneath the building.
  */
  drawEllipticalGlow(
    context,
    width * 0.5,
    height * 0.45,
    width * 0.32,
    height * 0.24,
    [
      [
        0,
        "rgba(238, 211, 222, 0.25)",
      ],
      [
        0.46,
        "rgba(174, 137, 181, 0.12)",
      ],
      [
        1,
        "rgba(0, 0, 0, 0)",
      ],
    ]
  );

  /* ---------------------------------------------------------------------- */
  /* Baked contact shadow beneath the city                                  */
  /* ---------------------------------------------------------------------- */

  context.save();

  context.filter =
    "blur(38px)";

  context.beginPath();

  context.ellipse(
    width * 0.5,
    height * 0.4,
    width * 0.2,
    height * 0.12,
    0,
    0,
    Math.PI * 2
  );

  context.fillStyle =
    "rgba(3, 2, 10, 0.5)";

  context.fill();

  context.restore();

  /* ---------------------------------------------------------------------- */
  /* Long soft neon reflection streaks                                      */
  /* ---------------------------------------------------------------------- */

  const reflections = [
    {
      x:
        width * 0.12,
      y:
        height * 0.48,
      width:
        width * 0.055,
      height:
        height * 0.36,
      color:
        "rgba(255, 84, 202, 0.24)",
    },
    {
      x:
        width * 0.23,
      y:
        height * 0.52,
      width:
        width * 0.035,
      height:
        height * 0.27,
      color:
        "rgba(255, 161, 217, 0.18)",
    },
    {
      x:
        width * 0.39,
      y:
        height * 0.44,
      width:
        width * 0.04,
      height:
        height * 0.34,
      color:
        "rgba(165, 98, 255, 0.18)",
    },
    {
      x:
        width * 0.62,
      y:
        height * 0.47,
      width:
        width * 0.05,
      height:
        height * 0.33,
      color:
        "rgba(92, 183, 255, 0.17)",
    },
    {
      x:
        width * 0.78,
      y:
        height * 0.41,
      width:
        width * 0.045,
      height:
        height * 0.39,
      color:
        "rgba(75, 227, 255, 0.21)",
    },
  ];

  context.save();

  context.filter =
    "blur(16px)";

  reflections.forEach(
    (
      reflection
    ) => {
      const gradient =
        context.createLinearGradient(
          0,
          reflection.y,
          0,
          reflection.y +
            reflection.height
        );

      gradient.addColorStop(
        0,
        "rgba(0, 0, 0, 0)"
      );

      gradient.addColorStop(
        0.2,
        reflection.color
      );

      gradient.addColorStop(
        0.72,
        reflection.color
      );

      gradient.addColorStop(
        1,
        "rgba(0, 0, 0, 0)"
      );

      context.fillStyle =
        gradient;

      context.fillRect(
        reflection.x,
        reflection.y,
        reflection.width,
        reflection.height
      );
    }
  );

  context.restore();

  /* ---------------------------------------------------------------------- */
  /* Very subtle baked floor grain                                          */
  /* ---------------------------------------------------------------------- */

  for (
    let index = 0;
    index < 900;
    index += 1
  ) {
    const x =
      seededRandom(
        index * 3
      ) *
      width;

    const y =
      seededRandom(
        index * 3 + 1
      ) *
      height;

    const opacity =
      0.008 +
      seededRandom(
        index * 3 + 2
      ) *
        0.025;

    context.fillStyle =
      `rgba(255, 255, 255, ${opacity})`;

    context.fillRect(
      x,
      y,
      1,
      1
    );
  }

  /*
    Gentle vignette that blends the floor into the dark background.
  */
  const vignette =
    context.createRadialGradient(
      width * 0.5,
      height * 0.5,
      width * 0.18,
      width * 0.5,
      height * 0.5,
      width * 0.73
    );

  vignette.addColorStop(
    0,
    "rgba(0, 0, 0, 0)"
  );

  vignette.addColorStop(
    0.76,
    "rgba(4, 3, 13, 0.08)"
  );

  vignette.addColorStop(
    1,
    "rgba(2, 2, 9, 0.56)"
  );

  context.fillStyle =
    vignette;

  context.fillRect(
    0,
    0,
    width,
    height
  );

  const texture =
    new CanvasTexture(
      canvas
    );

  texture.colorSpace =
    SRGBColorSpace;

  texture.minFilter =
    LinearFilter;

  texture.magFilter =
    LinearFilter;

  texture.needsUpdate =
    true;

  return texture;
}


const FLOOR_SURFACE_Y =
  -0.043;

function createSakuraPetalTexture() {
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

  const context =
    canvas.getContext(
      "2d"
    );

  if (!context) {
    return null;
  }

  context.clearRect(
    0,
    0,
    128,
    128
  );

  context.translate(
    64,
    64
  );

  /*
    Rounded Sakura-petal silhouette.

    The canvas outside this shape remains fully transparent, so the
    individual meshes do not show square cards against the black scene.
  */
  context.beginPath();

  context.moveTo(
    0,
    -29
  );

  context.bezierCurveTo(
    17,
    -28,
    29,
    -12,
    19,
    9
  );

  context.bezierCurveTo(
    13,
    22,
    5,
    30,
    0,
    37
  );

  context.bezierCurveTo(
    -5,
    30,
    -13,
    22,
    -19,
    9
  );

  context.bezierCurveTo(
    -29,
    -12,
    -17,
    -28,
    0,
    -29
  );

  context.closePath();

  const gradient =
    context.createLinearGradient(
      0,
      -30,
      0,
      38
    );

  gradient.addColorStop(
    0,
    "rgba(255, 247, 252, 1)"
  );

  gradient.addColorStop(
    0.42,
    "rgba(255, 195, 226, 1)"
  );

  gradient.addColorStop(
    1,
    "rgba(255, 112, 186, 1)"
  );

  context.fillStyle =
    gradient;

  context.shadowColor =
    "rgba(255, 93, 181, 0.34)";

  context.shadowBlur =
    8;

  context.fill();

  context.shadowBlur =
    0;

  context.beginPath();

  context.moveTo(
    0,
    -18
  );

  context.lineTo(
    0,
    20
  );

  context.strokeStyle =
    "rgba(255, 255, 255, 0.26)";

  context.lineWidth =
    2;

  context.stroke();

  const texture =
    new CanvasTexture(
      canvas
    );

  texture.colorSpace =
    SRGBColorSpace;

  texture.minFilter =
    LinearFilter;

  texture.magFilter =
    LinearFilter;

  texture.needsUpdate =
    true;

  return texture;
}

type FloorPetal = {
  x: number;
  y: number;
  z: number;
  speed: number;
  sway: number;
  wobble: number;
  driftX: number;
  driftZ: number;
  spinX: number;
  spinY: number;
  spinZ: number;
  scaleX: number;
  scaleY: number;
  seed: number;
};

function FloorFallingSakuraPetals({
  compact,
}: {
  compact: boolean;
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

  const petalTexture =
    useMemo(
      () =>
        createSakuraPetalTexture(),
      []
    );

  const petalGeometry =
    useMemo(
      () =>
        new PlaneGeometry(
          1,
          1
        ),
      []
    );

  const petalMaterial =
    useMemo(() => {
      if (
        !petalTexture
      ) {
        return null;
      }

      return new MeshBasicMaterial(
        {
          map:
            petalTexture,

          alphaMap:
            petalTexture,

          color:
            "#ffd0e6",

          transparent:
            true,

          opacity:
            0.82,

          alphaTest:
            0.055,

          side:
            DoubleSide,

          depthTest:
            true,

          depthWrite:
            false,

          toneMapped:
            false,
        }
      );
    }, [
      petalTexture,
    ]);

  const petalCount =
    compact
      ? 26
      : 80;

  const petals =
    useMemo<FloorPetal[]>(
      () =>
        Array.from(
          {
            length:
              petalCount,
          },
          (
            _,
            index
          ) => ({
            x:
              -24 +
              seededRandom(
                index *
                  13 +
                  1
              ) *
                48,

            y:
              1.2 +
              seededRandom(
                index *
                  13 +
                  2
              ) *
                14.8,

            z:
              -24 +
              seededRandom(
                index *
                  13 +
                  3
              ) *
                47,

            speed:
              0.34 +
              seededRandom(
                index *
                  13 +
                  4
              ) *
                0.54,

            sway:
              0.24 +
              seededRandom(
                index *
                  13 +
                  5
              ) *
                0.5,

            wobble:
              0.55 +
              seededRandom(
                index *
                  13 +
                  6
              ) *
                1.15,

            driftX:
              -0.13 +
              seededRandom(
                index *
                  13 +
                  7
              ) *
                0.18,

            driftZ:
              -0.055 +
              seededRandom(
                index *
                  13 +
                  8
              ) *
                0.11,

            spinX:
              -1.15 +
              seededRandom(
                index *
                  13 +
                  9
              ) *
                2.3,

            spinY:
              -0.9 +
              seededRandom(
                index *
                  13 +
                  10
              ) *
                1.8,

            spinZ:
              -1.45 +
              seededRandom(
                index *
                  13 +
                  11
              ) *
                2.9,

            scaleX:
              0.1 +
              seededRandom(
                index *
                  13 +
                  12
              ) *
                0.08,

            scaleY:
              0.15 +
              seededRandom(
                index *
                  13 +
                  13
              ) *
                0.11,

            seed:
              seededRandom(
                index *
                  13 +
                  14
              ) *
              1000,
          })),
      [
        petalCount,
      ]
    );

  useEffect(() => {
    return () => {
      petalGeometry.dispose();
      petalMaterial?.dispose();
      petalTexture?.dispose();
    };
  }, [
    petalGeometry,
    petalMaterial,
    petalTexture,
  ]);

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

          /*
            Recycle the petal just before it can pass beneath the
            reflective concrete surface.
          */
          if (
            petal.y <=
            FLOOR_SURFACE_Y +
              0.025
          ) {
            petal.x =
              -24 +
              Math.random() *
                48;

            petal.y =
              12 +
              Math.random() *
                5;

            petal.z =
              -24 +
              Math.random() *
                47;
          }

          if (
            petal.x <
            -28
          ) {
            petal.x =
              26;
          }

          if (
            petal.x >
            28
          ) {
            petal.x =
              -26;
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

  if (
    !petalMaterial
  ) {
    return null;
  }

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
            geometry={
              petalGeometry
            }
            material={
              petalMaterial
            }
            position={[
              petal.x,
              petal.y,
              petal.z,
            ]}
            rotation={[
              seededRandom(
                index *
                  5 +
                  1
              ) *
                Math.PI,

              seededRandom(
                index *
                  5 +
                  2
              ) *
                Math.PI,

              seededRandom(
                index *
                  5 +
                  3
              ) *
                Math.PI,
            ]}
            scale={[
              petal.scaleX,
              petal.scaleY,
              1,
            ]}
            frustumCulled={
              false
            }
            renderOrder={
              20
            }
          />
        )
      )}
    </group>
  );
}

export default function ConcreteRooftopGround() {
  const viewportWidth =
    useThree(
      (
        state
      ) =>
        state.size.width
    );

  const compact =
    viewportWidth < 768;

  const bakedFloorTexture =
    useMemo(
      () =>
        createBakedFloorTexture(),
      []
    );

  useEffect(() => {
    return () => {
      bakedFloorTexture?.dispose();
    };
  }, [
    bakedFloorTexture,
  ]);

  const reflectorBlur: [
    number,
    number,
  ] =
    compact
      ? [
          180,
          55,
        ]
      : [
          420,
          120,
        ];

  if (!bakedFloorTexture) {
    return null;
  }

  return (
    <>
      {/*
        Baked-looking base layer.

        meshBasicMaterial prevents point lights from creating the
        round glowing balls that appeared on the previous floor.
      */}
      <mesh
        position={[
          0,
          -0.06,
          0,
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <planeGeometry
          args={[
            120,
            90,
          ]}
        />

        <meshBasicMaterial
          map={
            bakedFloorTexture
          }
          toneMapped={
            false
          }
        />
      </mesh>

      {/*
        Separate faint reflection layer, matching the technique used
        by the Ramen Shop reference.

        The opacity is intentionally close to its 0.04 value.
      */}
      <mesh
        position={[
          0,
          -0.052,
          0,
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <planeGeometry
          args={[
            120,
            90,
          ]}
        />

        <MeshReflectorMaterial
          color="#777777"
          transparent
          opacity={
            0.05
          }
          mirror={
            0.12
          }
          resolution={
            compact
              ? 128
              : 256
          }
          blur={
            reflectorBlur
          }
          mixBlur={
            0.92
          }
          mixStrength={
            0.16
          }
          mixContrast={
            1.02
          }
          roughness={
            1
          }
          metalness={
            0
          }
          depthScale={
            0
          }
          reflectorOffset={
            0.006
          }
          depthWrite={
            false
          }
          dithering
        />
      </mesh>

      {/*
        World-space version of the old fullscreen Sakura animation.

        These petals now fall above the actual concrete and recycle before
        passing through it, so they remain part of the 3D scene rather than
        the removed HTML background.
      */}
      <FloorFallingSakuraPetals
        compact={
          compact
        }
      />
    </>
  );
}