"use client";

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
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Shape,
} from "three";

type FloatingHeartProps = {
  position?: [
    number,
    number,
    number,
  ];
  scale?: number;
};

export default function FloatingHeart({
  position = [
    0,
    15.2,
    0,
  ],
  scale = 0.72,
}: FloatingHeartProps) {
  const animatedGroupRef =
    useRef<Group>(
      null
    );

  const heartGeometry =
    useMemo(() => {
      const shape =
        new Shape();

      /*
        Bottom tip.
      */
      shape.moveTo(
        0,
        -1.05
      );

      /*
        Left side.
      */
      shape.bezierCurveTo(
        -0.18,
        -0.78,
        -1.18,
        -0.14,
        -1.18,
        0.62
      );

      shape.bezierCurveTo(
        -1.18,
        1.25,
        -0.56,
        1.57,
        0,
        0.93
      );

      /*
        Right side.
      */
      shape.bezierCurveTo(
        0.56,
        1.57,
        1.18,
        1.25,
        1.18,
        0.62
      );

      shape.bezierCurveTo(
        1.18,
        -0.14,
        0.18,
        -0.78,
        0,
        -1.05
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
          }
        );

      geometry.center();
      geometry.computeVertexNormals();

      return geometry;
    }, []);

  useEffect(() => {
    return () => {
      heartGeometry.dispose();
    };
  }, [
    heartGeometry,
  ]);

  useFrame(
    (
      state,
      delta
    ) => {
      const group =
        animatedGroupRef.current;

      if (!group) {
        return;
      }

      const elapsed =
        state.clock.elapsedTime;

      /*
        Smooth vertical floating.
      */
      group.position.y =
        Math.sin(
          elapsed * 1.25
        ) * 0.24;

      /*
        Continuous rotation.
      */
      group.rotation.y +=
        delta * 0.72;

      /*
        Small natural tilting.
      */
      group.rotation.x =
        -0.08 +
        Math.sin(
          elapsed * 0.62
        ) *
          0.07;

      group.rotation.z =
        Math.sin(
          elapsed * 0.82
        ) *
        0.055;
    }
  );

  return (
    <group
      position={position}
      scale={scale}
    >
      <group
        ref={
          animatedGroupRef
        }
      >
        {/*
          Solid glowing heart.
        */}
        <mesh
          geometry={
            heartGeometry
          }
          castShadow
        >
          <meshPhysicalMaterial
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
          Slightly larger holographic wireframe.
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
          Soft hologram beam below the heart.
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
          Main hologram ring.
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
          Secondary cyan ring.
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
          Faint glowing base.
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
    </group>
  );
}