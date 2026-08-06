"use client";

import {
  useEffect,
  useMemo,
} from "react";

import {
  type ThreeEvent,
} from "@react-three/fiber";

import {
  useVideoTexture,
} from "@react-three/drei";

import {
  Shape,
  ShapeGeometry,
} from "three";

const ROOFTOP_AD_VIDEO_SRC =
  "/videos/rooftop-ad.mp4";

/*
 * Clicking the rounded rooftop advertisement opens
 * the selected YouTube video in a new browser tab.
 */
const ROOFTOP_AD_YOUTUBE_URL =
  "https://www.youtube.com/watch?v=l08Zw-RY__Q";

/*
 * The selected rooftop-screen position from the debugger was:
 * [0.624, 10.546, -3.747]
 *
 * Its outward-facing normal was approximately:
 * [0, 0, -1]
 *
 * Keep the z value slightly farther outward than the original surface
 * to avoid flickering against the built-in display housing.
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
 * These values fit the rounded display housing already built into
 * the 3D model. Adjust width and height independently if you need
 * a small visual adjustment.
 */
const ROOFTOP_AD_WIDTH =
  3.04;

const ROOFTOP_AD_HEIGHT =
  1.71;

const ROOFTOP_AD_CORNER_RADIUS =
  0.18;

/*
 * Open an advertisement's original YouTube page without replacing
 * the portfolio tab.
 */
function openYoutubeAdvertisement(
  url: string,
) {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer",
  );
}

/*
 * Create a true rounded rectangle geometry and normalize its UV
 * coordinates so the MP4 preview fills the entire screen cleanly
 * without stretching beyond the rounded corners.
 */
function createRoundedVideoGeometry(
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius =
    Math.min(
      radius,
      width / 2,
      height / 2,
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
    bottom,
  );

  shape.lineTo(
    right - safeRadius,
    bottom,
  );

  shape.quadraticCurveTo(
    right,
    bottom,
    right,
    bottom + safeRadius,
  );

  shape.lineTo(
    right,
    top - safeRadius,
  );

  shape.quadraticCurveTo(
    right,
    top,
    right - safeRadius,
    top,
  );

  shape.lineTo(
    left + safeRadius,
    top,
  );

  shape.quadraticCurveTo(
    left,
    top,
    left,
    top - safeRadius,
  );

  shape.lineTo(
    left,
    bottom + safeRadius,
  );

  shape.quadraticCurveTo(
    left,
    bottom,
    left + safeRadius,
    bottom,
  );

  const geometry =
    new ShapeGeometry(
      shape,
      18,
    );

  const positions =
    geometry.getAttribute(
      "position",
    );

  const uvs =
    geometry.getAttribute(
      "uv",
    );

  for (
    let index = 0;
    index < positions.count;
    index += 1
  ) {
    uvs.setXY(
      index,
      (
        positions.getX(index) -
        left
      ) /
        width,
      (
        positions.getY(index) -
        bottom
      ) /
        height,
    );
  }

  uvs.needsUpdate =
    true;

  return geometry;
}

export default function RooftopVideoAdvertisement() {
  const texture =
    useVideoTexture(
      ROOFTOP_AD_VIDEO_SRC,
      {
        muted: true,
        loop: true,
        start: true,
        playsInline: true,
        crossOrigin:
          "anonymous",
      },
    );

  const roundedGeometry =
    useMemo(
      () =>
        createRoundedVideoGeometry(
          ROOFTOP_AD_WIDTH,
          ROOFTOP_AD_HEIGHT,
          ROOFTOP_AD_CORNER_RADIUS,
        ),
      [],
    );

  useEffect(() => {
    return () => {
      roundedGeometry.dispose();
    };
  }, [
    roundedGeometry,
  ]);

  const openRooftopAdvertisement = (
    event: ThreeEvent<MouseEvent>,
  ) => {
    event.stopPropagation();

    openYoutubeAdvertisement(
      ROOFTOP_AD_YOUTUBE_URL,
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