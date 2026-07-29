"use client";

import {
  Center,
  Text3D,
} from "@react-three/drei";

const FONT_URL =
  "/fonts/helvetiker_bold.typeface.json";

type ExtrudedTextProps = {
  text: string;
  position: [
    number,
    number,
    number,
  ];
  size: number;
  height: number;
  letterSpacing?: number;
  lineHeight?: number;
  frontColor?: string;
  sideColor?: string;
  emissiveColor?: string;
  emissiveIntensity?: number;
};

function ExtrudedText({
  text,
  position,
  size,
  height,
  letterSpacing = 0,
  lineHeight = 1,
  frontColor = "#fff8ff",
  sideColor = "#351126",
  emissiveColor = "#7b315f",
  emissiveIntensity = 0.16,
}: ExtrudedTextProps) {
  return (
    <Center position={position}>
      <Text3D
        font={FONT_URL}
        size={size}
        height={height}
        curveSegments={8}
        bevelEnabled
        bevelThickness={
          height * 0.2
        }
        bevelSize={
          Math.min(
            size * 0.025,
            0.018
          )
        }
        bevelOffset={0}
        bevelSegments={3}
        letterSpacing={
          letterSpacing
        }
        lineHeight={lineHeight}
        castShadow
        receiveShadow
      >
        {text}

        {/*
          Front and back faces.
        */}
        <meshStandardMaterial
          attach="material-0"
          color={frontColor}
          emissive={
            emissiveColor
          }
          emissiveIntensity={
            emissiveIntensity
          }
          roughness={0.3}
          metalness={0.12}
        />

        {/*
          Extruded side faces.
        */}
        <meshStandardMaterial
          attach="material-1"
          color={sideColor}
          emissive="#160710"
          emissiveIntensity={0.08}
          roughness={0.52}
          metalness={0.05}
        />
      </Text3D>
    </Center>
  );
}

export default function GroundGraffiti() {
  return (
    <group
      position={[
        9,
        0.045,
        -2.5,
      ]}
      rotation={[
        -Math.PI / 2,
        0,
        Math.PI / 2,
      ]}
    >
      {/*
        Main extruded name.
      */}
      <ExtrudedText
        text={
          "JULIE ANNE\nCANTILLEP"
        }
        position={[
          0,
          0.38,
          0,
        ]}
        size={0.7}
        height={0.11}
        lineHeight={0.9}
        letterSpacing={-0.04}
        frontColor="#fff8ff"
        sideColor="#351126"
        emissiveColor="#a44c88"
        emissiveIntensity={0.18}
      />

      {/*
        Smaller extruded subtitle.
      */}
      <ExtrudedText
        text={
          "FULLSTACK DEVELOPER\nEMBEDDED SOFTWARE DEVELOPER\nAI DATA SPECIALIST\n3D WEB"
        }
        position={[
          0,
          -1.42,
          0,
        ]}
        size={0.17}
        height={0.035}
        lineHeight={1.38}
        letterSpacing={0.08}
        frontColor="#f5eaff"
        sideColor="#28142d"
        emissiveColor="#6f4a86"
        emissiveIntensity={0.12}
      />
    </group>
  );
}