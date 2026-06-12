"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  ContactShadows,
  Html,
  OrbitControls,
  Stars,
  Text,
  useVideoTexture,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  SSAO,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type {
  Object3D,
  PerspectiveCamera,
  SpotLight,
} from "three";
import {
  ACESFilmicToneMapping,
  MOUSE,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  TOUCH,
  Vector3,
} from "three";
import gsap from "gsap";
import MysteriousAdventureModel from "../models/MysteriousAdventureModel";

type SectionId =
  | "about"
  | "projects"
  | "credits";

type ProjectId =
  | "sigma-autonomous-car"
  | "podmanager"
  | "practicepal";

type ProjectCaseStudy = {
  id: ProjectId;
  title: string;
  type: string;
  role: string;
  period: string;
  summary: string;
  overview?: string[];
  technologies: string[];
  contributions: string[];
  highlights?: Array<{
    title: string;
    text: string;
  }>;
  images: string[];
  video?: string;
  externalUrl?: string;
  externalLabel?: string;
};

type PortfolioSection = {
  id: SectionId;
  number: string;
  markerNumber?: string;
  title: string;
  eyebrow: string;
  hotspot: [
    number,
    number,
    number,
  ];
  camera: [
    number,
    number,
    number,
  ];
  focus: [
    number,
    number,
    number,
  ];
};

/*
  Keep this enabled while selecting new hotspot coordinates.

  Change it to false when the hotspot setup is finished.
*/
const ENABLE_LIGHT_DEBUGGER =
  true;

/* -------------------------------------------------------------------------- */
/* Camera positions                                                           */
/* -------------------------------------------------------------------------- */

const HOME_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  19.4,
  10.45,
  24.6,
];

const HOME_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  24.8,
  13.8,
  31.4,
];

const HOME_TARGET: [
  number,
  number,
  number,
] = [
  0,
  4.18,
  0,
];

/*
  Initial wide shot shown when the intro starts.
*/
const INTRO_CAMERA: [
  number,
  number,
  number,
] = [
  -25,
  17.5,
  29,
];

const INTRO_TARGET: [
  number,
  number,
  number,
] = [
  0,
  5.2,
  0,
];

/*
  Final intro view.

  The camera moves directly here without an intermediate waypoint.
  It remains here after the intro finishes.
*/
const INTRO_STREET_TARGET: [
  number,
  number,
  number,
] = [
  5,
  1.62,
  1.25,
];

const INTRO_STREET_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  11.75,
  2.72,
  1.25,
];

const INTRO_STREET_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  14.4,
  3.85,
  1.25,
];

/*
  A short direct movement makes the zoom start immediately.

  Increase this slightly for a calmer animation or decrease it for a faster
  transition.
*/
const INTRO_ZOOM_DURATION =
  2;

/* -------------------------------------------------------------------------- */
/* About Me doorway camera                                                    */
/* -------------------------------------------------------------------------- */

const ABOUT_HOTSPOT: [
  number,
  number,
  number,
] = [
  4.545,
  2.672,
  -1.46,
];

const ABOUT_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  8.3,
  2.72,
  -8.4,
];

const ABOUT_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  10.7,
  3.85,
  -9.5,
];

const ABOUT_FOCUS: [
  number,
  number,
  number,
] = [
  4.35,
  1.62,
  -3,
];

/* -------------------------------------------------------------------------- */
/* Projects storefront camera                                                 */
/* -------------------------------------------------------------------------- */

const PROJECTS_HOTSPOT: [
  number,
  number,
  number,
] = [
  -3.221,
  2.232,
  4.528,
];

const PROJECTS_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  -1.45,
  2.72,
  12.65,
];

const PROJECTS_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  -0.65,
  3.85,
  15.7,
];

const PROJECTS_FOCUS: [
  number,
  number,
  number,
] = [
  -3.221,
  1.82,
  4.528,
];

/* -------------------------------------------------------------------------- */
/* Credits rooftop cat camera                                                 */
/* -------------------------------------------------------------------------- */

const CREDITS_HOTSPOT: [
  number,
  number,
  number,
] = [
  -0.408,
  11.768,
  -3.875,
];

const CREDITS_FOCUS: [
  number,
  number,
  number,
] = [
  0.55,
  12.55,
  5.1,
];

const CREDITS_CAMERA_DESKTOP: [
  number,
  number,
  number,
] = [
  0.2,
  13.65,
  6.95,
];

const CREDITS_CAMERA_MOBILE: [
  number,
  number,
  number,
] = [
  1,
  15.1,
  8.95,
];

/* -------------------------------------------------------------------------- */
/* Ground graffiti                                                            */
/* -------------------------------------------------------------------------- */

