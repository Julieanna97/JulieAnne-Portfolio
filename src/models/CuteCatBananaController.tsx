"use client";

/*
  Cute Cat in Cute Banana
  Author: SOBOL (https://sketchfab.com/sbl-cool)
  License: CC-BY-4.0 (https://creativecommons.org/licenses/by/4.0/)
  Source: https://sketchfab.com/3d-models/cute-cat-in-cute-banana-fb3eee24c9fc422ea256b95d5148931f

  Keyboard-controlled character for the isometric portfolio room.
*/

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import {
  Box3,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Quaternion,
  Vector3,
} from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

const WALK_SPEED = 2.35;
const MODEL_SCALE = 0.72;

/*
  Spawn the character on the visible lower-floor carpet.
  All values use the same room-local coordinate system as IsometricRoom.
*/
const START_POSITION: [number, number, number] = [4.85, 0.48, -1.25];

/*
  Keep the cat inside the lower floor. Furniture collisions can be added
  later, but these boundaries prevent the character from leaving the room.
*/
const ROOM_LIMITS = {
  minX: 0.55,
  maxX: 7.45,
  minZ: -5.55,
  maxZ: 6.4,
};

/*
  Approximate lower-floor furniture footprints measured from the room GLB.
  The controller uses these as simple 2D collision rectangles on the floor.

  This is intentionally lightweight: it prevents the character from walking
  through the main furniture while keeping keyboard movement responsive.
*/
type FloorCollider = {
  name: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

const CHARACTER_RADIUS = 0.36;

const FLOOR_COLLIDERS: FloorCollider[] = [
  {
    name: "sofa",
    minX: 0.28,
    maxX: 2.96,
    minZ: 1.23,
    maxZ: 6.26,
  },
  {
    name: "coffee-table",
    minX: 3.36,
    maxX: 5.88,
    minZ: 2.51,
    maxZ: 5.03,
  },
  {
    name: "tv-cabinet",
    minX: 6.15,
    maxX: 7.67,
    minZ: 1.41,
    maxZ: 6.28,
  },
  {
    /*
      Only block the ladder's lower-floor footprint.
      The previous rectangle covered too much open floor and trapped the cat.
    */
    name: "ladder-feet",
    minX: 2.45,
    maxX: 3.72,
    minZ: -0.78,
    maxZ: 0.34,
  },
  {
    name: "kitchen-counter",
    minX: -1.78,
    maxX: 5.61,
    minZ: -8.34,
    maxZ: -6.49,
  },
  {
    name: "fridge",
    minX: 5.64,
    maxX: 8.27,
    minZ: -8.29,
    maxZ: -6.08,
  },
];

const getFurniturePenetration = (x: number, z: number) => {
  return FLOOR_COLLIDERS.reduce((total, collider) => {
    const minX = collider.minX - CHARACTER_RADIUS;
    const maxX = collider.maxX + CHARACTER_RADIUS;
    const minZ = collider.minZ - CHARACTER_RADIUS;
    const maxZ = collider.maxZ + CHARACTER_RADIUS;

    const isInside =
      x >= minX &&
      x <= maxX &&
      z >= minZ &&
      z <= maxZ;

    if (!isInside) return total;

    /*
      Measure how far the cat is inside this collider. This makes movement
      escape-friendly: if a model update or spawn adjustment places the cat
      slightly inside an obstacle, movement outward remains possible.
    */
    const penetration = Math.min(
      x - minX,
      maxX - x,
      z - minZ,
      maxZ - z
    );

    return total + penetration;
  }, 0);
};

const canMoveTo = (
  currentX: number,
  currentZ: number,
  nextX: number,
  nextZ: number
) => {
  const currentPenetration = getFurniturePenetration(currentX, currentZ);
  const nextPenetration = getFurniturePenetration(nextX, nextZ);

  if (nextPenetration <= 0) return true;

  /* Allow movement only when it reduces accidental overlap. */
  return nextPenetration < currentPenetration - 0.0001;
};

export default function CuteCatBananaController() {
  const movementGroupRef = useRef<Group>(null);
  const animatedModelRef = useRef<Group>(null);
  const markerMaterialRef = useRef<MeshBasicMaterial>(null);
  const markerRef = useRef<Mesh>(null);
  const pressedKeysRef = useRef<Record<string, boolean>>({});

  const { scene, animations } = useGLTF(
    "/cute_cat_in_cute_banana.glb"
  ) as any;

  /*
    Skinned Sketchfab models should be cloned with SkeletonUtils rather than
    rebuilt manually from individual nodes. This preserves the rig and the
    embedded animation while allowing this instance to move independently.
  */
  const clonedScene = useMemo<Object3D>(() => cloneSkeleton(scene), [scene]);

  /*
    Calculate the original model bounds once, then center the model and place
    its lowest point at y = 0 inside the scaled character group. This removes
    the GLB's unusually high internal origin automatically.
  */
  const originCorrection = useMemo<[number, number, number]>(() => {
    clonedScene.updateMatrixWorld(true);

    const bounds = new Box3().setFromObject(clonedScene);
    const center = bounds.getCenter(new Vector3());

    return [-center.x, -bounds.min.y, -center.z];
  }, [clonedScene]);

  const { actions } = useAnimations(animations, animatedModelRef);

  useEffect(() => {
    const animationName = animations?.[0]?.name;
    const action = animationName ? actions?.[animationName] : undefined;

    if (!action) return;

    action.reset().play();
    action.timeScale = 1.3;
    action.paused = true;

    return () => {
      action.fadeOut(0.2);
      action.stop();
    };
  }, [actions, animations]);

  useEffect(() => {
    const movementKeys = new Set([
      "w",
      "a",
      "s",
      "d",
      "arrowup",
      "arrowdown",
      "arrowleft",
      "arrowright",
    ]);

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) return;

      const key = event.key.toLowerCase();

      if (!movementKeys.has(key)) return;

      event.preventDefault();
      pressedKeysRef.current[key] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (!movementKeys.has(key)) return;

      event.preventDefault();
      pressedKeysRef.current[key] = false;
    };

    const clearPressedKeys = () => {
      pressedKeysRef.current = {};
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearPressedKeys);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearPressedKeys);
    };
  }, []);

  useFrame((state, delta) => {
    const movementGroup = movementGroupRef.current;

    if (!movementGroup) return;

    const keys = pressedKeysRef.current;

    let forwardInput = 0;
    let rightInput = 0;

    if (keys.w || keys.arrowup) forwardInput += 1;
    if (keys.s || keys.arrowdown) forwardInput -= 1;
    if (keys.a || keys.arrowleft) rightInput -= 1;
    if (keys.d || keys.arrowright) rightInput += 1;

    const isMoving = forwardInput !== 0 || rightInput !== 0;

    const animationName = animations?.[0]?.name;
    const action = animationName ? actions?.[animationName] : undefined;

    if (action) {
      /*
        Play the walking clip only while a movement key is actively held.
        When the user releases W/A/S/D or an arrow key, freeze the current
        animation frame immediately instead of continuing an idle walk.
      */
      action.paused = !isMoving;

      if (isMoving) {
        action.timeScale = MathUtils.damp(
          action.timeScale,
          1.3,
          8,
          delta
        );
      }
    }

    /* A soft floor marker makes the controllable character easy to find. */
    if (markerRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.055;
      markerRef.current.scale.setScalar(pulse);
    }

    if (markerMaterialRef.current) {
      markerMaterialRef.current.opacity =
        0.2 + Math.sin(state.clock.elapsedTime * 2.4) * 0.045;
    }

    if (!isMoving) return;

    /*
      Make movement camera-relative instead of using fixed room axes.

      This keeps the controls intuitive after the visitor rotates the room:
      - W / ArrowUp always moves deeper into the visible scene
      - S / ArrowDown always moves toward the viewer
      - A / D remain screen-left and screen-right

      The cat lives inside the transformed room group, so convert the camera's
      world-space directions back into that room-local coordinate system.
    */
    const cameraForwardWorld = new Vector3();
    state.camera.getWorldDirection(cameraForwardWorld);
    cameraForwardWorld.y = 0;

    if (cameraForwardWorld.lengthSq() < 0.0001) {
      cameraForwardWorld.set(0, 0, -1);
    }

    cameraForwardWorld.normalize();

    const cameraRightWorld = new Vector3()
      .crossVectors(cameraForwardWorld, new Vector3(0, 1, 0))
      .normalize();

    const parentWorldQuaternion = new Quaternion();
    const inverseParentQuaternion = new Quaternion();

    movementGroup.parent?.getWorldQuaternion(parentWorldQuaternion);
    inverseParentQuaternion.copy(parentWorldQuaternion).invert();

    const cameraForwardLocal = cameraForwardWorld
      .clone()
      .applyQuaternion(inverseParentQuaternion);

    const cameraRightLocal = cameraRightWorld
      .clone()
      .applyQuaternion(inverseParentQuaternion);

    cameraForwardLocal.y = 0;
    cameraRightLocal.y = 0;
    cameraForwardLocal.normalize();
    cameraRightLocal.normalize();

    const movementDirection = new Vector3()
      .addScaledVector(cameraForwardLocal, forwardInput)
      .addScaledVector(cameraRightLocal, rightInput);

    if (movementDirection.lengthSq() > 1) {
      movementDirection.normalize();
    }

    const nextX = MathUtils.clamp(
      movementGroup.position.x + movementDirection.x * WALK_SPEED * delta,
      ROOM_LIMITS.minX,
      ROOM_LIMITS.maxX
    );

    const nextZ = MathUtils.clamp(
      movementGroup.position.z + movementDirection.z * WALK_SPEED * delta,
      ROOM_LIMITS.minZ,
      ROOM_LIMITS.maxZ
    );

    /*
      Resolve X and Z separately instead of rejecting the complete move.
      This lets the cat slide naturally along the edge of furniture when the
      user walks diagonally into a couch, table, ladder, or cabinet.
    */
    if (
      canMoveTo(
        movementGroup.position.x,
        movementGroup.position.z,
        nextX,
        movementGroup.position.z
      )
    ) {
      movementGroup.position.x = nextX;
    }

    if (
      canMoveTo(
        movementGroup.position.x,
        movementGroup.position.z,
        movementGroup.position.x,
        nextZ
      )
    ) {
      movementGroup.position.z = nextZ;
    }

    const targetRotation = Math.atan2(
      movementDirection.x,
      movementDirection.z
    );

    movementGroup.rotation.y = MathUtils.lerp(
      movementGroup.rotation.y,
      targetRotation,
      1 - Math.exp(-12 * delta)
    );
  });

  return (
    <group
      ref={movementGroupRef}
      name="keyboard-controlled-banana-cat"
      position={START_POSITION}
    >
      {/* Soft marker under the cat so its spawn point is immediately visible. */}
      <mesh
        ref={markerRef}
        position={[0, 0.016, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={8}
      >
        <ringGeometry args={[0.42, 0.57, 32]} />
        <meshBasicMaterial
          ref={markerMaterialRef}
          color="#fff0a8"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>

      <group ref={animatedModelRef} scale={MODEL_SCALE} dispose={null}>
        <primitive object={clonedScene} position={originCorrection} />
      </group>
    </group>
  );
}

useGLTF.preload("/cute_cat_in_cute_banana.glb");
