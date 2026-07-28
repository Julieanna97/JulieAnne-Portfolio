"use client";

import { Billboard, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  CanvasTexture,
  Color,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
} from "three";

type SakuraGLTF = {
  nodes: {
    Object001_mossybark02_0Mat_0: {
      geometry: any;
    };
    Object002_sakura_branch_new01_1Mat_0: {
      geometry: any;
    };
  };
  materials: {
    mossybark02_0Mat: MeshStandardMaterial;
    sakura_branch_new01_1Mat: MeshStandardMaterial;
  };
};

/*
  Keep the tree position outside the component so the same stable array
  is shared by the tree and both ground-petal layers.
*/
const RIGHT_TREE_BASE: [number, number, number] = [
  7.2,
  -0.04,
  -15.8,
];

function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createPetalTexture() {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, 128, 128);
  ctx.translate(64, 64);

  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.bezierCurveTo(18, -26, 28, -10, 18, 10);
  ctx.bezierCurveTo(12, 22, 4, 30, 0, 36);
  ctx.bezierCurveTo(-4, 30, -12, 22, -18, 10);
  ctx.bezierCurveTo(-28, -10, -18, -26, 0, -28);
  ctx.closePath();

  const gradient = ctx.createLinearGradient(0, -28, 0, 36);
  gradient.addColorStop(0, "rgba(255,235,246,1)");
  gradient.addColorStop(0.45, "rgba(255,182,220,1)");
  gradient.addColorStop(1, "rgba(255,129,191,1)");

  ctx.fillStyle = gradient;
  ctx.shadowColor = "rgba(255,140,210,0.25)";
  ctx.shadowBlur = 8;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(0, 20);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function GroundPetals({
  center,
  petalTexture,
  count = 42,
  radiusX = 2.5,
  radiusZ = 2.2,
}: {
  center: [number, number, number];
  petalTexture: CanvasTexture | null;
  count?: number;
  radiusX?: number;
  radiusZ?: number;
}) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const distX = Math.random() * radiusX;
        const distZ = Math.random() * radiusZ;

        return {
          x: center[0] + Math.cos(angle) * distX,
          y: center[1] + 0.013 + Math.random() * 0.008,
          z: center[2] + Math.sin(angle) * distZ,
          rotY: Math.random() * Math.PI * 2,
          rotZ: Math.random() * Math.PI * 2,
          scaleX: randomRange(0.12, 0.2),
          scaleY: randomRange(0.16, 0.24),
          opacity: randomRange(0.35, 0.68),
          color: Math.random() > 0.5 ? "#ffb9df" : "#ffd7ec",
        };
      }),
    [center, count, radiusX, radiusZ]
  );

  return (
    <group>
      {petals.map((petal, index) => (
        <mesh
          key={index}
          position={[petal.x, petal.y, petal.z]}
          rotation={[-Math.PI / 2, petal.rotY, petal.rotZ]}
          scale={[petal.scaleX, petal.scaleY, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={petalTexture ?? undefined}
            alphaMap={petalTexture ?? undefined}
            color={petal.color}
            transparent
            opacity={petal.opacity}
            side={DoubleSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function SakuraTree({
  position,
  rotation = [0, 0, 0],
  scale = 0.43,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { nodes, materials } = useGLTF(
    "/sakura.glb"
  ) as unknown as SakuraGLTF;

  const barkMaterial = useMemo(() => {
    const mat = materials.mossybark02_0Mat.clone();
    mat.color = new Color("#5b3a2e");
    mat.roughness = 0.96;
    mat.metalness = 0.02;
    mat.emissive = new Color("#24120f");
    mat.emissiveIntensity = 0.06;
    return mat;
  }, [materials.mossybark02_0Mat]);

  const blossomMaterial = useMemo(() => {
    const mat = materials.sakura_branch_new01_1Mat.clone();
    mat.color = new Color("#f5a7d2");
    mat.roughness = 0.88;
    mat.metalness = 0.01;
    mat.emissive = new Color("#ff78c8");
    mat.emissiveIntensity = 0.16;
    return mat;
  }, [materials.sakura_branch_new01_1Mat]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group scale={0.01}>
        <group
          position={[-100.419, 1682.519, -57.096]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object001_mossybark02_0Mat_0.geometry}
            material={barkMaterial}
            position={[-5246.426, -139.037, -1682.519]}
          />
        </group>

        <group
          position={[-311.737, 2156.01, -26.624]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object002_sakura_branch_new01_1Mat_0.geometry}
            material={blossomMaterial}
            position={[-5005.651, -106.103, -2156.01]}
          />
        </group>
      </group>

      <pointLight
        position={[0, 2.7, 0]}
        intensity={1.05}
        distance={8}
        color="#ff8bcd"
      />
      <pointLight
        position={[1.2, 3.8, 1]}
        intensity={0.8}
        distance={7}
        color="#ffb0df"
      />
      <pointLight
        position={[-1.4, 3.6, -1.1]}
        intensity={0.75}
        distance={7}
        color="#d79cff"
      />
      <pointLight
        position={[0.2, 4.7, -0.6]}
        intensity={0.68}
        distance={6}
        color="#ffc0e9"
      />
    </group>
  );
}

function SceneMoon() {
  return (
    <Billboard position={[-26, 18, -46]} follow>
      <group>
        <mesh position={[0, 0, -0.03]}>
          <circleGeometry args={[4.2, 64]} />
          <meshBasicMaterial
            color="#9e8dff"
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[3.2, 64]} />
          <meshBasicMaterial
            color="#cbbcff"
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>

        <mesh>
          <circleGeometry args={[2.1, 64]} />
          <meshBasicMaterial
            color="#f7f4ff"
            transparent
            opacity={0.96}
          />
        </mesh>
      </group>
    </Billboard>
  );
}

function FallingPetals() {
  const petalRefs = useRef<(Mesh | null)[]>([]);
  const petalTexture = useMemo(() => createPetalTexture(), []);

  const petals = useMemo(
    () =>
      Array.from({ length: 42 }, () => ({
        x: randomRange(0, 12),
        y: randomRange(1.5, 8.2),
        z: randomRange(-10, 1),
        speed: randomRange(0.18, 0.42),
        sway: randomRange(0.1, 0.22),
        wobble: randomRange(1, 2.2),
        driftZ: randomRange(-0.05, 0.05),
        spinX: randomRange(-1.1, 1.1),
        spinY: randomRange(-0.8, 0.8),
        spinZ: randomRange(-1.5, 1.5),
        scaleX: randomRange(0.08, 0.12),
        scaleY: randomRange(0.12, 0.18),
        seed: Math.random() * 1000,
        opacity: randomRange(0.55, 0.85),
        color: Math.random() > 0.5 ? "#ffb6df" : "#ffd5ea",
      })),
    []
  );

  useFrame((state, delta) => {
    petals.forEach((petal, index) => {
      const mesh = petalRefs.current[index];
      if (!mesh) return;

      petal.y -= petal.speed * delta;
      petal.x +=
        Math.sin(state.clock.elapsedTime * petal.wobble + petal.seed) *
        petal.sway *
        delta;
      petal.z += petal.driftZ * delta;

      if (petal.y < 0.03) {
        petal.x = randomRange(0, 12);
        petal.y = randomRange(7.4, 9.2);
        petal.z = randomRange(-10, 1);
      }

      mesh.position.set(petal.x, petal.y, petal.z);
      mesh.rotation.x += petal.spinX * delta;
      mesh.rotation.y += petal.spinY * delta;
      mesh.rotation.z += petal.spinZ * delta;
    });
  });

  return (
    <group>
      {petals.map((petal, index) => (
        <mesh
          key={index}
          ref={(el) => {
            petalRefs.current[index] = el;
          }}
          position={[petal.x, petal.y, petal.z]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
          scale={[petal.scaleX, petal.scaleY, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={petalTexture ?? undefined}
            alphaMap={petalTexture ?? undefined}
            color={petal.color}
            transparent
            opacity={petal.opacity}
            side={DoubleSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function SakuraAtmosphere() {
  const petalTexture = useMemo(() => createPetalTexture(), []);

  return (
    <group>
      <SceneMoon />
      <FallingPetals />

      {/*
        Dense petal pile directly beneath and around the tree trunk.
      */}
      <GroundPetals
        center={RIGHT_TREE_BASE}
        petalTexture={petalTexture}
        count={72}
        radiusX={1.65}
        radiusZ={1.35}
      />

      {/*
        A lighter outer scatter prevents the pile from ending in a hard ring.
      */}
      <GroundPetals
        center={RIGHT_TREE_BASE}
        petalTexture={petalTexture}
        count={36}
        radiusX={3.2}
        radiusZ={2.55}
      />

      <SakuraTree
        position={RIGHT_TREE_BASE}
        rotation={[0, -1.08, 0]}
        scale={0.43}
      />
    </group>
  );
}

useGLTF.preload("/sakura.glb");