/*
  The introductory portfolio copy now lives inside the 3D world instead of
  floating in the upper-left corner.

  The group is rotated flat against the concrete rooftop. Adjust the first
  position array if you want to move the graffiti across the ground later.
*/
function GroundGraffiti() {
  const name =
    "JULIE ANNE\nCANTILLEP";

  return (
    <group
      /*
        Place the text on the empty black ground outside the model.

        x: moves it farther away from the building toward the right-side
           black ground near the final intro camera.
        z: keeps it close to the final intro viewing area.
      */
      position={[
        9,
        0.045,
        -2.5,
      ]}
      rotation={[
        -Math.PI / 2,
        0,
        Math.PI / 2,
      ]}
    >
      <Text
        position={[
          0.065,
          -0.055,
          0.004,
        ]}
        fontSize={0.7}
        maxWidth={8}
        lineHeight={0.9}
        letterSpacing={-0.045}
        anchorX="center"
        anchorY="middle"
        color="#ff609f"
        fillOpacity={0.3}
      >
        {name}
      </Text>

      <Text
        position={[
          0,
          0.06,
          0.012,
        ]}
        fontSize={0.7}
        maxWidth={8}
        lineHeight={0.9}
        letterSpacing={-0.045}
        anchorX="center"
        anchorY="middle"
        color="#f7f1ed"
        outlineWidth={0.018}
        outlineColor="#260d18"
        outlineOpacity={0.68}
        fillOpacity={0.9}
      >
        {name}
      </Text>

      <mesh
        position={[
          0,
          -1.02,
          0.008,
        ]}
      >
        <planeGeometry
          args={[
            4.6,
            0.055,
          ]}
        />

        <meshBasicMaterial
          color="#ff79ad"
          transparent
          opacity={0.48}
        />
      </mesh>

      <Text
        position={[
          0,
          -1.26,
          0.012,
        ]}
        fontSize={0.17}
        maxWidth={8}
        lineHeight={1}
        letterSpacing={0.18}
        anchorX="center"
        anchorY="middle"
        color="#f2d7ff"
        fillOpacity={0.82}
      >
        FULLSTACK DEVELOPER
      </Text>

      <Text
        position={[
          0,
          -1.59,
          0.012,
        ]}
        fontSize={0.102}
        maxWidth={7.2}
        lineHeight={1.1}
        letterSpacing={0.1}
        anchorX="center"
        anchorY="middle"
        color="#ffe4bd"
        fillOpacity={0.68}
      >
        CLICK A MARKER · LEFT-DRAG TO MOVE · RIGHT-DRAG TO ROTATE · SCROLL TO
        ZOOM
      </Text>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Front-right street lamp near the orange cones                              */
/* -------------------------------------------------------------------------- */

const STREET_LAMP_BULB_POSITION: [
  number,
  number,
  number,
] = [
  6.58,
  4.586,
  7.331,
];

const STREET_LAMP_SPILL_TARGET_POSITION: [
  number,
  number,
  number,
] = [
  4.55,
  0.08,
  6.94,
];

function TokyoStreetLampGlow() {
  const spillLightRef =
    useRef<SpotLight>(
      null
    );

  const spillTargetRef =
    useRef<Object3D>(
      null
    );

  useEffect(() => {
    if (
      !spillLightRef.current ||
      !spillTargetRef.current
    ) {
      return;
    }

    spillLightRef.current.target =
      spillTargetRef.current;

    spillLightRef.current.target.updateMatrixWorld();
  }, []);

  return (
    <>
      <object3D
        ref={
          spillTargetRef
        }
        position={
          STREET_LAMP_SPILL_TARGET_POSITION
        }
      />

      <group
        position={
          STREET_LAMP_BULB_POSITION
        }
      >
        <mesh
          position={[
            0,
            0.18,
            -0.03,
          ]}
        >
          <cylinderGeometry
            args={[
              0.014,
              0.014,
              0.24,
              10,
            ]}
          />

          <meshStandardMaterial
            color="#252a31"
            metalness={
              0.82
            }
            roughness={
              0.32
            }
          />
        </mesh>

        <mesh
          position={[
            0,
            0.035,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.17,
              0.22,
              0.17,
            ]}
          />

          <meshStandardMaterial
            color="#231912"
            metalness={
              0.28
            }
            roughness={
              0.72
            }
            emissive="#2a170a"
            emissiveIntensity={
              0.18
            }
          />
        </mesh>

        <mesh
          position={[
            0,
            0.02,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.105,
              0.145,
              0.105,
            ]}
          />

          <meshStandardMaterial
            color="#ffd9a2"
            emissive="#ffbd6d"
            emissiveIntensity={
              1.55
            }
            transparent
            opacity={
              0.92
            }
            toneMapped={
              false
            }
          />
        </mesh>

        <pointLight
          name="frontStreetLampBulb"
          position={[
            0,
            0.02,
            0,
          ]}
          intensity={
            4
          }
          distance={
            7
          }
          decay={
            2
          }
          color="#ffcc88"
        />
      </group>

      <spotLight
        name="frontStreetLampSpill"
        ref={
          spillLightRef
        }
        position={
          STREET_LAMP_BULB_POSITION
        }
        angle={
          1.45
        }
        penumbra={
          1
        }
        intensity={
          6
        }
        distance={
          15
        }
        decay={
          1.8
        }
        color="#ffb86a"
      />

      <pointLight
        name="frontStreetLampLeftGroundFill"
        position={[
          3.8,
          0.18,
          7.1,
        ]}
        intensity={
          2.5
        }
        distance={
          10
        }
        decay={
          1.9
        }
        color="#ffb05a"
      />

      <pointLight
        name="frontStreetLampCenterGroundFill"
        position={[
          5.72,
          0.18,
          7.08,
        ]}
        intensity={
          2
        }
        distance={
          8
        }
        decay={
          1.9
        }
        color="#ffc878"
      />

      <pointLight
        name="frontStreetLampRightGroundFill"
        position={[
          7.4,
          0.18,
          7.2,
        ]}
        intensity={
          1.5
        }
        distance={
          7
        }
        decay={
          2
        }
        color="#ffd090"
      />

      <pointLight
        name="frontStreetLampWideGroundFill"
        position={[
          5.5,
          0.08,
          8.5,
        ]}
        intensity={
          2.5
        }
        distance={
          10
        }
        decay={
          1.8
        }
        color="#ffa840"
      />

      <pointLight
        name="frontStreetLampCanopyBounce"
        position={[
          5.2,
          1.2,
          7,
        ]}
        intensity={
          1.5
        }
        distance={
          6
        }
        decay={
          2
        }
        color="#ffbe6e"
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Train-side street lamp                                                     */
/* -------------------------------------------------------------------------- */

const TRAIN_LAMP_BULB_POSITION: [
  number,
  number,
  number,
] = [
  -3.362,
  4.727,
  -7.83,
];

const TRAIN_LAMP_CENTER_TRACK_TARGET: [
  number,
  number,
  number,
] = [
  0.15,
  0.419,
  -5.15,
];

const TRAIN_LAMP_LEFT_TRACK_TARGET: [
  number,
  number,
  number,
] = [
  -4.823,
  0.419,
  -3.795,
];

const TRAIN_LAMP_RIGHT_TRACK_TARGET: [
  number,
  number,
  number,
] = [
  4.987,
  0.419,
  -6.605,
];

function TrainStreetLampGlow() {
  const leftSpillRef =
    useRef<SpotLight>(
      null
    );

  const centerSpillRef =
    useRef<SpotLight>(
      null
    );

  const rightSpillRef =
    useRef<SpotLight>(
      null
    );

  const leftTargetRef =
    useRef<Object3D>(
      null
    );

  const centerTargetRef =
    useRef<Object3D>(
      null
    );

  const rightTargetRef =
    useRef<Object3D>(
      null
    );

  useEffect(() => {
    if (
      leftSpillRef.current &&
      leftTargetRef.current
    ) {
      leftSpillRef.current.target =
        leftTargetRef.current;

      leftSpillRef.current.target.updateMatrixWorld();
    }

    if (
      centerSpillRef.current &&
      centerTargetRef.current
    ) {
      centerSpillRef.current.target =
        centerTargetRef.current;

      centerSpillRef.current.target.updateMatrixWorld();
    }

    if (
      rightSpillRef.current &&
      rightTargetRef.current
    ) {
      rightSpillRef.current.target =
        rightTargetRef.current;

      rightSpillRef.current.target.updateMatrixWorld();
    }
  }, []);

  return (
    <>
      <object3D
        ref={
          leftTargetRef
        }
        position={
          TRAIN_LAMP_LEFT_TRACK_TARGET
        }
      />

      <object3D
        ref={
          centerTargetRef
        }
        position={
          TRAIN_LAMP_CENTER_TRACK_TARGET
        }
      />

      <object3D
        ref={
          rightTargetRef
        }
        position={
          TRAIN_LAMP_RIGHT_TRACK_TARGET
        }
      />

      <pointLight
        name="trainStreetLampBulb"
        position={
          TRAIN_LAMP_BULB_POSITION
        }
        intensity={
          3.1
        }
        distance={
          6.5
        }
        decay={
          2.1
        }
        color="#f4c48d"
      />

      <spotLight
        name="trainStreetLampLeftSoftSpill"
        ref={
          leftSpillRef
        }
        position={
          TRAIN_LAMP_BULB_POSITION
        }
        angle={
          1.52
        }
        penumbra={
          1
        }
        intensity={
          13
        }
        distance={
          31
        }
        decay={
          1.58
        }
        color="#ea9958"
      />

      <spotLight
        name="trainStreetLampCenterSoftSpill"
        ref={
          centerSpillRef
        }
        position={
          TRAIN_LAMP_BULB_POSITION
        }
        angle={
          1.56
        }
        penumbra={
          1
        }
        intensity={
          17
        }
        distance={
          35
        }
        decay={
          1.52
        }
        color="#f0a260"
      />

      <spotLight
        name="trainStreetLampRightSoftSpill"
        ref={
          rightSpillRef
        }
        position={
          TRAIN_LAMP_BULB_POSITION
        }
        angle={
          1.54
        }
        penumbra={
          1
        }
        intensity={
          12.5
        }
        distance={
          35
        }
        decay={
          1.58
        }
        color="#f2af70"
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Rear-alley pink reflections                                                */
/* -------------------------------------------------------------------------- */

function BackAlleyPinkGlow() {
  return (
    <>
      <pointLight
        name="backAlleyUpperPinkFill"
        position={[
          1.8,
          5.2,
          -1.8,
        ]}
        intensity={
          22
        }
        distance={
          12
        }
        decay={
          1.5
        }
        color="#ff6eb4"
      />

      <pointLight
        name="backAlleyMiddlePinkFill"
        position={[
          2.4,
          3.2,
          -2.6,
        ]}
        intensity={
          18
        }
        distance={
          11
        }
        decay={
          1.55
        }
        color="#ff82b8"
      />

      <pointLight
        name="backAlleyLowerPinkFill"
        position={[
          2,
          0.6,
          -2.2,
        ]}
        intensity={
          14
        }
        distance={
          10
        }
        decay={
          1.6
        }
        color="#ff90c0"
      />

      <pointLight
        name="backAlleyHighPinkFill"
        position={[
          1.6,
          7.8,
          -1.4,
        ]}
        intensity={
          12
        }
        distance={
          10
        }
        decay={
          1.65
        }
        color="#ff78be"
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Rounded rooftop video advertisement                                        */
/* -------------------------------------------------------------------------- */

/*
  IMPORTANT:

  This rounded rooftop advertisement is rendered as a real Three.js mesh,
  just like the square wall advertisement below. It is not rendered as an
  <Html> element.

  A DOM video or iframe can visually float above nearby 3D geometry because it
  does not participate in the WebGL depth buffer pixel-by-pixel. Mapping the
  MP4 onto a real mesh allows signs, electrical wires, building edges, and
  other 3D objects to naturally cover the correct portions of the video.

  Add your licensed preview MP4 here:
  public/videos/rooftop-ad.mp4
*/
const ROOFTOP_AD_VIDEO_SRC =
  "/videos/rooftop-ad.mp4";

/*
  Clicking the rounded rooftop advertisement opens the original YouTube page
  in a new browser tab.
*/
const ROOFTOP_AD_YOUTUBE_URL =
  "https://www.youtube.com/watch?v=RrKOH8h_3_g";

/*
  The selected rooftop-screen position from the debugger was:
  [0.624, 10.546, -3.747]

  Its outward-facing normal was approximately:
  [0, 0, -1]

  Keep the z value slightly farther outward than the original surface to avoid
  flickering against the built-in display housing.
*/
const ROOFTOP_AD_POSITION: [
  number,
  number,
  number,
] = [
  0.624,
  10.546,
  -3.79,
];

/*
  These values fit the rounded display housing already built into the 3D
  model. Adjust width and height independently if you need a tiny visual tweak.
*/
const ROOFTOP_AD_WIDTH =
  3.04;

const ROOFTOP_AD_HEIGHT =
  1.71;

const ROOFTOP_AD_CORNER_RADIUS =
  0.18;

/*
  Open an advertisement's original YouTube page without replacing the
  portfolio tab.
*/
function openYoutubeAdvertisement(
  url:
    string
) {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}

/*
  Create a true rounded rectangle geometry and normalize its UV coordinates so
  the MP4 preview fills the entire screen cleanly without stretching beyond the
  rounded corners.
*/
function createRoundedVideoGeometry(
  width:
    number,

  height:
    number,

  radius:
    number
) {
  const safeRadius =
    Math.min(
      radius,
      width / 2,
      height / 2
    );

  const left =
    -width / 2;

  const right =
    width / 2;

  const bottom =
    -height / 2;

  const top =
    height / 2;

  const shape =
    new Shape();

  shape.moveTo(
    left + safeRadius,
    bottom
  );

  shape.lineTo(
    right - safeRadius,
    bottom
  );

  shape.quadraticCurveTo(
    right,
    bottom,
    right,
    bottom + safeRadius
  );

  shape.lineTo(
    right,
    top - safeRadius
  );

  shape.quadraticCurveTo(
    right,
    top,
    right - safeRadius,
    top
  );

  shape.lineTo(
    left + safeRadius,
    top
  );

  shape.quadraticCurveTo(
    left,
    top,
    left,
    top - safeRadius
  );

  shape.lineTo(
    left,
    bottom + safeRadius
  );

  shape.quadraticCurveTo(
    left,
    bottom,
    left + safeRadius,
    bottom
  );

  const geometry =
    new ShapeGeometry(
      shape,
      18
    );

  const positions =
    geometry.getAttribute(
      "position"
    );

  const uvs =
    geometry.getAttribute(
      "uv"
    );

  for (
    let index = 0;
    index < positions.count;
    index += 1
  ) {
    uvs.setXY(
      index,
      (positions.getX(
        index
      ) - left) /
        width,
      (positions.getY(
        index
      ) - bottom) /
        height
    );
  }

  uvs.needsUpdate =
    true;

  return geometry;
}

function RooftopVideoAdvertisement() {
  const texture =
    useVideoTexture(
      ROOFTOP_AD_VIDEO_SRC,
      {
        muted:
          true,

        loop:
          true,

        start:
          true,

        playsInline:
          true,

        crossOrigin:
          "anonymous",
      }
    );

  const roundedGeometry =
    useMemo(
      () =>
        createRoundedVideoGeometry(
          ROOFTOP_AD_WIDTH,
          ROOFTOP_AD_HEIGHT,
          ROOFTOP_AD_CORNER_RADIUS
        ),
      []
    );

  useEffect(() => {
    return () => {
      roundedGeometry.dispose();
    };
  }, [
    roundedGeometry,
  ]);

  const openRooftopAdvertisement = (
    event:
      ThreeEvent<MouseEvent>
  ) => {
    event.stopPropagation();

    openYoutubeAdvertisement(
      ROOFTOP_AD_YOUTUBE_URL
    );
  };

  return (
    <group
      position={
        ROOFTOP_AD_POSITION
      }
      rotation={[
        0,
        Math.PI,
        0,
      ]}
    >
      <mesh
        geometry={
          roundedGeometry
        }
        position={[
          0.16,
          0.2,
          0.012,
        ]}
        onClick={
          openRooftopAdvertisement
        }
        onPointerOver={() => {
          document.body.style.cursor =
            "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor =
            "";
        }}
      >
        <meshBasicMaterial
          map={
            texture
          }
          toneMapped={
            false
          }
          depthTest
          depthWrite
          polygonOffset
          polygonOffsetFactor={
            -1
          }
          polygonOffsetUnits={
            -1
          }
        />
      </mesh>

      <pointLight
        name="rooftopAdvertisementGlow"
        position={[
          0,
          -0.12,
          0.9,
        ]}
        intensity={
          0.9
        }
        distance={
          4.5
        }
        decay={
          2
        }
        color="#8fdcff"
      />
    </group>
  );
}


/* -------------------------------------------------------------------------- */
/* Square building-wall video advertisement                                   */
/* -------------------------------------------------------------------------- */

/*
  IMPORTANT:

  The wall advertisement is intentionally rendered as a real Three.js mesh,
  not as a YouTube iframe inside <Html>.

  A DOM iframe cannot participate in the WebGL depth buffer pixel-by-pixel.
  Mapping a normal MP4 file onto a plane allows the building, electrical wires,
  signs, and other 3D geometry to cover the correct portions of the video.

  Add your licensed MP4 file here:
  public/videos/wall-ad.mp4
*/
const WALL_AD_VIDEO_SRC =
  "/videos/wall-ad.mp4";

/*
  Clicking the real Three.js MP4 wall advertisement opens its matching
  YouTube page in a new browser tab.
*/
const WALL_AD_YOUTUBE_URL =
  "https://www.youtube.com/watch?v=Pd0pjNZ2b6Y";

/*
  Selected wall position:
  [0.452, 7.398, -3.643]

  Wall normal:
  [0, 0, -1]

  Keep the z value slightly farther outward than the original wall to avoid
  flickering against the building surface.
*/
const WALL_AD_POSITION: [
  number,
  number,
  number,
] = [
  0.452,
  7.428,
  -3.686,
];

/*
  Adjust these two values independently when fitting the video to the wall.

  Increase WALL_AD_WIDTH to make it wider without making it taller.
  Decrease WALL_AD_HEIGHT to make it shorter without shrinking its width.
*/
const WALL_AD_WIDTH =
  2.86;

const WALL_AD_HEIGHT =
  1.44;

function SquareWallVideoAdvertisement() {
  const texture =
    useVideoTexture(
      WALL_AD_VIDEO_SRC,
      {
        muted:
          true,

        loop:
          true,

        start:
          true,

        playsInline:
          true,

        crossOrigin:
          "anonymous",
      }
    );

  /*
    useVideoTexture already starts this muted looping video because start is
    true. Do not call video.play() and video.pause() again inside an effect.

    In React development mode, effects can mount and clean up quickly. Calling
    pause() while an earlier play() promise is still resolving can trigger:
    AbortError: The play() request was interrupted by a call to pause().
  */

  const openWallAdvertisement = (
    event:
      ThreeEvent<MouseEvent>
  ) => {
    event.stopPropagation();

    openYoutubeAdvertisement(
      WALL_AD_YOUTUBE_URL
    );
  };

  return (
    <mesh
      position={
        WALL_AD_POSITION
      }
      rotation={[
        0,
        Math.PI,
        0,
      ]}
      onClick={
        openWallAdvertisement
      }
      onPointerOver={() => {
        document.body.style.cursor =
          "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor =
          "";
      }}
    >
      <planeGeometry
        args={[
          WALL_AD_WIDTH,
          WALL_AD_HEIGHT,
        ]}
      />

      <meshBasicMaterial
        map={
          texture
        }
        toneMapped={
          false
        }
        depthTest
        depthWrite
        polygonOffset
        polygonOffsetFactor={
          -1
        }
        polygonOffsetUnits={
          -1
        }
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* Portfolio content                                                          */
/* -------------------------------------------------------------------------- */

const PROJECT_CASE_STUDIES: Record<
  ProjectId,
  ProjectCaseStudy
> = {
  "sigma-autonomous-car": {
    id:
      "sigma-autonomous-car",

    title:
      "Sigma Autonomous Car",

    type:
      "Embedded / Robotics Project",

    role:
      "Embedded Software Developer Intern",

    period:
      "September 2023 – October 2023",

    summary:
      "A hands-on autonomous RC-car project where I worked through the full build process — from planning the electrical schematic and assembling the hardware to programming the car, testing its behavior, and refining how it responded to different situations.",

    overview: [
      "I worked on the project from the electrical schematic to the physical assembly, wiring, programming, testing, and debugging.",
      "The project helped me understand how electrical design, hardware components, sensors, and software logic work together to create an autonomous system.",
    ],

    technologies: [
      "Embedded Systems",
      "C++",
      "Python",
      "Arduino",
      "Electronics",
      "Sensors",
      "Hardware Assembly",
      "System Testing",
    ],

    contributions: [
      "Planned and followed the electrical schematic needed to connect the car's components correctly.",
      "Assembled the physical car hardware, including the wiring, sensors, and electronic components.",
      "Programmed the car's logic so it could respond to its environment and operate autonomously.",
      "Tested, debugged, and refined the system to improve how the car behaved in different situations.",
    ],

    highlights: [
      {
        title:
          "What I worked on",

        text:
          "Electrical schematic planning, physical assembly, wiring, programming, testing, and debugging.",
      },
      {
        title:
          "Skills used",

        text:
          "Circuit planning, hardware assembly, embedded programming, sensor integration, debugging, and system testing.",
      },
      {
        title:
          "What I learned",

        text:
          "How electrical design, hardware components, and software logic work together in an autonomous system.",
      },
    ],

    images: [
      "/projects/sigma-autonomous-car/cover.jpg",
      "/projects/sigma-autonomous-car/image-1.jpg",
      "/projects/sigma-autonomous-car/image-2.jpg",
      "/projects/sigma-autonomous-car/image-3.jpg",
    ],

    video:
      "/projects/sigma-autonomous-car/demo.mp4",
  },

  podmanager: {
    id:
      "podmanager",

    title:
      "PodManager.ai",

    type:
      "Production Internship · Fullstack Development",

    role:
      "Fullstack Developer Intern",

    period:
      "September 2025 – April 2026",

    summary:
      "I worked as a fullstack intern on PodManager.ai, an AI-powered podcast platform. My work focused on media-editing features, publishing controls, and improving an existing production codebase.",

    overview: [
      "PodManager.ai gave me experience working in a real product environment with an existing codebase, team conventions, code reviews, and production requirements.",
      "Instead of building isolated demo features, I contributed to parts of the platform used for podcast editing and publishing. This helped me understand how frontend, backend, and product decisions connect in a fullstack application.",
    ],

    technologies: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Python",
      "AI Workflows",
      "Production Codebase",
      "Code Reviews",
      "Fullstack Development",
    ],

    contributions: [
      "Implemented waveform visualization to make podcast audio easier to navigate and edit.",
      "Worked on the video-track strip to support a clearer visual editing experience.",
      "Added support for sound effects and music so users could enhance podcast episodes during editing.",
      "Built publish-page toggles for optional intro, outro, and watermark settings before export.",
      "Refactored existing components to improve readability, structure, and maintainability.",
      "Worked inside a real production codebase with team conventions, reviews, and active product requirements.",
    ],

    highlights: [
      {
        title:
          "Main focus",

        text:
          "Podcast editing: audio waveform, video track strip, music, sound effects, and publish controls.",
      },
      {
        title:
          "Impact",

        text:
          "Helped make editing and publishing podcast episodes more flexible and easier to navigate.",
      },
    ],

    images: [
      "/projects/podmanager/cover.png",
      "/projects/podmanager/image-1.png",
      "/projects/podmanager/image-2.png",
    ],

    externalUrl:
      "https://www.podmanager.ai/",

    externalLabel:
      "Visit PodManager.ai ↗",
  },

  practicepal: {
    id:
      "practicepal",

    title:
      "PracticePal",

    type:
      "Fullstack Web Application · Degree Project",

    role:
      "Creator & Fullstack Developer",

    period:
      "Degree Project",

    summary:
      "A music-practice tracking platform designed to help musicians plan sessions, stay consistent, and review their progress. The application includes authentication, practice planning, statistics, and a subscription flow.",

    overview: [
      "PracticePal was built as my degree project. It combines account management, planning tools, progress tracking, and a Pro subscription flow in one fullstack application.",
    ],

    technologies: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "NextAuth",
      "Stripe",
      "Recharts",
    ],

    contributions: [
      "Built authentication with credentials and social-login options.",
      "Created practice-session tracking, planning, and progress-statistics features.",
      "Integrated Stripe subscriptions and webhook handling for the Pro plan.",
      "Used MongoDB for account, practice-session, and subscription data.",
    ],

    images:
      [],
  },
};
const SECTIONS: PortfolioSection[] = [
  {
    id:
      "about",

    number:
      "01",

    markerNumber:
      "1",

    title:
      "About Me",

    eyebrow:
      "Fullstack · Embedded · Software Developer",

    hotspot:
      ABOUT_HOTSPOT,

    camera:
      ABOUT_CAMERA_DESKTOP,

    focus:
      ABOUT_FOCUS,
  },

  {
    id:
      "projects",

    number:
      "02",

    markerNumber:
      "2",

    title:
      "Projects",

    eyebrow:
      "Selected development work",

    hotspot:
      PROJECTS_HOTSPOT,

    camera:
      PROJECTS_CAMERA_DESKTOP,

    focus:
      PROJECTS_FOCUS,
  },

  {
    id:
      "credits",

    number:
      "03",

    markerNumber:
      "3",

    title:
      "Credits",

    eyebrow:
      "Attribution and tools",

    hotspot:
      CREDITS_HOTSPOT,

    camera:
      CREDITS_CAMERA_DESKTOP,

    focus:
      CREDITS_FOCUS,
  },
];

/* -------------------------------------------------------------------------- */
/* Background                                                                 */
/* -------------------------------------------------------------------------- */

function NightBackdrop() {
  return (
    <div
      className="adventure-backdrop adventure-backdrop--original"
      aria-hidden="true"
    >
      <span className="adventure-original-glow original-glow-left" />
      <span className="adventure-original-glow original-glow-right" />
      <span className="adventure-original-glow original-glow-bottom" />

      <FullscreenNightStars />

      <span className="adventure-original-vignette" />
    </div>
  );
}

function ConcreteRooftopGround() {
  return (
    <>
      <mesh
        position={[
          0,
          -0.055,
          0,
        ]}
        rotation={[
          -Math.PI /
            2,
          0,
          0,
        ]}
        receiveShadow
      >
        <planeGeometry
          args={[
            90,
            90,
          ]}
        />

        <meshStandardMaterial
          color="#030305"
          roughness={
            0.96
          }
          metalness={
            0.02
          }
        />
      </mesh>

      <ContactShadows
        position={[
          0,
          -0.025,
          0,
        ]}
        opacity={
          0.24
        }
        scale={
          38
        }
        blur={
          4
        }
        far={
          9
        }
        color="#000000"
      />
    </>
  );
}

function FullscreenNightStars() {
  const stars =
    useMemo(
      () =>
        Array.from(
          {
            length:
              14,
          },

          (
            _,
            index
          ) => ({
            id:
              index,

            left:
              `${
                (
                  index *
                    37 +
                  13
                ) %
                100
              }%`,

            top:
              `${
                (
                  index *
                    53 +
                  9
                ) %
                95
              }%`,

            size:
              4 +
              (index *
                11) %
                10,

            delay:
              `-${
                (
                  index *
                  0.43
                ) %
                5.8
              }s`,

            duration:
              `${
                2.8 +
                ((index *
                  7) %
                  22) /
                  10
              }s`,
          })
        ),
      []
    );

  return (
    <div className="adventure-stars">
      {stars.map(
        (
          star
        ) => (
          <span
            key={
              star.id
            }
            className="adventure-star"
            style={{
              left:
                star.left,

              top:
                star.top,

              width:
                `${star.size}px`,

              height:
                `${star.size}px`,

              animationDelay:
                star.delay,

              animationDuration:
                star.duration,
            }}
          />
        )
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Annotation content                                                         */
/* -------------------------------------------------------------------------- */

const ABOUT_EXPERIENCE = [
  {
    role:
      "Fullstack Developer",

    company:
      "PodManager.ai",

    period:
      "Sep 2025 — Apr 2026",

    summary:
      "Worked on an AI-powered platform for podcast and audio editing.",

    points: [
      "Built audio and video editing features in the browser using React and TypeScript.",
      "Worked on waveform and video-timeline UI so editing felt smoother.",
      "Helped with APIs for projects, clips, and editing effects.",
    ],
  },
  {
    role:
      "Quality Assurance Analyst",

    company:
      "OneForma.com",

    period:
      "May 2026 — Ongoing",

    summary:
      "Freelance QA work for AI and data-related projects.",

    points: [
      "Reviewed multilingual data and checked that it followed project guidelines.",
      "Focused on making the final results accurate, clear, and natural.",
    ],
  },
  {
    role:
      "AI Data Specialist",

    company:
      "Appen.com",

    period:
      "Jan 2026 — Ongoing",

    summary:
      "Worked on AI training and evaluation tasks.",

    points: [
      "Worked with text, audio, and multilingual data.",
      "Reviewed transcriptions, labels, and content quality for AI projects.",
    ],
  },
  {
    role:
      "AI Trainer (Coder)",

    company:
      "Outlier",

    period:
      "Sep 2024 — Jun 2025",

    summary:
      "Worked on coding-related AI training tasks.",

    points: [
      "Reviewed and improved coding responses for AI models.",
      "Checked code quality, explanations, and problem-solving steps.",
    ],
  },
  {
    role:
      "Embedded Software Developer Intern",

    company:
      "Nodehill AB",

    period:
      "Jan 2024 — Apr 2024",

    summary:
      "Worked with embedded systems and wireless communication.",

    points: [
      "Built LoRa communication between two ESP32 microcontrollers.",
      "Worked on a long-range wireless-communication setup.",
    ],
  },
  {
    role:
      "Embedded Software Developer Intern",

    company:
      "Sigma Industry Evolution",

    period:
      "Sep 2023 — Oct 2023",

    summary:
      "Worked on an embedded project in an engineering environment.",

    points: [
      "Built a self-driving RC car using Arduino and sensors.",
      "Worked with C/C++ and Python for the car's control logic.",
    ],
  },
];

const ABOUT_SKILL_GROUPS = [
  {
    title:
      "Languages",

    items: [
      "JavaScript",
      "TypeScript",
      "Python",
      "C/C++",
      "HTML",
      "CSS",
    ],
  },
  {
    title:
      "Frontend",

    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  {
    title:
      "Backend",

    items: [
      "Node.js",
      "Express",
      "FastAPI",
      "Flask",
      "REST APIs",
      "ffmpeg",
      "Mailchimp",
    ],
  },
  {
    title:
      "Databases",

    items: [
      "SQL",
      "MongoDB",
      "phpMyAdmin",
      "NoSQL",
    ],
  },
  {
    title:
      "Tools & Platforms",

    items: [
      "Git",
      "Jira",
      "VS Code",
      "Docker",
      "Azure",
      "WordPress",
      "Linux / Ubuntu",
    ],
  },
  {
    title:
      "Design",

    items: [
      "Figma",
      "Canva",
      "Web / Graphic Design",
    ],
  },
  {
    title:
      "Embedded & Other",

    items: [
      "RTOS / Zephyr",
      "Yocto",
      "UART / SPI / I2C / CAN",
      "GTest",
      "CMake",
    ],
  },
  {
    title:
      "Soft Skills",

    items: [
      "Problem Solving",
      "Team Communication",
    ],
  },
];

const CREDIT_GROUPS = [
  {
    title:
      "Frontend",

    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
    ],
  },
  {
    title:
      "3D stack",

    items: [
      "Three.js",
      "React Three Fiber",
      "Drei",
      "GLB models",
    ],
  },
  {
    title:
      "Motion",

    items: [
      "GSAP",
      "Camera zooms",
      "Scene transitions",
      "Lottie animation",
    ],
  },
  {
    title:
      "Visual direction",

    items: [
      "Cozy Tokyo-night atmosphere",
      "Soft color stories",
      "Playful interactions",
      "Small environmental details",
    ],
  },
  {
    title:
      "Behind the scenes",

    items: [
      "UI iteration",
      "Accessibility pass",
      "Responsive layouts",
      "Performance polish",
    ],
  },
];

function AnnotationContent({
  id,
  onProjectSelect,
  onOpenSectionDetail,
}: {
  id:
    SectionId;

  onProjectSelect: (
    id:
      ProjectId
  ) => void;

  onOpenSectionDetail: (
    id:
      "about" | "credits"
  ) => void;
}) {
  if (
    id ===
    "about"
  ) {
    return (
      <>
        <p>
          Hi, I&apos;m Julie Anne — a software developer working across
          fullstack, embedded, and AI-related projects.
        </p>

        <p>
          I enjoy building useful, easy-to-use experiences and adding small
          design details that make an application feel more personal.
        </p>

        <p>
          React · Next.js · TypeScript · Node.js · Python · FastAPI · C/C++
        </p>

        <button
          type="button"
          className="adventure-detail-button"
          onClick={(
            event
          ) => {
            event.stopPropagation();

            onOpenSectionDetail(
              "about"
            );
          }}
        >
          View full profile →
        </button>
      </>
    );
  }

  if (
    id ===
    "projects"
  ) {
    return (
      <>
        {(
          Object.values(
            PROJECT_CASE_STUDIES
          ) as ProjectCaseStudy[]
        ).map(
          (
            project
          ) => (
            <button
              key={
                project.id
              }
              type="button"
              className="adventure-project-card-button"
              onClick={(
                event
              ) => {
                event.stopPropagation();

                onProjectSelect(
                  project.id
                );
              }}
            >
              <strong>
                {
                  project.title
                }
              </strong>

              <span>
                {
                  project.technologies
                    .slice(
                      0,
                      5
                    )
                    .join(
                      " · "
                    )
                }
              </span>

              <em>
                Open case study →
              </em>
            </button>
          )
        )}
      </>
    );
  }

  return (
    <>
      <p>
        Portfolio concept and implementation by Julie Anne Cantillep.
      </p>

      <p>
        Built with Next.js, TypeScript, React Three Fiber, Drei, Three.js,
        GSAP, and a custom responsive 3D interface.
      </p>

      <button
        type="button"
        className="adventure-detail-button"
        onClick={(
          event
        ) => {
          event.stopPropagation();

          onOpenSectionDetail(
            "credits"
          );
        }}
      >
        View full credits →
      </button>
    </>
  );
}

function SectionDetailModal({
  detailId,
  onClose,
}: {
  detailId:
    | "about"
    | "credits"
    | null;

  onClose:
    () => void;
}) {
  if (
    !detailId
  ) {
    return null;
  }

  const isAbout =
    detailId ===
    "about";

  return (
    <div
      className="adventure-section-detail-backdrop"
      role="presentation"
      onClick={
        onClose
      }
    >
      <article
        className="adventure-section-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label={
          isAbout
            ? "About Julie Anne"
            : "Portfolio credits"
        }
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="adventure-case-study-close"
          onClick={
            onClose
          }
          aria-label={
            isAbout
              ? "Close about profile"
              : "Close credits"
          }
        >
          ×
        </button>

        {isAbout ? (
          <>
            <header className="adventure-section-detail-header">
              <p>
                About Me
              </p>

              <h2>
                Hi, I&apos;m Julie Anne ✨
              </h2>

              <strong>
                Software Developer · Fullstack · Embedded · AI
              </strong>

              <p className="adventure-section-detail-intro">
                I&apos;m a software developer who enjoys building things that
                are useful, easy to use, and nice to look at. I&apos;ve worked
                with fullstack apps, embedded systems, and AI-related projects,
                and I like mixing clean code with small design details that make
                an app feel more personal.
              </p>
            </header>

            <section className="adventure-detail-grid adventure-detail-grid--three">
              <div className="adventure-detail-card">
                <h3>
                  Frontend
                </h3>

                <p>
                  I build interfaces with React, Next.js, TypeScript, and
                  Tailwind. I like making pages feel clean, smooth, and easy to
                  use.
                </p>
              </div>

              <div className="adventure-detail-card">
                <h3>
                  Backend
                </h3>

                <p>
                  I work with Node.js, Express, FastAPI, and Flask. I enjoy
                  building APIs, connecting databases, and organizing the
                  logic behind the scenes.
                </p>
              </div>

              <div className="adventure-detail-card">
                <h3>
                  Creative & Embedded
                </h3>

                <p>
                  I also enjoy 3D web, animation, and embedded projects with
                  C/C++ and Python. I like combining technical work with playful
                  visual details.
                </p>
              </div>
            </section>

            <section className="adventure-section-block">
              <h3>
                Work Experience
              </h3>

              <div className="adventure-experience-list">
                {ABOUT_EXPERIENCE.map(
                  (
                    experience
                  ) => (
                    <article
                      key={`${experience.company}-${experience.period}`}
                      className="adventure-experience-card"
                    >
                      <div>
                        <h4>
                          {
                            experience.role
                          }
                        </h4>

                        <strong>
                          {
                            experience.company
                          }
                        </strong>
                      </div>

                      <time>
                        {
                          experience.period
                        }
                      </time>

                      <p>
                        {
                          experience.summary
                        }
                      </p>

                      <ul>
                        {experience.points.map(
                          (
                            point
                          ) => (
                            <li
                              key={
                                point
                              }
                            >
                              {
                                point
                              }
                            </li>
                          )
                        )}
                      </ul>
                    </article>
                  )
                )}
              </div>
            </section>

            <section className="adventure-section-block">
              <h3>
                Skills
              </h3>

              <div className="adventure-skill-grid">
                {ABOUT_SKILL_GROUPS.map(
                  (
                    group
                  ) => (
                    <article
                      key={
                        group.title
                      }
                      className="adventure-skill-card"
                    >
                      <h4>
                        {
                          group.title
                        }
                      </h4>

                      <div className="adventure-case-study-tags">
                        {group.items.map(
                          (
                            item
                          ) => (
                            <span
                              key={
                                item
                              }
                            >
                              {
                                item
                              }
                            </span>
                          )
                        )}
                      </div>
                    </article>
                  )
                )}
              </div>
            </section>

            <section className="adventure-section-block">
              <h3>
                Education
              </h3>

              <div className="adventure-detail-grid">
                <article className="adventure-detail-card">
                  <p className="adventure-detail-kicker">
                    2026
                  </p>

                  <h4>
                    Fullstack Developer
                  </h4>

                  <strong>
                    The Media Institute
                  </strong>

                  <ul>
                    <li>
                      Frontend, backend, databases, and system development.
                    </li>
                    <li>
                      Projects built with agile methods.
                    </li>
                    <li>
                      E-commerce platforms and fullstack application structure.
                    </li>
                  </ul>
                </article>

                <article className="adventure-detail-card">
                  <p className="adventure-detail-kicker">
                    2024
                  </p>

                  <h4>
                    Embedded Software Development
                  </h4>

                  <strong>
                    Movant University of Applied Science
                  </strong>

                  <ul>
                    <li>
                      Embedded programming, hardware communication, and
                      real-time systems.
                    </li>
                    <li>
                      Led a group project where we built an autonomous car.
                    </li>
                  </ul>
                </article>
              </div>
            </section>

            <section className="adventure-section-block">
              <h3>
                Let&apos;s Connect
              </h3>

              <div className="adventure-contact-grid">
                <a href="mailto:kisamae1997@gmail.com">
                  kisamae1997@gmail.com
                </a>

                <a
                  href="https://www.linkedin.com/in/julie-anne-cantillep-4ba4ab250/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn ↗
                </a>

                <a
                  href="https://github.com/Julieanna97"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
              </div>

              <p className="adventure-detail-location">
                Malmö, Sweden
              </p>
            </section>
          </>
        ) : (
          <>
            <header className="adventure-section-detail-header">
              <p>
                Credits
              </p>

              <h2>
                Built with care ♡
              </h2>

              <p className="adventure-section-detail-intro">
                Portfolio concept and implementation by Julie Anne Cantillep.
                This interactive scene combines 3D development, animation,
                responsive UI work, and small environmental details.
              </p>
            </header>

            <section className="adventure-section-block">
              <h3>
                Scene attribution
              </h3>

              <article className="adventure-detail-card">
                <h4>
                  A Mysterious Adventure - 3D Editor Challenge
                </h4>

                <p>
                  3D scene by Diosmel, used under the Creative Commons
                  Attribution 4.0 license.
                </p>
              </article>
            </section>

            <section className="adventure-section-block">
              <h3>
                Tools, technology & visual direction
              </h3>

              <div className="adventure-skill-grid">
                {CREDIT_GROUPS.map(
                  (
                    group
                  ) => (
                    <article
                      key={
                        group.title
                      }
                      className="adventure-skill-card"
                    >
                      <h4>
                        {
                          group.title
                        }
                      </h4>

                      <ul>
                        {group.items.map(
                          (
                            item
                          ) => (
                            <li
                              key={
                                item
                              }
                            >
                              {
                                item
                              }
                            </li>
                          )
                        )}
                      </ul>
                    </article>
                  )
                )}
              </div>
            </section>

            <section className="adventure-section-block">
              <h3>
                What shaped this portfolio
              </h3>

              <div className="adventure-detail-grid adventure-detail-grid--three">
                <article className="adventure-detail-card">
                  <h4>
                    Cozy spaces
                  </h4>

                  <p>
                    A small environment that feels lived-in rather than a
                    standard portfolio landing page.
                  </p>
                </article>

                <article className="adventure-detail-card">
                  <h4>
                    Soft color stories
                  </h4>

                  <p>
                    Warm lights, pink reflections, dark city tones, and playful
                    accents throughout the interface.
                  </p>
                </article>

                <article className="adventure-detail-card">
                  <h4>
                    Playful interactions
                  </h4>

                  <p>
                    Camera movement, scene markers, animated advertisements,
                    sound, and small responsive details.
                  </p>
                </article>
              </div>
            </section>
          </>
        )}
      </article>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Project modal                                                              */
/* -------------------------------------------------------------------------- */

function ProjectCaseStudyModal({
  projectId,
  onClose,
}: {
  projectId:
    | ProjectId
    | null;

  onClose:
    () => void;
}) {
  const [
    activeImageIndex,
    setActiveImageIndex,
  ] =
    useState(
      0
    );

  useEffect(() => {
    setActiveImageIndex(
      0
    );
  }, [
    projectId,
  ]);

  if (
    !projectId
  ) {
    return null;
  }

  const project =
    PROJECT_CASE_STUDIES[
      projectId
    ];

  const activeImage =
    project.images[
      activeImageIndex
    ];

  return (
    <div
      className="adventure-case-study-backdrop"
      role="presentation"
      onClick={
        onClose
      }
    >
      <article
        className="adventure-case-study-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} case study`}
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="adventure-case-study-close"
          onClick={
            onClose
          }
          aria-label="Close case study"
        >
          ×
        </button>

        <header className="adventure-case-study-header">
          <p>
            {
              project.type
            }
          </p>

          <h2>
            {
              project.title
            }
          </h2>

          <div className="adventure-case-study-meta">
            <span>
              <b>
                Role
              </b>

              {
                project.role
              }
            </span>

            <span>
              <b>
                Period
              </b>

              {
                project.period
              }
            </span>
          </div>
        </header>

        <div className="adventure-case-study-grid">
          <section className="adventure-case-study-gallery">
            {activeImage ? (
              <img
                src={
                  activeImage
                }
                alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                className="adventure-case-study-main-image"
              />
            ) : (
              <div className="adventure-case-study-empty-gallery">
                <strong>
                  Screenshots coming soon
                </strong>

                <p>
                  Add PracticePal screenshots inside{" "}
                  <code>
                    public/projects/practicepal
                  </code>{" "}
                  when they are ready.
                </p>
              </div>
            )}

            {project.images.length >
              1 && (
              <div className="adventure-case-study-thumbnails">
                {project.images.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      key={
                        image
                      }
                      type="button"
                      className={
                        activeImageIndex ===
                        index
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setActiveImageIndex(
                          index
                        )
                      }
                      aria-label={`Show screenshot ${index + 1}`}
                    >
                      <img
                        src={
                          image
                        }
                        alt=""
                      />
                    </button>
                  )
                )}
              </div>
            )}

            {project.video && (
              <video
                className="adventure-case-study-video"
                controls
                preload="metadata"
                poster={
                  project.images[
                    0
                  ]
                }
              >
                <source
                  src={
                    project.video
                  }
                  type="video/mp4"
                />

                Your browser does not support the video tag.
              </video>
            )}
          </section>

          <section className="adventure-case-study-content">
            <p className="adventure-case-study-summary">
              {
                project.summary
              }
            </p>

            {project.externalUrl && (
              <a
                className="adventure-project-external-link"
                href={
                  project.externalUrl
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {
                  project.externalLabel ??
                  "Open live site ↗"
                }
              </a>
            )}

            {project.overview && (
              <div>
                <h3>
                  Overview
                </h3>

                <div className="adventure-case-study-overview">
                  {project.overview.map(
                    (
                      paragraph
                    ) => (
                      <p
                        key={
                          paragraph
                        }
                      >
                        {
                          paragraph
                        }
                      </p>
                    )
                  )}
                </div>
              </div>
            )}

            {project.highlights && (
              <div>
                <h3>
                  Highlights
                </h3>

                <div className="adventure-project-highlight-list">
                  {project.highlights.map(
                    (
                      highlight
                    ) => (
                      <article
                        key={
                          highlight.title
                        }
                      >
                        <h4>
                          {
                            highlight.title
                          }
                        </h4>

                        <p>
                          {
                            highlight.text
                          }
                        </p>
                      </article>
                    )
                  )}
                </div>
              </div>
            )}

            <div>
              <h3>
                What I worked on
              </h3>

              <ul>
                {project.contributions.map(
                  (
                    contribution
                  ) => (
                    <li
                      key={
                        contribution
                      }
                    >
                      {
                        contribution
                      }
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3>
                Technologies
              </h3>

              <div className="adventure-case-study-tags">
                {project.technologies.map(
                  (
                    technology
                  ) => (
                    <span
                      key={
                        technology
                      }
                    >
                      {
                        technology
                      }
                    </span>
                  )
                )}
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Number hotspots                                                            */
/* -------------------------------------------------------------------------- */

function AnnotationCard({
  section,
  mobile =
    false,
  onClose,
  onProjectSelect,
  onOpenSectionDetail,
}: {
  section:
    PortfolioSection;

  mobile?:
    boolean;

  onClose:
    () => void;

  onProjectSelect: (
    id:
      ProjectId
  ) => void;

  onOpenSectionDetail: (
    id:
      "about" | "credits"
  ) => void;
}) {
  return (
    <section
      className={`adventure-annotation-card ${
        mobile
          ? "adventure-annotation-card--mobile"
          : ""
      }`}
      role={
        mobile
          ? "dialog"
          : undefined
      }
      aria-modal={
        mobile
          ? true
          : undefined
      }
      aria-label={
        mobile
          ? section.title
          : undefined
      }
      onClick={(
        event
      ) => {
        event.stopPropagation();
      }}
    >
      <button
        type="button"
        className="adventure-annotation-close"
        onClick={(
          event
        ) => {
          event.stopPropagation();

          onClose();
        }}
        aria-label={`Close ${section.title}`}
      >
        ×
      </button>

      <p className="adventure-annotation-card-number">
        {
          section.number
        }
      </p>

      <h2>
        {
          section.title
        }
      </h2>

      <p className="adventure-annotation-card-eyebrow">
        {
          section.eyebrow
        }
      </p>

      <div
        className={`adventure-annotation-card-copy is-${section.id}`}
      >
        <AnnotationContent
          id={
            section.id
          }
          onProjectSelect={
            onProjectSelect
          }
          onOpenSectionDetail={
            onOpenSectionDetail
          }
        />
      </div>
    </section>
  );
}

function NumberHotspot({
  section,
  disabled,
  selected,
  showCard,
  onSelect,
  onClose,
  onProjectSelect,
  onOpenSectionDetail,
}: {
  section:
    PortfolioSection;

  disabled:
    boolean;

  selected:
    boolean;

  showCard:
    boolean;

  onSelect: (
    section:
      PortfolioSection
  ) => void;

  onClose:
    () => void;

  onProjectSelect: (
    id:
      ProjectId
  ) => void;

  onOpenSectionDetail: (
    id:
      "about" | "credits"
  ) => void;
}) {
  return (
    <Html
      position={
        section.hotspot
      }
      center
      zIndexRange={[
        40,
        0,
      ]}
      style={{
        pointerEvents:
          "auto",
      }}
    >
      <div
        className={`adventure-annotation-wrap ${
          selected
            ? "is-open"
            : ""
        }`}
      >
        <button
          type="button"
          className={`adventure-number ${
            selected
              ? "is-selected"
              : ""
          }`}
          disabled={
            disabled
          }
          onClick={(
            event
          ) => {
            event.stopPropagation();

            onSelect(
              section
            );
          }}
          aria-label={`Open ${section.title}`}
        >
          <span className="adventure-number-ripple" />

          <span className="adventure-number-ripple ripple-two" />

          <span className="adventure-number-core">
            {
              section.markerNumber ??
              section.number
            }
          </span>
        </button>

        {selected &&
          showCard && (
            <AnnotationCard
              section={
                section
              }
              onClose={
                onClose
              }
              onProjectSelect={
                onProjectSelect
              }
              onOpenSectionDetail={
                onOpenSectionDetail
              }
            />
          )}
      </div>
    </Html>
  );
}

/* -------------------------------------------------------------------------- */
/* 3D scene                                                                   */
/* -------------------------------------------------------------------------- */

function AdventureSceneContent({
  viewportWidth,
  activeId,
  onActiveChange,
  onProjectSelect,
  onOpenSectionDetail,
  onSceneReady,
}: {
  viewportWidth:
    number;

  activeId:
    | SectionId
    | null;

  onActiveChange: (
    id:
      | SectionId
      | null
  ) => void;

  onProjectSelect: (
    id:
      ProjectId
  ) => void;

  onOpenSectionDetail: (
    id:
      "about" | "credits"
  ) => void;

  onSceneReady?:
    () => void;
}) {
  const {
    camera,
    scene,
  } =
    useThree();

  const controlsRef =
    useRef<any>(
      null
    );

  const readyRef =
    useRef(
      false
    );

  const introTimelineRef =
    useRef<
      | gsap.core.Timeline
      | null
    >(
      null
    );

  const [
    moving,
    setMoving,
  ] =
    useState(
      false
    );

  const [
    debugClickPoint,
    setDebugClickPoint,
  ] =
    useState<
      | [
          number,
          number,
          number,
        ]
      | null
    >(
      null
    );

  const compact =
    viewportWidth <
    768;

  const homeCamera =
    compact
      ? HOME_CAMERA_MOBILE
      : HOME_CAMERA_DESKTOP;

  const handleLightDebugClick = (
    event:
      ThreeEvent<MouseEvent>
  ) => {
    if (
      !ENABLE_LIGHT_DEBUGGER
    ) {
      return;
    }

    event.stopPropagation();

    const {
      x,
      y,
      z,
    } =
      event.point;

    const clickedPosition: [
      number,
      number,
      number,
    ] = [
      Number(
        x.toFixed(
          3
        )
      ),

      Number(
        y.toFixed(
          3
        )
      ),

      Number(
        z.toFixed(
          3
        )
      ),
    ];

    const worldNormal =
      event.face?.normal?.clone();

    if (
      worldNormal
    ) {
      worldNormal.transformDirection(
        event.object.matrixWorld
      );
    }

    setDebugClickPoint(
      clickedPosition
    );

    console.group(
      "%cLIGHT POSITION DEBUG",
      "color: #ff70c8; font-weight: 800;"
    );

    console.log(
      "Clicked mesh:",
      event.object.name ||
        "(unnamed mesh)"
    );

    console.log(
      "World position:",
      clickedPosition
    );

    if (
      worldNormal
    ) {
      console.log(
        "World normal:",
        [
          Number(
            worldNormal.x.toFixed(
              3
            )
          ),

          Number(
            worldNormal.y.toFixed(
              3
            )
          ),

          Number(
            worldNormal.z.toFixed(
              3
            )
          ),
        ]
      );
    }

    const nearbyLights: Array<{
      name:
        string;

      type:
        string;

      color:
        string;

      intensity:
        | number
        | string;

      range:
        | number
        | string;

      distanceFromClick:
        number;

      worldPosition:
        string;
    }> =
      [];

    scene.traverse(
      (
        object
      ) => {
        const possibleLight =
          object as typeof object & {
            isLight?:
              boolean;

            color?: {
              getHexString?: () => string;
            };

            intensity?:
              number;

            distance?:
              number;
          };

        if (
          !possibleLight.isLight
        ) {
          return;
        }

        const lightPosition =
          new Vector3();

        possibleLight.getWorldPosition(
          lightPosition
        );

        nearbyLights.push(
          {
            name:
              possibleLight.name ||
              "(unnamed light)",

            type:
              possibleLight.type,

            color:
              possibleLight.color
                ?.getHexString
                ? `#${possibleLight.color.getHexString()}`
                : "(no color)",

            intensity:
              typeof possibleLight.intensity ===
              "number"
                ? Number(
                    possibleLight.intensity.toFixed(
                      3
                    )
                  )
                : "(not available)",

            range:
              typeof possibleLight.distance ===
              "number"
                ? Number(
                    possibleLight.distance.toFixed(
                      3
                    )
                  )
                : "(not available)",

            distanceFromClick:
              Number(
                lightPosition
                  .distanceTo(
                    event.point
                  )
                  .toFixed(
                    3
                  )
              ),

            worldPosition:
              `[${lightPosition.x.toFixed(
                3
              )}, ${lightPosition.y.toFixed(
                3
              )}, ${lightPosition.z.toFixed(
                3
              )}]`,
          }
        );
      }
    );

    nearbyLights.sort(
      (
        first,
        second
      ) =>
        first.distanceFromClick -
        second.distanceFromClick
    );

    console.log(
      "Nearby scene lights, closest first:"
    );

    console.table(
      nearbyLights.slice(
        0,
        20
      )
    );

    const clickedObject =
      event.object as typeof event.object & {
        material?:
          any;
      };

    const clickedMaterials =
      Array.isArray(
        clickedObject.material
      )
        ? clickedObject.material
        : [
            clickedObject.material,
          ];

    const materialRows =
      clickedMaterials
        .filter(
          Boolean
        )
        .map(
          (
            material:
              any
          ) => ({
            name:
              material.name ||
              "(unnamed material)",

            type:
              material.type ||
              "(unknown type)",

            color:
              material.color
                ?.getHexString
                ? `#${material.color.getHexString()}`
                : "(no color)",

            emissive:
              material.emissive
                ?.getHexString
                ? `#${material.emissive.getHexString()}`
                : "(no emissive color)",

            emissiveIntensity:
              typeof material.emissiveIntensity ===
              "number"
                ? Number(
                    material.emissiveIntensity.toFixed(
                      3
                    )
                  )
                : "(not available)",

            transparent:
              Boolean(
                material.transparent
              ),

            opacity:
              typeof material.opacity ===
              "number"
                ? Number(
                    material.opacity.toFixed(
                      3
                    )
                  )
                : "(not available)",
          })
        );

    console.log(
      "Clicked material:"
    );

    console.table(
      materialRows
    );

    console.log(
      `Copy position: [${clickedPosition[0]}, ${clickedPosition[1]}, ${clickedPosition[2]}]`
    );

    console.groupEnd();
  };

  const lockCamera =
    useCallback(
      (
        nextCamera: [
          number,
          number,
          number,
        ],

        nextTarget: [
          number,
          number,
          number,
        ]
      ) => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        camera.position.set(
          ...nextCamera
        );

        controls.target.set(
          ...nextTarget
        );

        controls.update();
      },
      [
        camera,
      ]
    );

  const stopCameraTweens =
    useCallback(
      () => {
        introTimelineRef.current?.kill();

        introTimelineRef.current =
          null;

        gsap.killTweensOf(
          camera.position
        );

        if (
          controlsRef.current
        ) {
          gsap.killTweensOf(
            controlsRef.current.target
          );

          controlsRef.current.update();
        }
      },
      [
        camera,
      ]
    );

  useEffect(() => {
    const perspectiveCamera =
      camera as PerspectiveCamera;

    perspectiveCamera.fov =
      compact
        ? 43
        : 36;

    perspectiveCamera.updateProjectionMatrix();
  }, [
    camera,
    compact,
  ]);

  const moveCamera =
    useCallback(
      (
        nextCamera: [
          number,
          number,
          number,
        ],

        nextTarget: [
          number,
          number,
          number,
        ],

        duration =
          1.35
      ) => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        stopCameraTweens();

        setMoving(
          true
        );

        const timeline =
          gsap.timeline(
            {
              onUpdate:
                () => {
                  controls.update();
                },

              onComplete:
                () => {
                  lockCamera(
                    nextCamera,
                    nextTarget
                  );

                  setMoving(
                    false
                  );
                },
            }
          );

        timeline.to(
          camera.position,
          {
            x:
              nextCamera[
                0
              ],

            y:
              nextCamera[
                1
              ],

            z:
              nextCamera[
                2
              ],

            duration,

            ease:
              "power3.inOut",
          },
          0
        );

        timeline.to(
          controls.target,
          {
            x:
              nextTarget[
                0
              ],

            y:
              nextTarget[
                1
              ],

            z:
              nextTarget[
                2
              ],

            duration,

            ease:
              "power3.inOut",
          },
          0
        );
      },
      [
        camera,
        lockCamera,
        stopCameraTweens,
      ]
    );

  /*
    Closing a popup only hides the text card.

    The camera stays exactly where it is.
    There is no zoom-out, rotation, or return to the full-model view.
  */
  const closeAnnotation =
    useCallback(
      () => {
        onActiveChange(
          null
        );
      },
      [
        onActiveChange,
      ]
    );

  /*
    One continuous sideways movement for About Me.
  */
  const moveToAboutDoor =
    useCallback(
      (
        section:
          PortfolioSection
      ) => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        const finalCamera =
          compact
            ? ABOUT_CAMERA_MOBILE
            : section.camera;

        stopCameraTweens();

        setMoving(
          true
        );

        const timeline =
          gsap.timeline(
            {
              onUpdate:
                () => {
                  controls.update();
                },

              onComplete:
                () => {
                  lockCamera(
                    finalCamera,
                    section.focus
                  );

                  setMoving(
                    false
                  );
                },
            }
          );

        timeline.to(
          camera.position,
          {
            x:
              finalCamera[
                0
              ],

            y:
              finalCamera[
                1
              ],

            z:
              finalCamera[
                2
              ],

            duration:
              1.65,

            ease:
              "power3.inOut",
          },
          0
        );

        timeline.to(
          controls.target,
          {
            x:
              section.focus[
                0
              ],

            y:
              section.focus[
                1
              ],

            z:
              section.focus[
                2
              ],

            duration:
              1.65,

            ease:
              "power3.inOut",
          },
          0
        );
      },
      [
        camera,
        compact,
        lockCamera,
        stopCameraTweens,
      ]
    );

  /*
    One continuous low storefront movement for Projects.
  */
  const moveToProjectsStorefront =
    useCallback(
      (
        section:
          PortfolioSection
      ) => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        const finalCamera =
          compact
            ? PROJECTS_CAMERA_MOBILE
            : section.camera;

        stopCameraTweens();

        setMoving(
          true
        );

        const timeline =
          gsap.timeline(
            {
              onUpdate:
                () => {
                  controls.update();
                },

              onComplete:
                () => {
                  lockCamera(
                    finalCamera,
                    section.focus
                  );

                  setMoving(
                    false
                  );
                },
            }
          );

        timeline.to(
          camera.position,
          {
            x:
              finalCamera[
                0
              ],

            y:
              finalCamera[
                1
              ],

            z:
              finalCamera[
                2
              ],

            duration:
              1.55,

            ease:
              "power3.inOut",
          },
          0
        );

        timeline.to(
          controls.target,
          {
            x:
              section.focus[
                0
              ],

            y:
              section.focus[
                1
              ],

            z:
              section.focus[
                2
              ],

            duration:
              1.55,

            ease:
              "power3.inOut",
          },
          0
        );
      },
      [
        camera,
        compact,
        lockCamera,
        stopCameraTweens,
      ]
    );

  /*
    Direct Credits rooftop movement.
  */
  const moveToCreditsRooftop =
    useCallback(
      (
        section:
          PortfolioSection
      ) => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        const finalCamera =
          compact
            ? CREDITS_CAMERA_MOBILE
            : section.camera;

        stopCameraTweens();

        setMoving(
          true
        );

        const timeline =
          gsap.timeline(
            {
              onUpdate:
                () => {
                  controls.update();
                },

              onComplete:
                () => {
                  lockCamera(
                    finalCamera,
                    section.focus
                  );

                  introTimelineRef.current =
                    null;

                  setMoving(
                    false
                  );
                },

              onInterrupt:
                () => {
                  introTimelineRef.current =
                    null;

                  setMoving(
                    false
                  );
                },
            }
          );

        introTimelineRef.current =
          timeline;

        timeline.to(
          camera.position,
          {
            x:
              finalCamera[
                0
              ],

            y:
              finalCamera[
                1
              ],

            z:
              finalCamera[
                2
              ],

            duration:
              1.35,

            ease:
              "power3.inOut",
          },
          0
        );

        timeline.to(
          controls.target,
          {
            x:
              section.focus[
                0
              ],

            y:
              section.focus[
                1
              ],

            z:
              section.focus[
                2
              ],

            duration:
              1.35,

            ease:
              "power3.inOut",
          },
          0
        );
      },
      [
        camera,
        compact,
        lockCamera,
        stopCameraTweens,
      ]
    );

  const selectSection =
    useCallback(
      (
        section:
          PortfolioSection
      ) => {
        if (
          moving
        ) {
          return;
        }

        onActiveChange(
          section.id
        );

        if (
          section.id ===
          "about"
        ) {
          moveToAboutDoor(
            section
          );

          return;
        }

        if (
          section.id ===
          "projects"
        ) {
          moveToProjectsStorefront(
            section
          );

          return;
        }

        if (
          section.id ===
          "credits"
        ) {
          moveToCreditsRooftop(
            section
          );

          return;
        }

        moveCamera(
          section.camera,
          section.focus
        );
      },
      [
        moveCamera,
        moveToAboutDoor,
        moveToProjectsStorefront,
        moveToCreditsRooftop,
        moving,
        onActiveChange,
      ]
    );

  useEffect(() => {
    const handleSelection =
      (
        event:
          Event
      ) => {
        const customEvent =
          event as CustomEvent<{
            id?:
              SectionId;
          }>;

        const requestedId =
          customEvent.detail
            ?.id;

        const section =
          SECTIONS.find(
            (
              item
            ) =>
              item.id ===
              requestedId
          );

        if (
          section
        ) {
          selectSection(
            section
          );
        }
      };

    window.addEventListener(
      "adventure:select",
      handleSelection
    );

    return () => {
      window.removeEventListener(
        "adventure:select",
        handleSelection
      );
    };
  }, [
    selectSection,
  ]);

  /*
    First-entry intro animation.

    This is one direct movement:
    - start at the wide view,
    - immediately zoom into the final bicycle-and-road-sign view,
    - remain at the final position.

    There is no midpoint, overlap, pause, or automatic zoom-out.
  */
  useEffect(() => {
    const handleIntro =
      () => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        const closeupCamera =
          compact
            ? INTRO_STREET_CAMERA_MOBILE
            : INTRO_STREET_CAMERA_DESKTOP;

        stopCameraTweens();

        setMoving(
          true
        );

        lockCamera(
          INTRO_CAMERA,
          INTRO_TARGET
        );

        const timeline =
          gsap.timeline(
            {
              onUpdate:
                () => {
                  controls.update();
                },

              onComplete:
                () => {
                  lockCamera(
                    closeupCamera,
                    INTRO_STREET_TARGET
                  );

                  introTimelineRef.current =
                    null;

                  setMoving(
                    false
                  );
                },

              onInterrupt:
                () => {
                  introTimelineRef.current =
                    null;

                  setMoving(
                    false
                  );
                },
            }
          );

        introTimelineRef.current =
          timeline;

        timeline.to(
          camera.position,
          {
            x:
              closeupCamera[
                0
              ],

            y:
              closeupCamera[
                1
              ],

            z:
              closeupCamera[
                2
              ],

            duration:
              INTRO_ZOOM_DURATION,

            ease:
              "power2.out",
          },
          0
        );

        timeline.to(
          controls.target,
          {
            x:
              INTRO_STREET_TARGET[
                0
              ],

            y:
              INTRO_STREET_TARGET[
                1
              ],

            z:
              INTRO_STREET_TARGET[
                2
              ],

            duration:
              INTRO_ZOOM_DURATION,

            ease:
              "power2.out",
          },
          0
        );
      };

    window.addEventListener(
      "adventure:intro",
      handleIntro
    );

    return () => {
      window.removeEventListener(
        "adventure:intro",
        handleIntro
      );

      stopCameraTweens();
    };
  }, [
    camera,
    compact,
    lockCamera,
    stopCameraTweens,
  ]);

  useEffect(() => {
    if (
      !controlsRef.current ||
      readyRef.current
    ) {
      return;
    }

    readyRef.current =
      true;

    lockCamera(
      homeCamera,
      HOME_TARGET
    );

    requestAnimationFrame(
      () => {
        requestAnimationFrame(
          () => {
            onSceneReady?.();
          }
        );
      }
    );
  }, [
    homeCamera,
    lockCamera,
    onSceneReady,
  ]);

  return (
    <>
      <fog
        attach="fog"
        args={[
          "#010106",
          30,
          74,
        ]}
      />

      <ambientLight
        intensity={
          0.12
        }
      />

      <spotLight
        position={[
          9,
          17,
          11,
        ]}
        angle={
          0.52
        }
        penumbra={
          0.86
        }
        intensity={
          4.15
        }
        color="#ffd0b6"
        distance={
          48
        }
        decay={
          1.45
        }
        castShadow
        shadow-mapSize-width={
          1024
        }
        shadow-mapSize-height={
          1024
        }
      />

      <spotLight
        position={[
          -11,
          14,
          -10,
        ]}
        angle={
          0.68
        }
        penumbra={
          0.92
        }
        intensity={
          2.75
        }
        color="#727cff"
        distance={
          52
        }
        decay={
          1.55
        }
      />

      <pointLight
        position={[
          2.5,
          8.2,
          1.7,
        ]}
        intensity={
          1.7
        }
        color="#ff7665"
        distance={
          20
        }
        decay={
          1.5
        }
      />

      <Stars
        radius={
          78
        }
        depth={
          38
        }
        count={
          900
        }
        factor={
          2.35
        }
        saturation={
          0
        }
        fade
        speed={
          0.22
        }
      />

      <ConcreteRooftopGround />

      {/*
        Render the portfolio introduction directly on the rooftop concrete.
      */}
      <GroundGraffiti />

      <group
        onClick={
          handleLightDebugClick
        }
      >
        <MysteriousAdventureModel />
      </group>

      <RooftopVideoAdvertisement />

      <SquareWallVideoAdvertisement />

      {ENABLE_LIGHT_DEBUGGER &&
        debugClickPoint && (
          <mesh
            position={
              debugClickPoint
            }
            renderOrder={
              999
            }
          >
            <sphereGeometry
              args={[
                0.11,
                18,
                18,
              ]}
            />

            <meshBasicMaterial
              color="#00ffff"
              toneMapped={
                false
              }
              depthTest={
                false
              }
              depthWrite={
                false
              }
            />
          </mesh>
        )}

      <TokyoStreetLampGlow />

      <TrainStreetLampGlow />

      <pointLight
        position={[
          10,
          12,
          4,
        ]}
        intensity={
          5
        }
        distance={
          28
        }
        decay={
          1.6
        }
        color="#ffc87a"
      />

      <pointLight
        position={[
          10,
          7,
          5,
        ]}
        intensity={
          6
        }
        distance={
          24
        }
        decay={
          1.65
        }
        color="#ffbe72"
      />

      <pointLight
        position={[
          9,
          3.5,
          6,
        ]}
        intensity={
          7
        }
        distance={
          22
        }
        decay={
          1.6
        }
        color="#ffba68"
      />

      <pointLight
        position={[
          8,
          0.8,
          8,
        ]}
        intensity={
          7
        }
        distance={
          20
        }
        decay={
          1.55
        }
        color="#ffb660"
      />

      <pointLight
        position={[
          7,
          0.5,
          3,
        ]}
        intensity={
          3.4
        }
        distance={
          13
        }
        decay={
          1.85
        }
        color="#ffc070"
      />

      <pointLight
        position={[
          5,
          2.5,
          1,
        ]}
        intensity={
          2.8
        }
        distance={
          12
        }
        decay={
          1.9
        }
        color="#ffbe74"
      />

      <pointLight
        position={[
          9,
          0.1,
          6,
        ]}
        intensity={
          4.2
        }
        distance={
          15
        }
        decay={
          1.8
        }
        color="#ffb258"
      />

      <BackAlleyPinkGlow />

      {SECTIONS.map(
        (
          section
        ) => (
          <NumberHotspot
            key={
              section.id
            }
            section={
              section
            }
            disabled={
              moving
            }
            selected={
              activeId ===
              section.id
            }
            showCard={
              !compact
            }
            onSelect={
              selectSection
            }
            onClose={
              closeAnnotation
            }
            onProjectSelect={
              onProjectSelect
            }
            onOpenSectionDetail={
              onOpenSectionDetail
            }
          />
        )
      )}

      <EffectComposer
        multisampling={
          0
        }
        enableNormalPass
      >
        <SSAO
          blendFunction={
            BlendFunction.MULTIPLY
          }
          samples={
            12
          }
          rings={
            4
          }
          radius={
            0.075
          }
          intensity={
            1.2
          }
          luminanceInfluence={
            0.52
          }
          resolutionScale={
            0.65
          }
        />

        <Bloom
          mipmapBlur
          intensity={
            0.5
          }
          luminanceThreshold={
            0.68
          }
          luminanceSmoothing={
            0.2
          }
        />

        <Vignette
          eskil={
            false
          }
          offset={
            0.18
          }
          darkness={
            0.72
          }
        />
      </EffectComposer>

      <OrbitControls
        ref={
          controlsRef
        }
        makeDefault
        enabled={
          !moving
        }
        enablePan
        screenSpacePanning
        enableZoom
        enableRotate
        mouseButtons={{
          LEFT:
            MOUSE.PAN,

          MIDDLE:
            MOUSE.DOLLY,

          RIGHT:
            MOUSE.ROTATE,
        }}
        minDistance={
          compact
            ? 8.5
            : 7.2
        }
        maxDistance={
          compact
            ? 42
            : 34
        }
        minPolarAngle={
          Math.PI /
          7
        }
        maxPolarAngle={
          Math.PI /
          2.05
        }
        zoomSpeed={
          compact
            ? 0.9
            : 0.5
        }
        rotateSpeed={
          compact
            ? 0.38
            : 0.48
        }
        panSpeed={
          compact
            ? 0.72
            : 0.58
        }
        touches={{
          ONE:
            TOUCH.PAN,

          TWO:
            TOUCH.DOLLY_ROTATE,
        }}
        enableDamping={
          !moving
        }
        dampingFactor={
          0.08
        }
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export type HeroSceneProps = {
  onSceneReady?:
    () => void;
};

export default function HeroScene({
  onSceneReady,
}: HeroSceneProps) {
  const [
    viewportWidth,
    setViewportWidth,
  ] =
    useState(
      () =>
        typeof window ===
        "undefined"
          ? 1440
          : window.innerWidth
    );

  const [
    activeId,
    setActiveId,
  ] =
    useState<
      | SectionId
      | null
    >(
      null
    );

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] =
    useState<
      | ProjectId
      | null
    >(
      null
    );

  const [
    selectedSectionDetail,
    setSelectedSectionDetail,
  ] =
    useState<
      | "about"
      | "credits"
      | null
    >(
      null
    );

  const activeSection =
    SECTIONS.find(
      (
        section
      ) =>
        section.id ===
        activeId
    ) ??
    null;

  useEffect(() => {
    const handleResize =
      () => {
        setViewportWidth(
          window.innerWidth
        );
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  const selectFromBottomNav =
    (
      id:
        SectionId
    ) => {
      window.dispatchEvent(
        new CustomEvent(
          "adventure:select",
          {
            detail: {
              id,
            },
          }
        )
      );
    };

  return (
    <section className="adventure-scene-shell">
      <NightBackdrop />

      <Canvas
        shadows
        dpr={
          viewportWidth <
          768
            ? [
                1,
                1.4,
              ]
            : [
                1,
                1.85,
              ]
        }
        camera={{
          position:
            viewportWidth <
            768
              ? HOME_CAMERA_MOBILE
              : HOME_CAMERA_DESKTOP,

          fov:
            viewportWidth <
            768
              ? 43
              : 36,

          near:
            0.1,

          far:
            300,
        }}
        gl={{
          antialias:
            false,

          alpha:
            true,

          powerPreference:
            "high-performance",
        }}
        onCreated={({
          gl,
        }) => {
          gl.outputColorSpace =
            SRGBColorSpace;

          gl.toneMapping =
            ACESFilmicToneMapping;

          gl.toneMappingExposure =
            0.92;
        }}
        style={{
          touchAction:
            "none",

          position:
            "relative",

          zIndex:
            2,
        }}
      >
        <Suspense
          fallback={
            null
          }
        >
          <AdventureSceneContent
            viewportWidth={
              viewportWidth
            }
            activeId={
              activeId
            }
            onActiveChange={
              setActiveId
            }
            onProjectSelect={
              setSelectedProjectId
            }
            onOpenSectionDetail={
              setSelectedSectionDetail
            }
            onSceneReady={
              onSceneReady
            }
          />
        </Suspense>
      </Canvas>

      {viewportWidth <
        768 &&
        activeSection && (
          <div className="adventure-mobile-annotation-layer">
            <AnnotationCard
              section={
                activeSection
              }
              mobile
              onClose={() => {
                setActiveId(
                  null
                );
              }}
              onProjectSelect={
                setSelectedProjectId
              }
              onOpenSectionDetail={
                setSelectedSectionDetail
              }
            />
          </div>
        )}

      <nav
        className="adventure-bottom-nav"
        aria-label="Portfolio sections"
      >
        {SECTIONS.map(
          (
            section
          ) => (
            <button
              type="button"
              key={
                section.id
              }
              onClick={() =>
                selectFromBottomNav(
                  section.id
                )
              }
              className={
                activeId ===
                section.id
                  ? "is-active"
                  : ""
              }
            >
              <span>
                {
                  section.number
                }
              </span>

              {
                section.title
              }
            </button>
          )
        )}
      </nav>

      <SectionDetailModal
        detailId={
          selectedSectionDetail
        }
        onClose={() => {
          setSelectedSectionDetail(
            null
          );
        }}
      />

      <ProjectCaseStudyModal
        projectId={
          selectedProjectId
        }
        onClose={() => {
          setSelectedProjectId(
            null
          );
        }}
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
          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 999px;
          background: rgba(6, 7, 11, 0.8);
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.28),
            0 0 13px rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.96);
          cursor: pointer;
          transition:
            transform 180ms ease,
            background 180ms ease,
            border-color 180ms ease;
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
          border: 1px solid rgba(255, 255, 255, 0.44);
          border-radius: inherit;
          animation: adventure-annotation-ripple 2.25s ease-out infinite;
        }

        .adventure-number-ripple.ripple-two {
          animation-delay: 1.12s;
        }

        .adventure-number:hover,
        .adventure-number.is-selected {
          transform: scale(1.16);
          border-color: rgba(255, 255, 255, 0.92);
          background: rgba(17, 14, 23, 0.96);
        }

        @keyframes adventure-annotation-ripple {
          0% {
            transform: scale(0.82);
            opacity: 0;
          }

          22% {
            opacity: 0.62;
          }

          100% {
            transform: scale(1.9);
            opacity: 0;
          }
        }

        .adventure-annotation-card {
          position: absolute;
          left: 48px;
          top: -18px;
          width: min(310px, 76vw);
          max-height: min(390px, 70vh);
          min-width: 0;
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior: contain;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 16px;
          background: rgba(6, 7, 12, 0.88);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.42);
          padding: 16px;
          color: #fff;
          backdrop-filter: blur(15px);
          -webkit-overflow-scrolling: touch;
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
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
          color: #fff;
          cursor: pointer;
          font-size: 16px;
        }

        .adventure-annotation-card-number,
        .adventure-annotation-card-eyebrow {
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
          color: rgba(255, 255, 255, 0.78);
          font-size: 12px;
          line-height: 1.58;
        }

        .adventure-annotation-card-copy p {
          margin: 0;
        }

        @keyframes adventure-card-enter {
          from {
            opacity: 0;
            transform: translateX(-8px) translateY(4px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
          }
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
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          background: rgba(10, 9, 16, 0.72);
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(16px);
        }

        .adventure-bottom-nav button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: rgba(255, 255, 255, 0.82);
          cursor: pointer;
          padding: 11px 14px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition:
            background 180ms ease,
            color 180ms ease;
          white-space: nowrap;
        }

        .adventure-bottom-nav button:hover,
        .adventure-bottom-nav button.is-active {
          background: rgba(255, 255, 255, 0.92);
          color: #17121e;
        }

        .adventure-bottom-nav span {
          opacity: 0.72;
        }

        .adventure-project-card-button {
          display: grid;
          width: 100%;
          gap: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.045);
          padding: 10px;
          color: rgba(255, 255, 255, 0.92);
          cursor: pointer;
          text-align: left;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .adventure-project-card-button:hover {
          transform: translateY(-2px);
          border-color: rgba(219, 199, 255, 0.42);
          background: rgba(255, 255, 255, 0.095);
        }

        .adventure-project-card-button strong {
          font-size: 12px;
        }

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
          color: rgba(255, 255, 255, 0.58);
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
        }

        .adventure-case-study-modal {
          position: relative;
          width: min(1080px, 100%);
          max-height: min(900px, calc(100dvh - 44px));
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(13, 15, 28, 0.97),
              rgba(26, 18, 39, 0.95)
            );
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
          color: white;
          padding: 24px;
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
          border: 1px solid rgba(255, 255, 255, 0.17);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: white;
          cursor: pointer;
          font-size: 23px;
        }

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
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.055);
          padding: 7px 10px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 11px;
        }

        .adventure-case-study-meta b {
          color: #dbc7ff;
        }

        .adventure-case-study-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(270px, 0.82fr);
          gap: 22px;
          margin-top: 24px;
        }

        .adventure-case-study-gallery,
        .adventure-case-study-content {
          min-width: 0;
        }

        .adventure-case-study-main-image,
        .adventure-case-study-empty-gallery {
          width: 100%;
          aspect-ratio: 16 / 10;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.05);
          object-fit: contain;
        }

        .adventure-case-study-empty-gallery {
          display: grid;
          place-content: center;
          gap: 6px;
          padding: 24px;
          color: rgba(255, 255, 255, 0.76);
          text-align: center;
        }

        .adventure-case-study-empty-gallery p {
          margin: 0;
          font-size: 12px;
          line-height: 1.6;
        }

        .adventure-case-study-thumbnails {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-top: 9px;
        }

        .adventure-case-study-thumbnails button {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.05);
          padding: 0;
          cursor: pointer;
          opacity: 0.58;
        }

        .adventure-case-study-thumbnails button.is-active,
        .adventure-case-study-thumbnails button:hover {
          opacity: 1;
        }

        .adventure-case-study-thumbnails img {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 10;
          object-fit: cover;
        }

        .adventure-case-study-video {
          width: 100%;
          margin-top: 14px;
          border-radius: 16px;
          background: #05060a;
        }

        .adventure-case-study-content {
          display: grid;
          align-content: start;
          gap: 20px;
          color: rgba(255, 255, 255, 0.76);
          font-size: 13px;
          line-height: 1.68;
        }

        .adventure-case-study-summary {
          margin: 0;
        }

        .adventure-case-study-content h3 {
          margin: 0 0 8px;
          color: white;
          font-size: 15px;
        }

        .adventure-case-study-content ul {
          display: grid;
          gap: 7px;
          margin: 0;
          padding-left: 18px;
        }

        .adventure-case-study-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .adventure-case-study-tags span {
          border: 1px solid rgba(219, 199, 255, 0.19);
          border-radius: 999px;
          background: rgba(219, 199, 255, 0.08);
          padding: 6px 9px;
          color: #dbc7ff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .adventure-detail-button,
        .adventure-project-external-link {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(219, 199, 255, 0.25);
          border-radius: 999px;
          background: rgba(219, 199, 255, 0.1);
          padding: 9px 12px;
          color: #f5edff;
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          line-height: 1.35;
          text-decoration: none;
          text-transform: uppercase;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .adventure-detail-button:hover,
        .adventure-project-external-link:hover {
          transform: translateY(-2px);
          border-color: rgba(219, 199, 255, 0.58);
          background: rgba(219, 199, 255, 0.2);
        }

        .adventure-section-detail-backdrop {
          position: fixed;
          inset: 0;
          z-index: 110;
          display: grid;
          place-items: center;
          overflow-y: auto;
          background: rgba(3, 5, 12, 0.74);
          padding: 22px;
          backdrop-filter: blur(14px);
        }

        .adventure-section-detail-modal {
          position: relative;
          width: min(1120px, 100%);
          max-height: min(920px, calc(100dvh - 44px));
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(13, 15, 28, 0.985),
              rgba(31, 20, 43, 0.975)
            );
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.6);
          color: white;
          padding: 26px;
        }

        .adventure-section-detail-header > p,
        .adventure-detail-kicker {
          margin: 0;
          color: #dbc7ff;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }

        .adventure-section-detail-header h2 {
          margin: 10px 50px 0 0;
          font-size: clamp(2rem, 5vw, 4rem);
          letter-spacing: -0.065em;
          line-height: 0.98;
        }

        .adventure-section-detail-header strong {
          display: block;
          margin-top: 11px;
          color: #f2dcff;
          font-size: 13px;
          letter-spacing: 0.09em;
          line-height: 1.55;
          text-transform: uppercase;
        }

        .adventure-section-detail-intro {
          max-width: 840px;
          margin: 16px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 14px;
          line-height: 1.75;
        }

        .adventure-section-block {
          margin-top: 28px;
        }

        .adventure-section-block > h3 {
          margin: 0 0 12px;
          color: white;
          font-size: 18px;
        }

        .adventure-detail-grid,
        .adventure-skill-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .adventure-detail-grid--three {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 22px;
        }

        .adventure-detail-card,
        .adventure-skill-card,
        .adventure-experience-card,
        .adventure-project-highlight-list article {
          min-width: 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.055);
          padding: 14px;
        }

        .adventure-detail-card h3,
        .adventure-detail-card h4,
        .adventure-skill-card h4,
        .adventure-experience-card h4,
        .adventure-project-highlight-list h4 {
          margin: 0;
          color: white;
          font-size: 14px;
        }

        .adventure-detail-card p,
        .adventure-skill-card p,
        .adventure-project-highlight-list p {
          margin: 7px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          line-height: 1.65;
        }

        .adventure-detail-card strong,
        .adventure-experience-card strong {
          display: block;
          margin-top: 4px;
          color: #dbc7ff;
          font-size: 12px;
        }

        .adventure-detail-card ul,
        .adventure-skill-card ul,
        .adventure-experience-card ul {
          display: grid;
          gap: 5px;
          margin: 10px 0 0;
          padding-left: 17px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          line-height: 1.55;
        }

        .adventure-experience-list {
          display: grid;
          gap: 10px;
        }

        .adventure-experience-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 4px 14px;
        }

        .adventure-experience-card time {
          color: rgba(255, 255, 255, 0.56);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-align: right;
        }

        .adventure-experience-card p {
          grid-column: 1 / -1;
          margin: 8px 0 0;
          color: rgba(255, 255, 255, 0.75);
          font-size: 12px;
          line-height: 1.55;
        }

        .adventure-experience-card ul {
          grid-column: 1 / -1;
        }

        .adventure-skill-card .adventure-case-study-tags {
          margin-top: 10px;
        }

        .adventure-contact-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .adventure-contact-grid a {
          overflow-wrap: anywhere;
          border: 1px solid rgba(219, 199, 255, 0.18);
          border-radius: 13px;
          background: rgba(219, 199, 255, 0.08);
          padding: 11px;
          color: #eee1ff;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
          transition:
            transform 180ms ease,
            background 180ms ease;
        }

        .adventure-contact-grid a:hover {
          transform: translateY(-2px);
          background: rgba(219, 199, 255, 0.17);
        }

        .adventure-detail-location {
          margin: 12px 0 0;
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
        }

        .adventure-case-study-overview {
          display: grid;
          gap: 8px;
        }

        .adventure-case-study-overview p,
        .adventure-project-highlight-list p {
          margin: 0;
        }

        .adventure-project-highlight-list {
          display: grid;
          gap: 8px;
        }

        .adventure-project-highlight-list p {
          margin-top: 5px;
        }

        .adventure-mobile-annotation-layer {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 70;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding:
            14px
            14px
            calc(78px + env(safe-area-inset-bottom));
        }

        .adventure-annotation-card-copy,
        .adventure-annotation-card-eyebrow,
        .adventure-project-card-button,
        .adventure-project-card-button span {
          min-width: 0;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        @media (max-width: 767px) {
          .adventure-section-detail-backdrop {
            padding: 12px;
          }

          .adventure-section-detail-modal {
            max-height: calc(100dvh - 24px);
            border-radius: 18px;
            padding: 17px;
          }

          .adventure-detail-grid,
          .adventure-detail-grid--three,
          .adventure-skill-grid,
          .adventure-contact-grid {
            grid-template-columns: 1fr;
          }

          .adventure-experience-card {
            grid-template-columns: 1fr;
          }

          .adventure-experience-card time {
            text-align: left;
          }

          .adventure-bottom-nav {
            bottom: 13px;
            gap: 3px;
            padding: 5px;
          }

          .adventure-bottom-nav button {
            gap: 4px;
            padding: 9px;
            font-size: 8px;
            letter-spacing: 0.1em;
          }

          .adventure-case-study-backdrop {
            padding: 12px;
          }

          .adventure-case-study-modal {
            max-height: calc(100dvh - 24px);
            border-radius: 18px;
            padding: 17px;
          }

          .adventure-case-study-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .adventure-annotation-card--mobile {
            pointer-events: auto;
            position: relative;
            left: auto;
            top: auto;
            width: min(370px, 100%);
            max-height:
              calc(
                100dvh -
                  112px -
                  env(safe-area-inset-bottom)
              );
            transform: none;
            animation: adventure-card-enter-mobile 220ms ease both;
          }

          @keyframes adventure-card-enter-mobile {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.97);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        }
      `}</style>
    </section>
  );
}