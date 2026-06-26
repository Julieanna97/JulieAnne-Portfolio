"use client";

import { type ThreeEvent } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";

function openYoutubeAdvertisement(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

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

export default function SquareWallVideoAdvertisement() {
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
