"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { a } from "@react-spring/three";

const IsometricRoom = ({ theme, ...props }: { theme?: "day" | "night" } & any) => {
  const { scene } = useGLTF("/isometric_room.glb");
  const isNightMode = theme === "night";

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
            material.roughness = Math.min(
              1,
              material.roughness + (isNightMode ? 0.12 : 0.04)
            );
          }

          if ("metalness" in material && material.metalness !== undefined) {
            material.metalness = isNightMode ? 0 : Math.min(material.metalness, 0.05);
          }

          if ("color" in material && material.color) {
            const maxChannel = Math.max(
              material.color.r,
              material.color.g,
              material.color.b
            );

            if (isNightMode) {
              material.color.multiplyScalar(maxChannel > 0.94 ? 0.72 : 0.9);
            } else if (maxChannel > 0.94) {
              material.color.multiplyScalar(0.95);
            }
          }

          if (isNightMode && "emissive" in material && material.emissive) {
            material.emissive.multiplyScalar(0.15);
          }

          material.needsUpdate = true;
        });
      }
    });

    return clone;
  }, [scene, isNightMode]);

  return (
    <a.group {...props}>
      <primitive object={clonedScene} />
    </a.group>
  );
};

useGLTF.preload("/isometric_room.glb");

export default IsometricRoom;