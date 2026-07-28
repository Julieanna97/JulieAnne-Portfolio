import { Text } from "@react-three/drei";

export default function GroundGraffiti() {
  const name = "JULIE ANNE\nCANTILLEP";

  return (
    <group position={[9, 0, -2.5]}>
      <group
        position={[0, 0.04, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        {/* Black shadow */}
        <Text
          position={[0.08, -0.08, 0.006]}
          fontSize={0.72}
          maxWidth={8}
          lineHeight={0.9}
          letterSpacing={-0.045}
          anchorX="center"
          anchorY="middle"
          color="#000000"
          fillOpacity={0.9}
        >
          {name}
        </Text>

        {/* Main name */}
        <Text
          position={[0, 0.02, 0.012]}
          fontSize={0.72}
          maxWidth={8}
          lineHeight={0.9}
          letterSpacing={-0.045}
          anchorX="center"
          anchorY="middle"
          color="#fff8ff"
          outlineWidth={0.012}
          outlineColor="#31101f"
          outlineOpacity={0.55}
          fillOpacity={0.98}
        >
          {name}
        </Text>

        {/* Subtitle underneath */}
        <Text
          position={[0, -1.38, 0.012]}
          fontSize={0.2}
          maxWidth={8}
          lineHeight={1.35}
          letterSpacing={0.14}
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          color="#f3ebff"
          fillOpacity={0.94}
        >
          {`FULLSTACK DEVELOPER\nEMBEDDED SOFTWARE DEVELOPER\nAI DATA SPECIALIST\n3D WEB`}
        </Text>
      </group>
    </group>
  );
}