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
  Keep the cat inside the full walkable lower floor. Furniture collisions
  below prevent clipping through objects while these boundaries prevent the
  character from leaving the room entirely.
*/
const ROOM_LIMITS = {
  /*
    Include the complete walkable lower floor:
    - bathroom on the left
    - living room in the center
    - kitchen and the entrance area toward the back

    The previous values started at x = 0.55 and z = -5.55, which
    unintentionally prevented the cat from reaching the bathroom and the
    entrance rug.
  */
  /*
    Leave enough clearance for the visible banana-cat mesh, not only its
    movement origin. The model is wider than its center point, so allowing
    the origin to reach x = -8.0 made part of the character disappear into
    the solid wall beside the wardrobe.
  */
  minX: -7.68,
  maxX: 7.82,
  minZ: -7.72,
  maxZ: 6.72,
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

  /*
    Optional collider-specific buffer. Narrow obstacles such as the ladder
    base and glass wall use a smaller value so real walkable gaps remain open.
  */
  padding?: number;
};

/*
  A smaller default buffer keeps the cat from clipping into furniture while
  still allowing it to walk through the intentionally narrow gap between the
  sofa and ladder.
*/
const CHARACTER_RADIUS = 0.18;

const FLOOR_COLLIDERS: FloorCollider[] = [
  /* Living-room furniture */
  {
    name: "sofa",
    minX: 0.28,
    maxX: 2.96,
    minZ: 1.23,
    maxZ: 6.26,
    padding: 0.1,
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

  /*
    Block only the LOW wooden section of the slanted ladder.

    The upper half of the ladder is raised above the cat's head, so the cat
    should be allowed to walk behind / underneath that area to reach the
    bathroom. Blocking the entire projected ladder footprint closes the real
    passage. Blocking only the feet allows clipping through the lowest rungs.

    These bounds cover the lower feet and the first low rungs, which are the
    parts that physically intersect the cat at floor level.
  */
  {
    name: "ladder-low-clearance-section",
    minX: 2.68,
    maxX: 3.96,
    minZ: -2.02,
    maxZ: 0.6,
    padding: 0.035,
  },

  /*
    Bathroom wall, glass divider, and folded brown door.

    These rectangles follow the actual GLB mesh bounds instead of using two
    oversized guessed wall sections. The real doorway stays open between the
    folded door and the glass divider, while the cat can no longer clip
    through the solid wall to the right of the brown bathroom entrance.
  */
  {
    name: "bathroom-hall-solid-wall",
    minX: -8.42,
    maxX: -0.02,
    minZ: -2.82,
    maxZ: -2.58,
    padding: 0.06,
  },
  {
    name: "bathroom-glass-divider",
    minX: -0.34,
    maxX: -0.04,
    minZ: 0.7,
    maxZ: 7.2,
    padding: 0.08,
  },
  {
    name: "bathroom-folded-door-front",
    minX: -1.9,
    maxX: -0.1,
    minZ: -2.68,
    maxZ: -1.92,
    padding: 0.05,
  },
  {
    name: "bathroom-folded-door-side",
    minX: -1.9,
    maxX: -0.12,
    minZ: -2.02,
    maxZ: -1.2,
    padding: 0.05,
  },

  /* The cactus lamp needs its own small floor footprint. */
  {
    name: "cactus-lamp",
    minX: 6.5,
    maxX: 7.2,
    minZ: 0.03,
    maxZ: 0.75,
  },

  /*
    Tall wardrobe / cabinet beside the entrance door.

    Block the complete lower-floor footprint with enough visual clearance
    for the wider banana-cat model. Keep the collider simple and solid so
    there are no small corner gaps for the cat to slip into.
  */
  {
    name: "entrance-wardrobe-solid-volume",
    minX: -8.52,
    maxX: -5.5,
    minZ: -8.5,
    maxZ: -2.3,
    padding: 0,
  },

  /*
    Extra front lip for the wardrobe / adjacent wall corner.

    This stops the visible banana shell before it appears inside the wall to
    the left of the cabinet, while leaving the actual door route open on the
    other side of the wardrobe.
  */
  {
    name: "entrance-wardrobe-front-lip",
    minX: -8.56,
    maxX: -5.34,
    minZ: -3.16,
    maxZ: -1.96,
    padding: 0,
  },

  /* Kitchen furniture. Keep the entrance rug on the left accessible. */
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

  /*
    Bathroom fixtures are blocked individually rather than blocking the
    entire bathroom. This lets the cat walk into the bathroom and move around
    the open floor while still respecting the tub, sink, and toilet.
  */
  {
    name: "bathtub",
    minX: -8.21,
    maxX: -1.37,
    minZ: 3.18,
    maxZ: 6.51,
  },
  {
    name: "bathroom-sink",
    minX: -8.25,
    maxX: -6.61,
    minZ: 0.62,
    maxZ: 2.53,
  },
  {
    name: "toilet",
    minX: -8.3,
    maxX: -5.78,
    minZ: -2.03,
    maxZ: -0.4,
  },
];

const getFurniturePenetration = (x: number, z: number) => {
  return FLOOR_COLLIDERS.reduce((total, collider) => {
    const padding = collider.padding ?? CHARACTER_RADIUS;

    const minX = collider.minX - padding;
    const maxX = collider.maxX + padding;
    const minZ = collider.minZ - padding;
    const maxZ = collider.maxZ + padding;

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
      <group ref={animatedModelRef} scale={MODEL_SCALE} dispose={null}>
        <primitive object={clonedScene} position={originCorrection} />
      </group>
    </group>
  );
}

useGLTF.preload("/cute_cat_in_cute_banana.glb");
