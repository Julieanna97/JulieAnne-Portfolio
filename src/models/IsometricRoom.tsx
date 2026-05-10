"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { a } from "@react-spring/three";

const IsometricRoom = (props: any) => {
  const { scene } = useGLTF("/isometric_room.glb");

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((material: any) => {
          if (!material) return;

          if ("roughness" in material && material.roughness !== undefined) {
            material.roughness = Math.min(1, material.roughness + 0.05);
          }

          if ("metalness" in material && material.metalness !== undefined) {
            material.metalness = 0;
          }

          if ("color" in material && material.color) {
            const maxChannel = Math.max(
              material.color.r,
              material.color.g,
              material.color.b
            );

            if (maxChannel > 0.94) {
              material.color.multiplyScalar(0.94);
            }
          }

          material.needsUpdate = true;
        });
      }
    });

    return clone;
  }, [scene]);

  return (
    <a.group {...props}>
      <primitive object={clonedScene} />
    </a.group>
  );
};

useGLTF.preload("/isometric_room.glb");

export default IsometricRoom;