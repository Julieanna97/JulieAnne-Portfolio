"use client";

import { Line, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  FrontSide,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";
import type {
  Group,
  Material,
} from "three";

const CHALK_COLOR = "#fff6ee";

/*
 * Keep the chalk artwork clearly in front of the board.
 * This prevents the board's depth buffer from hiding it.
 */
const ARTWORK_Z_OFFSET = 0.03;

export default function ExistingStreetSignOverlay() {
  const posterRef = useRef<Group>(null);

  const cameraWorldPosition = useMemo(
    () => new Vector3(),
    [],
  );

  const cameraOffset = useMemo(
    () => new Vector3(),
    [],
  );

  const {
    boardPosition,
    quaternion,
    faceNormal,
  } = useMemo(() => {
    /*
     * Position and normal from the original sign.
     */
    const faceNormal = new Vector3(
      0.518,
      0.43,
      0.739,
    ).normalize();

    const upHint = new Vector3(
      0,
      1,
      0,
    );

    let xAxis = new Vector3().crossVectors(
      upHint,
      faceNormal,
    );

    if (xAxis.lengthSq() < 0.0001) {
      xAxis = new Vector3(
        1,
        0,
        0,
      );
    } else {
      xAxis.normalize();
    }

    const yAxis = new Vector3()
      .crossVectors(
        faceNormal,
        xAxis,
      )
      .normalize();

    const rotationMatrix =
      new Matrix4().makeBasis(
        xAxis,
        yAxis,
        faceNormal,
      );

    const quaternion =
      new Quaternion().setFromRotationMatrix(
        rotationMatrix,
      );

    const SIGN_LEFT_OFFSET = -0.04;
    const SIGN_DOWN_OFFSET = -0.055;
    const BOARD_SURFACE_OFFSET = 0.014;

    const boardPosition = new Vector3(
      5.148,
      1.132,
      -3.509,
    )
      .addScaledVector(
        faceNormal,
        BOARD_SURFACE_OFFSET,
      )
      .addScaledVector(
        xAxis,
        SIGN_LEFT_OFFSET,
      )
      .addScaledVector(
        yAxis,
        SIGN_DOWN_OFFSET,
      );

    return {
      boardPosition,
      quaternion,
      faceNormal,
    };
  }, []);

  /*
   * Hide the complete poster when the camera moves
   * behind it. This prevents the black backside and
   * chalk artwork from appearing through the building.
   */
  useFrame(({ camera }) => {
    if (!posterRef.current) {
      return;
    }

    camera.getWorldPosition(
      cameraWorldPosition,
    );

    cameraOffset
      .copy(cameraWorldPosition)
      .sub(boardPosition);

    posterRef.current.visible =
      cameraOffset.dot(faceNormal) > 0;
  });

  return (
    <group
      ref={posterRef}
      position={boardPosition}
      quaternion={quaternion}
      frustumCulled={false}
    >
      {/* Opaque black poster surface */}
      <mesh
        renderOrder={100}
        frustumCulled={false}
      >
        <planeGeometry
          args={[
            0.46,
            0.56,
          ]}
        />

        <meshBasicMaterial
          color="#070707"
          side={FrontSide}
          toneMapped={false}
          transparent={false}
          opacity={1}
          depthTest
          depthWrite
        />
      </mesh>

      {/*
       * All chalk artwork is moved farther in front
       * of the black plane to prevent depth conflicts.
       */}
      <group
        position={[
          0,
          0,
          ARTWORK_Z_OFFSET,
        ]}
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
          lineWidth={1}
          transparent
          opacity={0.32}
          depthTest
          depthWrite={false}
          renderOrder={210}
          frustumCulled={false}
        />

        {/* Left arrow line */}
        <Line
          points={[
            [-0.12, 0.18, 0],
            [-0.045, 0.18, 0],
          ]}
          color={CHALK_COLOR}
          lineWidth={1.8}
          depthTest
          depthWrite={false}
          renderOrder={220}
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
          lineWidth={1.8}
          depthTest
          depthWrite={false}
          renderOrder={220}
          frustumCulled={false}
        />

        {/* Right arrow line */}
        <Line
          points={[
            [0.045, 0.18, 0],
            [0.12, 0.18, 0],
          ]}
          color={CHALK_COLOR}
          lineWidth={1.8}
          depthTest
          depthWrite={false}
          renderOrder={220}
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
          lineWidth={1.8}
          depthTest
          depthWrite={false}
          renderOrder={220}
          frustumCulled={false}
        />

        {/*
         * Mouse sketch gets an additional forward offset.
         * It is also slightly thicker so it remains visible
         * when the camera is farther away.
         */}
        <group
          position={[
            0,
            0,
            0.008,
          ]}
          renderOrder={240}
        >
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
            lineWidth={2.4}
            depthTest
            depthWrite={false}
            renderOrder={240}
            frustumCulled={false}
          />

          {/* Mouse button divider */}
          <Line
            points={[
              [0, 0.085, 0],
              [0, 0.025, 0],
            ]}
            color={CHALK_COLOR}
            lineWidth={1.8}
            depthTest
            depthWrite={false}
            renderOrder={241}
            frustumCulled={false}
          />

          {/* Mouse wheel */}
          <Line
            points={[
              [0, 0.012, 0],
              [0, -0.008, 0],
            ]}
            color={CHALK_COLOR}
            lineWidth={2}
            depthTest
            depthWrite={false}
            renderOrder={242}
            frustumCulled={false}
          />
        </group>

        {/* CLICK & DRAG text */}
        <Text
          position={[
            0,
            -0.16,
            0.01,
          ]}
          fontSize={0.052}
          maxWidth={0.32}
          lineHeight={1.02}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color={CHALK_COLOR}
          outlineWidth={0.002}
          outlineColor="#000000"
          renderOrder={250}
          frustumCulled={false}
          onSync={(textMesh) => {
            const materials: Material[] =
              Array.isArray(
                textMesh.material,
              )
                ? (
                    textMesh.material as Material[]
                  )
                : [
                    textMesh.material as Material,
                  ];

            materials.forEach(
              (material) => {
                /*
                 * Keep normal depth testing so the
                 * building can cover the poster.
                 */
                material.depthTest = true;
                material.depthWrite = false;
                material.toneMapped = false;
                material.side = FrontSide;
                material.transparent = true;
                material.needsUpdate = true;
              },
            );

            textMesh.renderOrder = 250;
            textMesh.frustumCulled = false;
          }}
        >
          {"CLICK &\nDRAG"}
        </Text>
      </group>
    </group>
  );
}