import { ContactShadows } from "@react-three/drei";

export default function ConcreteRooftopGround() {
  return (
    <>
      <mesh
        position={[
          0,
          -0.055,
          0,
        ]}
        rotation={[
          -Math.PI /
            2,
          0,
          0,
        ]}
        receiveShadow
      >
        <planeGeometry
          args={[
            90,
            90,
          ]}
        />

        <meshStandardMaterial
          color="#030305"
          roughness={
            0.96
          }
          metalness={
            0.02
          }
        />
      </mesh>

      <ContactShadows
        position={[
          0,
          -0.025,
          0,
        ]}
        opacity={
          0.24
        }
        scale={
          38
        }
        blur={
          4
        }
        far={
          9
        }
        color="#000000"
      />
    </>
  );
}
