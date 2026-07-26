"use client";

import { useMemo } from "react";
import {
  Line,
  Text,
  useGLTF,
} from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import {
  DoubleSide,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";

type NavigationSignProps =
  ThreeElements["group"] & {
    message?: string;
  };

type SignFaceProps = {
  side: 1 | -1;
  message: string;
};

const CHALK_COLOR = "#f5f0e7";
const FADED_CHALK_COLOR = "#d6d0c7";

function ChalkArrows() {
  return (
    <group position={[0, 0.225, 0.009]}>
      {/* Left arrow */}
      <Line
        points={[
          [-0.035, 0, 0],
          [-0.17, 0, 0],
        ]}
        color={CHALK_COLOR}
        lineWidth={1.5}
        transparent
        opacity={0.9}
      />

      <Line
        points={[
          [-0.17, 0, 0],
          [-0.125, 0.035, 0],
        ]}
        color={CHALK_COLOR}
        lineWidth={1.5}
        transparent
        opacity={0.9}
      />

      <Line
        points={[
          [-0.17, 0, 0],
          [-0.125, -0.035, 0],
        ]}
        color={CHALK_COLOR}
        lineWidth={1.5}
        transparent
        opacity={0.9}
      />

      {/* Right arrow */}
      <Line
        points={[
          [0.035, 0, 0],
          [0.17, 0, 0],
        ]}
        color={CHALK_COLOR}
        lineWidth={1.5}
        transparent
        opacity={0.9}
      />

      <Line
        points={[
          [0.17, 0, 0],
          [0.125, 0.035, 0],
        ]}
        color={CHALK_COLOR}
        lineWidth={1.5}
        transparent
        opacity={0.9}
      />

      <Line
        points={[
          [0.17, 0, 0],
          [0.125, -0.035, 0],
        ]}
        color={CHALK_COLOR}
        lineWidth={1.5}
        transparent
        opacity={0.9}
      />
    </group>
  );
}

function ChalkMouse() {
  return (
    <group position={[0, 0.075, 0.009]}>
      {/* Mouse cable */}
      <Line
        points={[
          [0, 0.09, 0],
          [-0.015, 0.115, 0],
          [0.012, 0.14, 0],
          [-0.008, 0.17, 0],
          [0.012, 0.195, 0],
        ]}
        color={CHALK_COLOR}
        lineWidth={1.2}
        transparent
        opacity={0.88}
      />

      {/* Mouse outline */}
      <Line
        points={[
          [0, 0.085, 0],
          [-0.038, 0.075, 0],
          [-0.058, 0.045, 0],
          [-0.063, -0.012, 0],
          [-0.052, -0.07, 0],
          [-0.025, -0.105, 0],
          [0.025, -0.105, 0],
          [0.052, -0.07, 0],
          [0.063, -0.012, 0],
          [0.058, 0.045, 0],
          [0.038, 0.075, 0],
          [0, 0.085, 0],
        ]}
        color={CHALK_COLOR}
        lineWidth={1.45}
        transparent
        opacity={0.94}
      />

      {/* Mouse button divider */}
      <Line
        points={[
          [0, 0.08, 0],
          [0, 0.015, 0],
        ]}
        color={CHALK_COLOR}
        lineWidth={1.1}
        transparent
        opacity={0.9}
      />

      {/* Mouse wheel */}
      <Line
        points={[
          [0, 0.055, 0],
          [0, 0.035, 0],
        ]}
        color={CHALK_COLOR}
        lineWidth={2}
        transparent
        opacity={0.95}
      />

      {/* Small imperfect chalk marks */}
      <Line
        points={[
          [-0.07, -0.015, 0],
          [-0.077, -0.04, 0],
        ]}
        color={FADED_CHALK_COLOR}
        lineWidth={0.8}
        transparent
        opacity={0.38}
      />

      <Line
        points={[
          [0.072, 0.025, 0],
          [0.079, 0.002, 0],
        ]}
        color={FADED_CHALK_COLOR}
        lineWidth={0.8}
        transparent
        opacity={0.34}
      />
    </group>
  );
}

function ChalkTextureMarks() {
  return (
    <group position={[0, 0, 0.007]}>
      <Line
        points={[
          [-0.185, 0.285, 0],
          [-0.12, 0.291, 0],
        ]}
        color={FADED_CHALK_COLOR}
        lineWidth={0.7}
        transparent
        opacity={0.12}
      />

      <Line
        points={[
          [0.095, 0.275, 0],
          [0.175, 0.268, 0],
        ]}
        color={FADED_CHALK_COLOR}
        lineWidth={0.7}
        transparent
        opacity={0.1}
      />

      <Line
        points={[
          [-0.19, -0.275, 0],
          [-0.115, -0.268, 0],
        ]}
        color={FADED_CHALK_COLOR}
        lineWidth={0.7}
        transparent
        opacity={0.12}
      />

      <Line
        points={[
          [0.09, -0.288, 0],
          [0.18, -0.278, 0],
        ]}
        color={FADED_CHALK_COLOR}
        lineWidth={0.7}
        transparent
        opacity={0.1}
      />

      <Line
        points={[
          [-0.2, 0.14, 0],
          [-0.174, 0.12, 0],
        ]}
        color={FADED_CHALK_COLOR}
        lineWidth={0.6}
        transparent
        opacity={0.13}
      />

      <Line
        points={[
          [0.19, -0.13, 0],
          [0.171, -0.16, 0],
        ]}
        color={FADED_CHALK_COLOR}
        lineWidth={0.6}
        transparent
        opacity={0.12}
      />
    </group>
  );
}

function ChalkMessage({
  message,
}: {
  message: string;
}) {
  return (
    <group position={[0, -0.185, 0.009]}>
      {/* Faded offset layer creates a dusty chalk edge. */}
      <Text
        position={[0.004, -0.003, 0]}
        fontSize={0.058}
        maxWidth={0.35}
        lineHeight={1.02}
        letterSpacing={0.025}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color={FADED_CHALK_COLOR}
        fillOpacity={0.28}
      >
        {message}
      </Text>

      {/* Main writing */}
      <Text
        position={[0, 0, 0.001]}
        fontSize={0.058}
        maxWidth={0.35}
        lineHeight={1.02}
        letterSpacing={0.025}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color={CHALK_COLOR}
        fillOpacity={0.93}
        outlineWidth={0.0006}
        outlineColor="#d6d0c7"
        outlineOpacity={0.3}
      >
        {message}
      </Text>

      {/* Small underline resembling a chalk stroke */}
      <Line
        points={[
          [-0.11, -0.093, 0.002],
          [0.11, -0.096, 0.002],
        ]}
        color={CHALK_COLOR}
        lineWidth={0.9}
        transparent
        opacity={0.25}
      />
    </group>
  );
}

function SignFace({
  side,
  message,
}: SignFaceProps) {
  const {
    position,
    quaternion,
  } = useMemo(() => {
    const normal = new Vector3(
      side * 0.966,
      0.259,
      0
    ).normalize();

    const xAxis = new Vector3(
      0,
      0,
      -side
    );

    const yAxis = new Vector3(
      -side * 0.259,
      0.966,
      0
    ).normalize();

    const zAxis =
      normal.clone();

    const rotationMatrix =
      new Matrix4().makeBasis(
        xAxis,
        yAxis,
        zAxis
      );

    const faceQuaternion =
      new Quaternion().setFromRotationMatrix(
        rotationMatrix
      );

    const facePosition =
      new Vector3(
        side * 0.154,
        0.64,
        0
      ).addScaledVector(
        normal,
        0.006
      );

    return {
      position:
        facePosition,
      quaternion:
        faceQuaternion,
    };
  }, [side]);

  return (
    <group
      position={position}
      quaternion={quaternion}
    >
      {/* Black chalkboard covering the original menu. */}
      <mesh receiveShadow>
        <planeGeometry
          args={[
            0.455,
            0.675,
          ]}
        />

        <meshStandardMaterial
          color="#0c0d0c"
          roughness={1}
          metalness={0}
          side={DoubleSide}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      <ChalkTextureMarks />

      <ChalkArrows />

      <ChalkMouse />

      <ChalkMessage
        message={message}
      />
    </group>
  );
}

export default function NavigationSign({
  message = "CLICK &\nDRAG",
  ...props
}: NavigationSignProps) {
  const {
    nodes,
    materials,
  } = useGLTF(
    "/welcome_sign_restaurant_optimized.glb"
  ) as any;

  return (
    <group
      {...props}
      dispose={null}
    >
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={
            nodes
              .SM_Welcome_Sign_Restourant_T_floor_sign_1001_0
              .geometry
          }
          material={
            materials
              .T_floor_sign_1001
          }
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
          scale={92.549}
        />
      </group>

      <SignFace
        side={1}
        message={message}
      />

      <SignFace
        side={-1}
        message={message}
      />
    </group>
  );
}

useGLTF.preload(
  "/welcome_sign_restaurant_optimized.glb"
);