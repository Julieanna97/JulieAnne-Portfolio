import { Text } from "@react-three/drei";
import NavigationSign from "./NavigationSign";

export default function GroundGraffiti() {
  const name = "JULIE ANNE\nCANTILLEP";

  return (
    <group position={[9, 0, -2.5]}>
      {/* Upright navigation sign positioned near the portfolio title. */}
      <NavigationSign
        position={[-0.35, 0.025, -2.3]}
        rotation={[0, -Math.PI / 7, 0]}
        scale={1.2}
        message={"CLICK &\nDRAG"}
      />

      {/* Text lying flat on the ground. */}
      <group
        position={[0, 0.045, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <Text
          position={[0.065, -0.055, 0.004]}
          fontSize={0.7}
          maxWidth={8}
          lineHeight={0.9}
          letterSpacing={-0.045}
          anchorX="center"
          anchorY="middle"
          color="#ff609f"
          fillOpacity={0.3}
        >
          {name}
        </Text>

        <Text
          position={[0, 0.06, 0.012]}
          fontSize={0.7}
          maxWidth={8}
          lineHeight={0.9}
          letterSpacing={-0.045}
          anchorX="center"
          anchorY="middle"
          color="#f7f1ed"
          outlineWidth={0.018}
          outlineColor="#260d18"
          outlineOpacity={0.68}
          fillOpacity={0.9}
        >
          {name}
        </Text>

        <mesh position={[0, -1.02, 0.008]}>
          <planeGeometry args={[4.6, 0.055]} />

          <meshBasicMaterial
            color="#ff79ad"
            transparent
            opacity={0.48}
          />
        </mesh>

        <Text
          position={[0, -1.26, 0.012]}
          fontSize={0.17}
          maxWidth={8}
          lineHeight={1}
          letterSpacing={0.18}
          anchorX="center"
          anchorY="middle"
          color="#f2d7ff"
          fillOpacity={0.82}
        >
          FULLSTACK DEVELOPER
        </Text>
      </group>
    </group>
  );
}