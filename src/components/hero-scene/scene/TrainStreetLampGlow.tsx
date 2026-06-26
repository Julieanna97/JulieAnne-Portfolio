"use client";

import { useEffect, useRef } from "react";
import type { Object3D, SpotLight } from "three";

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

export default function TrainStreetLampGlow() {
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
