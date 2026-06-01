"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { a } from "@react-spring/three";
import { Color } from "three";

const IsometricRoom = ({
  theme,
  ...props
}: { theme?: "day" | "night" } & any) => {
  const { scene } = useGLTF("/isometric_room.glb");
  const isNightMode = theme === "night";

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child: any) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const originalMaterials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      const clonedMaterials = originalMaterials.map((material: any) => {
        if (!material) return material;

        const nextMaterial = material.clone();

        if (
          "roughness" in nextMaterial &&
          nextMaterial.roughness !== undefined
        ) {
          nextMaterial.roughness = Math.min(
            1,
            nextMaterial.roughness + (isNightMode ? 0.06 : 0)
          );
        }

        if (
          "metalness" in nextMaterial &&
          nextMaterial.metalness !== undefined
        ) {
          nextMaterial.metalness = isNightMode
            ? Math.min(nextMaterial.metalness, 0.02)
            : nextMaterial.metalness;
        }

        if (isNightMode && "color" in nextMaterial && nextMaterial.color) {
          const maxChannel = Math.max(
            nextMaterial.color.r,
            nextMaterial.color.g,
            nextMaterial.color.b
          );

          /*
            Make night mode slightly moodier,
            but not so dark that the room becomes hard to see.
          */
          nextMaterial.color.multiplyScalar(maxChannel > 0.94 ? 0.86 : 0.97);
        }

        if (isNightMode && "emissive" in nextMaterial && nextMaterial.emissive) {
          const glowTint = new Color("#4f3d6d");
          nextMaterial.emissive.lerp(glowTint, 0.08);

          if ("emissiveIntensity" in nextMaterial) {
            nextMaterial.emissiveIntensity = Math.max(
              nextMaterial.emissiveIntensity ?? 1,
              0.16
            );
          }
        }

        nextMaterial.needsUpdate = true;
        return nextMaterial;
      });

      child.material = Array.isArray(child.material)
        ? clonedMaterials
        : clonedMaterials[0];
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