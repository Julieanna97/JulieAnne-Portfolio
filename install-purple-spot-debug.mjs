import {
  copyFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";

const requestedPath =
  process.argv[2] ?? "src/components/HeroScene.tsx";

const heroScenePath = resolve(requestedPath);

if (!existsSync(heroScenePath)) {
  throw new Error(
    [
      `Could not find: ${heroScenePath}`,
      "",
      "Run this script from your project root, or pass the file path explicitly:",
      "node install-purple-spot-debug.mjs src/components/HeroScene.tsx",
    ].join("\n")
  );
}

const directory = dirname(heroScenePath);
const extension = extname(heroScenePath);
const fileNameWithoutExtension = basename(heroScenePath, extension);

const backupPath = join(
  directory,
  `${fileNameWithoutExtension}.before-purple-debug${extension}`
);

let source = readFileSync(heroScenePath, "utf8");

if (source.includes("PURPLE SPOT DEBUG")) {
  console.log("Purple-spot debugger is already installed.");
  console.log(`No changes written: ${heroScenePath}`);
  process.exit(0);
}

copyFileSync(heroScenePath, backupPath);
console.log(`Backup created: ${backupPath}`);

/*
  1. Add the React Three Fiber event type.
*/
const originalFiberImport =
  'import { Canvas, useThree } from "@react-three/fiber";';

const updatedFiberImport =
  'import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";';

if (source.includes(originalFiberImport)) {
  source = source.replace(originalFiberImport, updatedFiberImport);
} else if (
  !source.includes(
    'import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";'
  )
) {
  throw new Error(
    [
      "Could not update the React Three Fiber import.",
      "Your file may have a differently formatted import statement.",
      `Restore from backup if needed: ${backupPath}`,
    ].join("\n")
  );
}

/*
  2. Preserve the existing moving state and insert the temporary debugger
     directly after it.
*/
const movingStateNeedle =
  "  const [moving, setMoving] = useState(false);";

const debuggerBlock = `  const [moving, setMoving] = useState(false);

  /*
    PURPLE SPOT DEBUG

    Temporary coordinate debugger for the concentrated purple circle.

    Click any visible surface on the 3D model.
    A cyan marker appears at the clicked location.
    The browser console prints the exact world-space coordinates,
    the clicked mesh name, and the surface normal.

    Remove this block after the purple reflection has been adjusted.
  */
  const [debugClickPoint, setDebugClickPoint] = useState<
    [number, number, number] | null
  >(null);

  const handlePurpleSpotDebugClick = (
    event: ThreeEvent<MouseEvent>
  ) => {
    event.stopPropagation();

    const { x, y, z } = event.point;

    const clickedPosition: [number, number, number] = [
      Number(x.toFixed(3)),
      Number(y.toFixed(3)),
      Number(z.toFixed(3)),
    ];

    const worldNormal = event.face?.normal?.clone();

    if (worldNormal) {
      worldNormal.transformDirection(event.object.matrixWorld);
    }

    setDebugClickPoint(clickedPosition);

    console.group(
      "%cPURPLE SPOT DEBUG",
      "color: #ff70c8; font-weight: 800;"
    );

    console.log(
      "Clicked mesh:",
      event.object.name || "(unnamed mesh)"
    );

    console.log("World position:", clickedPosition);

    if (worldNormal) {
      console.log("World normal:", [
        Number(worldNormal.x.toFixed(3)),
        Number(worldNormal.y.toFixed(3)),
        Number(worldNormal.z.toFixed(3)),
      ]);
    }

    console.log(
      \`Copy position: [\${clickedPosition[0]}, \${clickedPosition[1]}, \${clickedPosition[2]}]\`
    );

    console.groupEnd();
  };`;

if (!source.includes(movingStateNeedle)) {
  throw new Error(
    [
      'Could not find: const [moving, setMoving] = useState(false);',
      "No updated file was written.",
      `Your original file is preserved at: ${backupPath}`,
    ].join("\n")
  );
}

source = source.replace(movingStateNeedle, debuggerBlock);

/*
  3. Wrap the existing model with a click handler and add a cyan marker.
     No lighting, bloom, camera, style, or portfolio content is changed.
*/
const originalModelRender =
  "      <MysteriousAdventureModel />";

const updatedModelRender = `      <group onClick={handlePurpleSpotDebugClick}>
        <MysteriousAdventureModel />
      </group>

      {debugClickPoint && (
        <mesh position={debugClickPoint} renderOrder={999}>
          <sphereGeometry args={[0.11, 18, 18]} />
          <meshBasicMaterial
            color="#00ffff"
            toneMapped={false}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      )}`;

if (!source.includes(originalModelRender)) {
  throw new Error(
    [
      "Could not find the existing <MysteriousAdventureModel /> render.",
      "No updated file was written.",
      `Your original file is preserved at: ${backupPath}`,
    ].join("\n")
  );
}

source = source.replace(originalModelRender, updatedModelRender);

writeFileSync(heroScenePath, source, "utf8");

console.log("");
console.log("Purple-spot debugger installed successfully.");
console.log(`Updated file: ${heroScenePath}`);
console.log(`Original backup: ${backupPath}`);
console.log("");
console.log("Next:");
console.log("1. Run your site.");
console.log("2. Open the browser console with F12.");
console.log("3. Click directly on the concentrated purple circle.");
console.log('4. Copy the "Clicked mesh:" and "Copy position:" lines.');