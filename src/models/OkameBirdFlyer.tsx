"use client";

/*
  OKAMEbird🌱
  Author: OkameMiko (https://sketchfab.com/OkameMiko)
  License: CC-BY-NC-4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
  Source: https://sketchfab.com/3d-models/okamebird-75fd19426b154f0598b4e0461267df92

  Automatic flying bird for the isometric portfolio room.
*/

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import {
  Box3,
  CatmullRomCurve3,
  Group,
  MathUtils,
  Object3D,
  Vector3,
} from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

/*
  Keep the motion gentle so the bird feels decorative rather than distracting.
*/
const FLIGHT_SPEED = 0.038;

/*
  The first version used 0.82, which made the bird difficult to notice.
  This larger target height keeps it readable next to the complete room model.
*/
const TARGET_BIRD_HEIGHT = 2.35;

/*
  Sketchfab model forward direction correction.
*/
const MODEL_YAW_OFFSET = Math.PI / 2;

/*
  Exterior flight loop in the room-local coordinate system.

  The room occupies roughly:
  - x: -8 to 8
  - z: -8 to 7

  Every point below stays beyond that footprint, so the bird circles around
  the outside of the room instead of flying through walls, furniture, or the
  bathroom glass. Some points sit slightly higher to create a natural loop.
*/
const FLIGHT_POINTS = [
  new Vector3(-11.8, 8.8, -8.9),
  new Vector3(-12.6, 9.7, -1.6),
  new Vector3(-12.1, 10.5, 8.9),
  new Vector3(-4.6, 11.2, 10.8),
  new Vector3(4.9, 10.6, 10.3),
  new Vector3(11.3, 9.4, 8.1),
  new Vector3(12.4, 8.8, 0.2),
  new Vector3(11.7, 9.7, -8.8),
  new Vector3(4.8, 11.0, -10.5),
  new Vector3(-4.2, 10.4, -10.9),
];

export default function OkameBirdFlyer() {
  const flightGroupRef = useRef<Group>(null);
  const animatedModelRef = useRef<Group>(null);
  const progressRef = useRef(0.08);
  const previousTangentRef = useRef(new Vector3(0, 0, 1));

  const { scene, animations } = useGLTF("/okamebird.glb") as any;

  /*
    SkeletonUtils preserves the rig so the embedded wing animation works.
  */
  const clonedScene = useMemo<Object3D>(() => cloneSkeleton(scene), [scene]);

  /*
    Auto-center the Sketchfab model and calculate a stable scale from its real
    height. This avoids relying on unusual nested transforms inside the GLB.
  */
  const modelSetup = useMemo(() => {
    clonedScene.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(clonedScene);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const safeHeight = Math.max(size.y, 0.0001);

    return {
      correction: [-center.x, -center.y, -center.z] as [number, number, number],
      scale: TARGET_BIRD_HEIGHT / safeHeight,
    };
  }, [clonedScene]);

  const curve = useMemo(
    () => new CatmullRomCurve3(FLIGHT_POINTS, true, "catmullrom", 0.42),
    []
  );

  const { actions } = useAnimations(animations, animatedModelRef);

  useEffect(() => {
    const animationName = animations?.[0]?.name;
    const action = animationName ? actions?.[animationName] : undefined;

    if (!action) return;

    action.reset().fadeIn(0.2).play();
    action.timeScale = 1.25;

    return () => {
      action.fadeOut(0.2);
      action.stop();
    };
  }, [actions, animations]);

  useFrame((state, delta) => {
    const flightGroup = flightGroupRef.current;

    if (!flightGroup) return;

    progressRef.current = (progressRef.current + delta * FLIGHT_SPEED) % 1;

    const progress = progressRef.current;
    const position = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(progress).normalize();

    /* Gentle natural bobbing while the bird loops around the room exterior. */
    position.y += Math.sin(state.clock.elapsedTime * 2.75) * 0.18;

    flightGroup.position.copy(position);

    /* Face the direction of travel. */
    const targetYaw = Math.atan2(tangent.x, tangent.z);

    flightGroup.rotation.y = MathUtils.lerp(
      flightGroup.rotation.y,
      targetYaw,
      1 - Math.exp(-8 * delta)
    );

    /* Add a slight bank when the exterior route curves. */
    const previousTangent = previousTangentRef.current;
    const turnAmount =
      previousTangent.x * tangent.z - previousTangent.z * tangent.x;

    flightGroup.rotation.z = MathUtils.lerp(
      flightGroup.rotation.z,
      MathUtils.clamp(-turnAmount * 4.4, -0.38, 0.38),
      1 - Math.exp(-5 * delta)
    );

    previousTangent.copy(tangent);
  });

  return (
    <group ref={flightGroupRef} name="automatic-flying-okamebird">
      <group
        ref={animatedModelRef}
        scale={modelSetup.scale}
        rotation={[0, MODEL_YAW_OFFSET, 0]}
        dispose={null}
      >
        <primitive object={clonedScene} position={modelSetup.correction} />
      </group>
    </group>
  );
}

useGLTF.preload("/okamebird.glb");
