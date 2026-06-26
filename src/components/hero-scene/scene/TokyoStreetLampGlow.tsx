"use client";

import { useEffect, useRef } from "react";
import type { Object3D, SpotLight } from "three";

const STREET_LAMP_BULB_POSITION: [
  number,
  number,
  number,
] = [
  6.58,
  4.586,
  7.331,
];

const STREET_LAMP_SPILL_TARGET_POSITION: [
  number,
  number,
  number,
] = [
  4.55,
  0.08,
  6.94,
];

export default function TokyoStreetLampGlow() {
  const spillLightRef =
    useRef<SpotLight>(
      null
    );

  const spillTargetRef =
    useRef<Object3D>(
      null
    );

  useEffect(() => {
    if (
      !spillLightRef.current ||
      !spillTargetRef.current
    ) {
      return;
    }

    spillLightRef.current.target =
      spillTargetRef.current;

    spillLightRef.current.target.updateMatrixWorld();
  }, []);

  return (
    <>
      <object3D
        ref={
          spillTargetRef
        }
        position={
          STREET_LAMP_SPILL_TARGET_POSITION
        }
      />

      <group
        position={
          STREET_LAMP_BULB_POSITION
        }
      >
        <mesh
          position={[
            0,
            0.18,
            -0.03,
          ]}
        >
          <cylinderGeometry
            args={[
              0.014,
              0.014,
              0.24,
              10,
            ]}
          />

          <meshStandardMaterial
            color="#252a31"
            metalness={
              0.82
            }
            roughness={
              0.32
            }
          />
        </mesh>

        <mesh
          position={[
            0,
            0.035,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.17,
              0.22,
              0.17,
            ]}
          />

          <meshStandardMaterial
            color="#231912"
            metalness={
              0.28
            }
            roughness={
              0.72
            }
            emissive="#2a170a"
            emissiveIntensity={
              0.18
            }
          />
        </mesh>

        <mesh
          position={[
            0,
            0.02,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.105,
              0.145,
              0.105,
            ]}
          />

          <meshStandardMaterial
            color="#ffd9a2"
            emissive="#ffbd6d"
            emissiveIntensity={
              1.55
            }
            transparent
            opacity={
              0.92
            }
            toneMapped={
              false
            }
          />
        </mesh>

        <pointLight
          name="frontStreetLampBulb"
          position={[
            0,
            0.02,
            0,
          ]}
          intensity={
            4
          }
          distance={
            7
          }
          decay={
            2
          }
          color="#ffcc88"
        />
      </group>

      <spotLight
        name="frontStreetLampSpill"
        ref={
          spillLightRef
        }
        position={
          STREET_LAMP_BULB_POSITION
        }
        angle={
          1.45
        }
        penumbra={
          1
        }
        intensity={
          6
        }
        distance={
          15
        }
        decay={
          1.8
        }
        color="#ffb86a"
      />

      <pointLight
        name="frontStreetLampLeftGroundFill"
        position={[
          3.8,
          0.18,
          7.1,
        ]}
        intensity={
          2.5
        }
        distance={
          10
        }
        decay={
          1.9
        }
        color="#ffb05a"
      />

      <pointLight
        name="frontStreetLampCenterGroundFill"
        position={[
          5.72,
          0.18,
          7.08,
        ]}
        intensity={
          2
        }
        distance={
          8
        }
        decay={
          1.9
        }
        color="#ffc878"
      />

      <pointLight
        name="frontStreetLampRightGroundFill"
        position={[
          7.4,
          0.18,
          7.2,
        ]}
        intensity={
          1.5
        }
        distance={
          7
        }
        decay={
          2
        }
        color="#ffd090"
      />

      <pointLight
        name="frontStreetLampWideGroundFill"
        position={[
          5.5,
          0.08,
          8.5,
        ]}
        intensity={
          2.5
        }
        distance={
          10
        }
        decay={
          1.8
        }
        color="#ffa840"
      />

      <pointLight
        name="frontStreetLampCanopyBounce"
        position={[
          5.2,
          1.2,
          7,
        ]}
        intensity={
          1.5
        }
        distance={
          6
        }
        decay={
          2
        }
        color="#ffbe6e"
      />
    </>
  );
}
