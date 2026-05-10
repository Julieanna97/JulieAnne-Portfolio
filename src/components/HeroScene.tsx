"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { NoToneMapping, SRGBColorSpace } from "three";
import Loader from "../components/Loader";
import IsometricRoom from "../models/IsometricRoom";

function SoftWebsiteGlow() {
  return (
    <group>
      <mesh position={[-3.5, 1.1, -3.8]} rotation={[0, 0.28, 0]}>
        <planeGeometry args={[5.8, 4.2]} />
        <meshBasicMaterial
          color="#ffc3d8"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[3.7, 1.0, -4]} rotation={[0, -0.28, 0]}>
        <planeGeometry args={[6.2, 4.4]} />
        <meshBasicMaterial
          color="#b9ddff"
          transparent
          opacity={0.11}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 3.1, -4.5]}>
        <planeGeometry args={[5.6, 3.2]} />
        <meshBasicMaterial
          color="#fff0c9"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SoftGroundGlow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.28, 0]}>
      <planeGeometry args={[34, 24]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;

            float peachGlow = 1.0 - smoothstep(0.0, 0.78, distance(uv, vec2(0.28, 0.42)));
            float blueGlow = 1.0 - smoothstep(0.0, 0.82, distance(uv, vec2(0.76, 0.42)));
            float creamGlow = 1.0 - smoothstep(0.0, 0.65, distance(uv, vec2(0.5, 0.52)));

            vec3 color = vec3(1.0, 0.94, 0.86);
            color = mix(color, vec3(1.0, 0.72, 0.82), peachGlow * 0.28);
            color = mix(color, vec3(0.72, 0.84, 1.0), blueGlow * 0.25);
            color = mix(color, vec3(1.0, 0.88, 0.62), creamGlow * 0.12);

            float vignette = 1.0 - smoothstep(0.4, 0.92, distance(uv, vec2(0.5, 0.5)));
            color *= 0.95 + vignette * 0.08;

            float edgeFade =
              smoothstep(0.0, 0.18, uv.x) *
              smoothstep(1.0, 0.82, uv.x) *
              smoothstep(0.0, 0.16, uv.y) *
              smoothstep(1.0, 0.82, uv.y);

            gl_FragColor = vec4(color, edgeFade * 0.38);
          }
        `}
      />
    </mesh>
  );
}

const HeroScene = () => {
  return (
    <section className="pointer-events-auto relative h-screen w-full overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 1.7]}
        camera={{
          position: [18, 16, 20],
          fov: 35,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = NoToneMapping;
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={1.0} />

          <hemisphereLight args={["#ffffff", "#f0ebe8", 0.85]} />

          <directionalLight
            position={[5, 8, 5]}
            intensity={1.05}
            color="#ffffff"
            castShadow
          />

          <pointLight
            position={[-4, 3, 4]}
            intensity={0.22}
            distance={11}
            color="#ffc0d2"
          />

          <pointLight
            position={[4, 3, 3]}
            intensity={0.18}
            distance={11}
            color="#b9dcff"
          />

          <SoftWebsiteGlow />
          <SoftGroundGlow />

          <group
            position={[0, -0.45, 0]}
            rotation={[0, -0.72, 0]}
            scale={1}
          >
            <IsometricRoom />
          </group>

          <ContactShadows
            position={[0, -1.15, 0]}
            opacity={0.12}
            scale={10}
            blur={2.8}
            far={4}
            color="#9e938f"
          />

          <OrbitControls
            makeDefault
            target={[0, 5.5, 0]}
            enablePan={false}
            enableZoom
            zoomSpeed={0.15}
            rotateSpeed={0.35}
            minDistance={12}
            maxDistance={30}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.4}
            enableDamping
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default HeroScene;