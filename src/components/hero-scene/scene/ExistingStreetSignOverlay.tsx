"use client";

import { Line, Text } from "@react-three/drei";
import { useMemo } from "react";
import {
  DoubleSide,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";

const CHALK_COLOR = "#fff6ee";

export default function ExistingStreetSignOverlay() {
  const { boardPosition, quaternion } = useMemo(() => {
    /*
      Values from your clicked sign:
      position: [5.148, 1.132, -3.509]
      normal:   [0.518, 0.43, 0.739]
    */
    const faceNormal = new Vector3(
      0.518,
      0.43,
      0.739
    ).normalize();

    const upHint = new Vector3(0, 1, 0);

    let xAxis = new Vector3().crossVectors(
      upHint,
      faceNormal
    );

    if (xAxis.lengthSq() < 0.0001) {
      xAxis = new Vector3(1, 0, 0);
    } else {
      xAxis.normalize();
    }

    const yAxis = new Vector3()
      .crossVectors(faceNormal, xAxis)
      .normalize();

    const rotationMatrix = new Matrix4().makeBasis(
      xAxis,
      yAxis,
      faceNormal
    );

    const quaternion =
      new Quaternion().setFromRotationMatrix(
        rotationMatrix
      );

    /*
      Horizontal placement on the sign face.
      More negative = farther left.
    */
    const SIGN_LEFT_OFFSET = -0.04;

    /*
      Vertical placement on the sign face.
      More negative = lower.
    */
    const SIGN_DOWN_OFFSET = -0.055;

    /*
      Keep the black board close to the real sign
      so it looks attached, not floating.
    */
    const BOARD_SURFACE_OFFSET = 0.014;

    const boardPosition = new Vector3(
      5.148,
      1.132,
      -3.509
    )
      .addScaledVector(
        faceNormal,
        BOARD_SURFACE_OFFSET
      )
      .addScaledVector(
        xAxis,
        SIGN_LEFT_OFFSET
      )
      .addScaledVector(
        yAxis,
        SIGN_DOWN_OFFSET
      );

    return {
      boardPosition,
      quaternion,
    };
  }, []);

  return (
    <group
      position={boardPosition}
      quaternion={quaternion}
      renderOrder={100}
      frustumCulled={false}
    >
      {/* Black replacement surface */}
      <mesh
        renderOrder={100}
        frustumCulled={false}
      >
        <planeGeometry args={[0.46, 0.56]} />
        <meshBasicMaterial
          color="#070707"
          side={DoubleSide}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-8}
          polygonOffsetUnits={-8}
        />
      </mesh>

      {/*
        Keep the artwork only slightly in front of the board,
        instead of pushing the whole board far out.
      */}
      <group
        position={[0, 0, 0.01]}
        renderOrder={200}
      >
        {/* Chalk border */}
        <Line
          points={[
            [-0.18, 0.25, 0],
            [0.18, 0.25, 0],
            [0.18, -0.25, 0],
            [-0.18, -0.25, 0],
            [-0.18, 0.25, 0],
          ]}
          color={CHALK_COLOR}
          lineWidth={0.8}
          transparent
          opacity={0.22}
          depthTest={false}
          depthWrite={false}
          renderOrder={200}
          frustumCulled={false}
        />

        {/* Left arrow line */}
        <Line
          points={[
            [-0.12, 0.18, 0],
            [-0.045, 0.18, 0],
          ]}
          color={CHALK_COLOR}
          lineWidth={1.5}
          depthTest={false}
          depthWrite={false}
          renderOrder={210}
          frustumCulled={false}
        />

        {/* Left arrow head */}
        <Line
          points={[
            [-0.12, 0.18, 0],
            [-0.095, 0.2, 0],
            [-0.12, 0.18, 0],
            [-0.095, 0.16, 0],
          ]}
          color={CHALK_COLOR}
          lineWidth={1.5}
          depthTest={false}
          depthWrite={false}
          renderOrder={210}
          frustumCulled={false}
        />

        {/* Right arrow line */}
        <Line
          points={[
            [0.045, 0.18, 0],
            [0.12, 0.18, 0],
          ]}
          color={CHALK_COLOR}
          lineWidth={1.5}
          depthTest={false}
          depthWrite={false}
          renderOrder={210}
          frustumCulled={false}
        />

        {/* Right arrow head */}
        <Line
          points={[
            [0.12, 0.18, 0],
            [0.095, 0.2, 0],
            [0.12, 0.18, 0],
            [0.095, 0.16, 0],
          ]}
          color={CHALK_COLOR}
          lineWidth={1.5}
          depthTest={false}
          depthWrite={false}
          renderOrder={210}
          frustumCulled={false}
        />

        {/* Mouse outline */}
        <Line
          points={[
            [0, 0.09, 0],
            [0.045, 0.075, 0],
            [0.06, 0.03, 0],
            [0.055, -0.02, 0],
            [0.03, -0.07, 0],
            [0, -0.09, 0],
            [-0.03, -0.07, 0],
            [-0.055, -0.02, 0],
            [-0.06, 0.03, 0],
            [-0.045, 0.075, 0],
            [0, 0.09, 0],
          ]}
          color={CHALK_COLOR}
          lineWidth={1.7}
          depthTest={false}
          depthWrite={false}
          renderOrder={220}
          frustumCulled={false}
        />

        {/* Mouse divider */}
        <Line
          points={[
            [0, 0.085, 0],
            [0, 0.025, 0],
          ]}
          color={CHALK_COLOR}
          lineWidth={1.2}
          depthTest={false}
          depthWrite={false}
          renderOrder={220}
          frustumCulled={false}
        />

        {/* Mouse wheel */}
        <Line
          points={[
            [0, 0.012, 0],
            [0, -0.005, 0],
          ]}
          color={CHALK_COLOR}
          lineWidth={1.2}
          depthTest={false}
          depthWrite={false}
          renderOrder={220}
          frustumCulled={false}
        />

        {/* CLICK & DRAG */}
        <Text
          position={[0, -0.16, 0.002]}
          fontSize={0.052}
          maxWidth={0.32}
          lineHeight={1.02}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color={CHALK_COLOR}
          outlineWidth={0.002}
          outlineColor="#000000"
          renderOrder={230}
          frustumCulled={false}
          onSync={(textMesh) => {
            const materials = Array.isArray(
              textMesh.material
            )
              ? textMesh.material
              : [textMesh.material];

            materials.forEach((material) => {
              material.depthTest = false;
              material.depthWrite = false;
              material.toneMapped = false;
              material.side = DoubleSide;
              material.transparent = true;
              material.needsUpdate = true;
            });

            textMesh.renderOrder = 230;
            textMesh.frustumCulled = false;
          }}
        >
          {"CLICK &\nDRAG"}
        </Text>
      </group>
    </group>
  );
}