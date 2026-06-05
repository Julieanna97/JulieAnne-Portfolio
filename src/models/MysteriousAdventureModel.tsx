"use client";

/*
  A Mysterious Adventure - 3D Editor Challenge
  Author: Diosmel (https://sketchfab.com/dyvonnet)
  License: CC-BY-4.0 (https://creativecommons.org/licenses/by/4.0/)
  Source: https://sketchfab.com/3d-models/a-mysterious-adventure-3d-editor-challenge-4e2519964d4e42d891314777e4258e28
*/

import { useEffect, useMemo, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import {
  Box3,
  Group,
  LoopRepeat,
  Material,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

const MODEL_HEIGHT = 13.2;

function tuneMaterial(material: Material) {
  const namedMaterial = material as Material & { name?: string };
  const name = (namedMaterial.name ?? "").toLowerCase();

  if (material instanceof MeshStandardMaterial) {
    material.envMapIntensity = Math.max(material.envMapIntensity ?? 1, 1.08);

    /* Keep the scene's authored maps while giving hard surfaces a little
       more reflected moonlight. */
    if (!name.includes("alpha") && !name.includes("glass")) {
      material.roughness = Math.min(material.roughness ?? 1, 0.92);
    }
  }

  if (material instanceof MeshPhysicalMaterial) {
    material.clearcoat = Math.max(material.clearcoat ?? 0, 0.12);
    material.clearcoatRoughness = Math.min(
      material.clearcoatRoughness ?? 1,
      0.42
    );
  }

  if (name.includes("glass") || name.includes("alpha")) {
    const transparentMaterial = material as MeshStandardMaterial;
    transparentMaterial.transparent = true;
    transparentMaterial.depthWrite = false;
    transparentMaterial.opacity = Math.min(transparentMaterial.opacity ?? 1, 0.82);
  }

  material.needsUpdate = true;
}

export default function MysteriousAdventureModel() {
  const animationGroupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(
    "/a_mysterious_adventure_-_3d_editor_challenge.glb"
  ) as any;

  const clonedScene = useMemo<Object3D>(() => {
    const clone = cloneSkeleton(scene);

    clone.traverse((object) => {
      if (!(object instanceof Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (Array.isArray(object.material)) {
        object.material.forEach(tuneMaterial);
      } else if (object.material) {
        tuneMaterial(object.material);
      }
    });

    return clone;
  }, [scene]);

  const transform = useMemo(() => {
    clonedScene.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(clonedScene);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const scale = MODEL_HEIGHT / Math.max(size.y, 0.0001);

    return {
      scale,
      position: [-center.x, -bounds.min.y, -center.z] as [number, number, number],
    };
  }, [clonedScene]);

  const { actions } = useAnimations(animations, animationGroupRef);

  useEffect(() => {
    const activeActions = Object.values(actions ?? {}).filter(Boolean) as any[];

    activeActions.forEach((action) => {
      action.reset();
      action.setLoop(LoopRepeat, Infinity);
      action.clampWhenFinished = false;
      action.enabled = true;
      action.fadeIn(0.35).play();
    });

    return () => {
      activeActions.forEach((action) => {
        action.fadeOut(0.2);
        action.stop();
      });
    };
  }, [actions]);

  return (
    <group ref={animationGroupRef} dispose={null}>
      <group scale={transform.scale}>
        <primitive object={clonedScene} position={transform.position} />
      </group>
    </group>
  );
}

useGLTF.preload("/a_mysterious_adventure_-_3d_editor_challenge.glb");
