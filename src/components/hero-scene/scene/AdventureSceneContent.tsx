"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Bloom, EffectComposer, SSAO, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { PerspectiveCamera } from "three";
import { MOUSE, TOUCH, Vector3 } from "three";
import gsap from "gsap";

import MysteriousAdventureModel from "../../../models/MysteriousAdventureModel";
import type { ProjectId, SectionId } from "../types";
import {
  ABOUT_CAMERA_MOBILE,
  CREDITS_CAMERA_MOBILE,
  ENABLE_LIGHT_DEBUGGER,
  HOME_CAMERA_DESKTOP,
  HOME_CAMERA_MOBILE,
  HOME_TARGET,
  INTRO_CAMERA,
  INTRO_STREET_CAMERA_DESKTOP,
  INTRO_STREET_CAMERA_MOBILE,
  INTRO_STREET_TARGET,
  INTRO_TARGET,
  INTRO_ZOOM_DURATION,
  PROJECTS_CAMERA_MOBILE,
  SECTIONS,
} from "../sceneConfig";

import NumberHotspot from "../annotations/NumberHotspot";
import GroundGraffiti from "./GroundGraffiti";
import ConcreteRooftopGround from "./ConcreteRooftopGround";
import TokyoStreetLampGlow from "./TokyoStreetLampGlow";
import TrainStreetLampGlow from "./TrainStreetLampGlow";
import BackAlleyPinkGlow from "./BackAlleyPinkGlow";
import RooftopVideoAdvertisement from "./RooftopVideoAdvertisement";
import SquareWallVideoAdvertisement from "./SquareWallVideoAdvertisement";

export default function AdventureSceneContent({
  viewportWidth,
  activeId,
  onActiveChange,
  onProjectSelect,
  onOpenSectionDetail,
  onSceneReady,
}: {
  viewportWidth:
    number;

  activeId:
    | SectionId
    | null;

  onActiveChange: (
    id:
      | SectionId
      | null
  ) => void;

  onProjectSelect: (
    id:
      ProjectId
  ) => void;

  onOpenSectionDetail: (
    id:
      "about" | "credits"
  ) => void;

  onSceneReady?:
    () => void;
}) {
  const {
    camera,
    scene,
  } =
    useThree();

  const controlsRef =
    useRef<any>(
      null
    );

  const readyRef =
    useRef(
      false
    );

  const introTimelineRef =
    useRef<
      | gsap.core.Timeline
      | null
    >(
      null
    );

  const [
    moving,
    setMoving,
  ] =
    useState(
      false
    );

  const [
    debugClickPoint,
    setDebugClickPoint,
  ] =
    useState<
      | [
          number,
          number,
          number,
        ]
      | null
    >(
      null
    );

  const compact =
    viewportWidth <
    768;

  const homeCamera =
    compact
      ? HOME_CAMERA_MOBILE
      : HOME_CAMERA_DESKTOP;

  const handleLightDebugClick = (
    event:
      ThreeEvent<MouseEvent>
  ) => {
    if (
      !ENABLE_LIGHT_DEBUGGER
    ) {
      return;
    }

    event.stopPropagation();

    const {
      x,
      y,
      z,
    } =
      event.point;

    const clickedPosition: [
      number,
      number,
      number,
    ] = [
      Number(
        x.toFixed(
          3
        )
      ),

      Number(
        y.toFixed(
          3
        )
      ),

      Number(
        z.toFixed(
          3
        )
      ),
    ];

    const worldNormal =
      event.face?.normal?.clone();

    if (
      worldNormal
    ) {
      worldNormal.transformDirection(
        event.object.matrixWorld
      );
    }

    setDebugClickPoint(
      clickedPosition
    );

    console.group(
      "%cLIGHT POSITION DEBUG",
      "color: #ff70c8; font-weight: 800;"
    );

    console.log(
      "Clicked mesh:",
      event.object.name ||
        "(unnamed mesh)"
    );

    console.log(
      "World position:",
      clickedPosition
    );

    if (
      worldNormal
    ) {
      console.log(
        "World normal:",
        [
          Number(
            worldNormal.x.toFixed(
              3
            )
          ),

          Number(
            worldNormal.y.toFixed(
              3
            )
          ),

          Number(
            worldNormal.z.toFixed(
              3
            )
          ),
        ]
      );
    }

    const nearbyLights: Array<{
      name:
        string;

      type:
        string;

      color:
        string;

      intensity:
        | number
        | string;

      range:
        | number
        | string;

      distanceFromClick:
        number;

      worldPosition:
        string;
    }> =
      [];

    scene.traverse(
      (
        object
      ) => {
        const possibleLight =
          object as typeof object & {
            isLight?:
              boolean;

            color?: {
              getHexString?: () => string;
            };

            intensity?:
              number;

            distance?:
              number;
          };

        if (
          !possibleLight.isLight
        ) {
          return;
        }

        const lightPosition =
          new Vector3();

        possibleLight.getWorldPosition(
          lightPosition
        );

        nearbyLights.push(
          {
            name:
              possibleLight.name ||
              "(unnamed light)",

            type:
              possibleLight.type,

            color:
              possibleLight.color
                ?.getHexString
                ? `#${possibleLight.color.getHexString()}`
                : "(no color)",

            intensity:
              typeof possibleLight.intensity ===
              "number"
                ? Number(
                    possibleLight.intensity.toFixed(
                      3
                    )
                  )
                : "(not available)",

            range:
              typeof possibleLight.distance ===
              "number"
                ? Number(
                    possibleLight.distance.toFixed(
                      3
                    )
                  )
                : "(not available)",

            distanceFromClick:
              Number(
                lightPosition
                  .distanceTo(
                    event.point
                  )
                  .toFixed(
                    3
                  )
              ),

            worldPosition:
              `[${lightPosition.x.toFixed(
                3
              )}, ${lightPosition.y.toFixed(
                3
              )}, ${lightPosition.z.toFixed(
                3
              )}]`,
          }
        );
      }
    );

    nearbyLights.sort(
      (
        first,
        second
      ) =>
        first.distanceFromClick -
        second.distanceFromClick
    );

    console.log(
      "Nearby scene lights, closest first:"
    );

    console.table(
      nearbyLights.slice(
        0,
        20
      )
    );

    const clickedObject =
      event.object as typeof event.object & {
        material?:
          any;
      };

    const clickedMaterials =
      Array.isArray(
        clickedObject.material
      )
        ? clickedObject.material
        : [
            clickedObject.material,
          ];

    const materialRows =
      clickedMaterials
        .filter(
          Boolean
        )
        .map(
          (
            material:
              any
          ) => ({
            name:
              material.name ||
              "(unnamed material)",

            type:
              material.type ||
              "(unknown type)",

            color:
              material.color
                ?.getHexString
                ? `#${material.color.getHexString()}`
                : "(no color)",

            emissive:
              material.emissive
                ?.getHexString
                ? `#${material.emissive.getHexString()}`
                : "(no emissive color)",

            emissiveIntensity:
              typeof material.emissiveIntensity ===
              "number"
                ? Number(
                    material.emissiveIntensity.toFixed(
                      3
                    )
                  )
                : "(not available)",

            transparent:
              Boolean(
                material.transparent
              ),

            opacity:
              typeof material.opacity ===
              "number"
                ? Number(
                    material.opacity.toFixed(
                      3
                    )
                  )
                : "(not available)",
          })
        );

    console.log(
      "Clicked material:"
    );

    console.table(
      materialRows
    );

    console.log(
      `Copy position: [${clickedPosition[0]}, ${clickedPosition[1]}, ${clickedPosition[2]}]`
    );

    console.groupEnd();
  };

  const lockCamera =
    useCallback(
      (
        nextCamera: [
          number,
          number,
          number,
        ],

        nextTarget: [
          number,
          number,
          number,
        ]
      ) => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        camera.position.set(
          ...nextCamera
        );

        controls.target.set(
          ...nextTarget
        );

        controls.update();
      },
      [
        camera,
      ]
    );

  const stopCameraTweens =
    useCallback(
      () => {
        introTimelineRef.current?.kill();

        introTimelineRef.current =
          null;

        gsap.killTweensOf(
          camera.position
        );

        if (
          controlsRef.current
        ) {
          gsap.killTweensOf(
            controlsRef.current.target
          );

          controlsRef.current.update();
        }
      },
      [
        camera,
      ]
    );

  useEffect(() => {
    const perspectiveCamera =
      camera as PerspectiveCamera;

    perspectiveCamera.fov =
      compact
        ? 43
        : 36;

    perspectiveCamera.updateProjectionMatrix();
  }, [
    camera,
    compact,
  ]);

  const moveCamera =
    useCallback(
      (
        nextCamera: [
          number,
          number,
          number,
        ],

        nextTarget: [
          number,
          number,
          number,
        ],

        duration =
          1.35
      ) => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        stopCameraTweens();

        setMoving(
          true
        );

        const timeline =
          gsap.timeline(
            {
              onUpdate:
                () => {
                  controls.update();
                },

              onComplete:
                () => {
                  lockCamera(
                    nextCamera,
                    nextTarget
                  );

                  setMoving(
                    false
                  );
                },
            }
          );

        timeline.to(
          camera.position,
          {
            x:
              nextCamera[
                0
              ],

            y:
              nextCamera[
                1
              ],

            z:
              nextCamera[
                2
              ],

            duration,

            ease:
              "power3.inOut",
          },
          0
        );

        timeline.to(
          controls.target,
          {
            x:
              nextTarget[
                0
              ],

            y:
              nextTarget[
                1
              ],

            z:
              nextTarget[
                2
              ],

            duration,

            ease:
              "power3.inOut",
          },
          0
        );
      },
      [
        camera,
        lockCamera,
        stopCameraTweens,
      ]
    );

  /*
    Closing a popup only hides the text card.

    The camera stays exactly where it is.
    There is no zoom-out, rotation, or return to the full-model view.
  */
  const closeAnnotation =
    useCallback(
      () => {
        onActiveChange(
          null
        );
      },
      [
        onActiveChange,
      ]
    );

  /*
    One continuous sideways movement for About Me.
  */
  const moveToAboutDoor =
    useCallback(
      (
        section:
          PortfolioSection
      ) => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        const finalCamera =
          compact
            ? ABOUT_CAMERA_MOBILE
            : section.camera;

        stopCameraTweens();

        setMoving(
          true
        );

        const timeline =
          gsap.timeline(
            {
              onUpdate:
                () => {
                  controls.update();
                },

              onComplete:
                () => {
                  lockCamera(
                    finalCamera,
                    section.focus
                  );

                  setMoving(
                    false
                  );
                },
            }
          );

        timeline.to(
          camera.position,
          {
            x:
              finalCamera[
                0
              ],

            y:
              finalCamera[
                1
              ],

            z:
              finalCamera[
                2
              ],

            duration:
              1.65,

            ease:
              "power3.inOut",
          },
          0
        );

        timeline.to(
          controls.target,
          {
            x:
              section.focus[
                0
              ],

            y:
              section.focus[
                1
              ],

            z:
              section.focus[
                2
              ],

            duration:
              1.65,

            ease:
              "power3.inOut",
          },
          0
        );
      },
      [
        camera,
        compact,
        lockCamera,
        stopCameraTweens,
      ]
    );

  /*
    One continuous low storefront movement for Projects.
  */
  const moveToProjectsStorefront =
    useCallback(
      (
        section:
          PortfolioSection
      ) => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        const finalCamera =
          compact
            ? PROJECTS_CAMERA_MOBILE
            : section.camera;

        stopCameraTweens();

        setMoving(
          true
        );

        const timeline =
          gsap.timeline(
            {
              onUpdate:
                () => {
                  controls.update();
                },

              onComplete:
                () => {
                  lockCamera(
                    finalCamera,
                    section.focus
                  );

                  setMoving(
                    false
                  );
                },
            }
          );

        timeline.to(
          camera.position,
          {
            x:
              finalCamera[
                0
              ],

            y:
              finalCamera[
                1
              ],

            z:
              finalCamera[
                2
              ],

            duration:
              1.55,

            ease:
              "power3.inOut",
          },
          0
        );

        timeline.to(
          controls.target,
          {
            x:
              section.focus[
                0
              ],

            y:
              section.focus[
                1
              ],

            z:
              section.focus[
                2
              ],

            duration:
              1.55,

            ease:
              "power3.inOut",
          },
          0
        );
      },
      [
        camera,
        compact,
        lockCamera,
        stopCameraTweens,
      ]
    );

  /*
    Direct Credits rooftop movement.
  */
  const moveToCreditsRooftop =
    useCallback(
      (
        section:
          PortfolioSection
      ) => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        const finalCamera =
          compact
            ? CREDITS_CAMERA_MOBILE
            : section.camera;

        stopCameraTweens();

        setMoving(
          true
        );

        const timeline =
          gsap.timeline(
            {
              onUpdate:
                () => {
                  controls.update();
                },

              onComplete:
                () => {
                  lockCamera(
                    finalCamera,
                    section.focus
                  );

                  introTimelineRef.current =
                    null;

                  setMoving(
                    false
                  );
                },

              onInterrupt:
                () => {
                  introTimelineRef.current =
                    null;

                  setMoving(
                    false
                  );
                },
            }
          );

        introTimelineRef.current =
          timeline;

        timeline.to(
          camera.position,
          {
            x:
              finalCamera[
                0
              ],

            y:
              finalCamera[
                1
              ],

            z:
              finalCamera[
                2
              ],

            duration:
              1.35,

            ease:
              "power3.inOut",
          },
          0
        );

        timeline.to(
          controls.target,
          {
            x:
              section.focus[
                0
              ],

            y:
              section.focus[
                1
              ],

            z:
              section.focus[
                2
              ],

            duration:
              1.35,

            ease:
              "power3.inOut",
          },
          0
        );
      },
      [
        camera,
        compact,
        lockCamera,
        stopCameraTweens,
      ]
    );

  const selectSection =
    useCallback(
      (
        section:
          PortfolioSection
      ) => {
        if (
          moving
        ) {
          return;
        }

        onActiveChange(
          section.id
        );

        if (
          section.id ===
          "about"
        ) {
          moveToAboutDoor(
            section
          );

          return;
        }

        if (
          section.id ===
          "projects"
        ) {
          moveToProjectsStorefront(
            section
          );

          return;
        }

        if (
          section.id ===
          "credits"
        ) {
          moveToCreditsRooftop(
            section
          );

          return;
        }

        moveCamera(
          section.camera,
          section.focus
        );
      },
      [
        moveCamera,
        moveToAboutDoor,
        moveToProjectsStorefront,
        moveToCreditsRooftop,
        moving,
        onActiveChange,
      ]
    );

  useEffect(() => {
    const handleSelection =
      (
        event:
          Event
      ) => {
        const customEvent =
          event as CustomEvent<{
            id?:
              SectionId;
          }>;

        const requestedId =
          customEvent.detail
            ?.id;

        const section =
          SECTIONS.find(
            (
              item
            ) =>
              item.id ===
              requestedId
          );

        if (
          section
        ) {
          selectSection(
            section
          );
        }
      };

    window.addEventListener(
      "adventure:select",
      handleSelection
    );

    return () => {
      window.removeEventListener(
        "adventure:select",
        handleSelection
      );
    };
  }, [
    selectSection,
  ]);

  /*
    First-entry intro animation.

    This is one direct movement:
    - start at the wide view,
    - immediately zoom into the final bicycle-and-road-sign view,
    - remain at the final position.

    There is no midpoint, overlap, pause, or automatic zoom-out.
  */
  useEffect(() => {
    const handleIntro =
      () => {
        const controls =
          controlsRef.current;

        if (
          !controls
        ) {
          return;
        }

        const closeupCamera =
          compact
            ? INTRO_STREET_CAMERA_MOBILE
            : INTRO_STREET_CAMERA_DESKTOP;

        stopCameraTweens();

        setMoving(
          true
        );

        lockCamera(
          INTRO_CAMERA,
          INTRO_TARGET
        );

        const timeline =
          gsap.timeline(
            {
              onUpdate:
                () => {
                  controls.update();
                },

              onComplete:
                () => {
                  lockCamera(
                    closeupCamera,
                    INTRO_STREET_TARGET
                  );

                  introTimelineRef.current =
                    null;

                  setMoving(
                    false
                  );
                },

              onInterrupt:
                () => {
                  introTimelineRef.current =
                    null;

                  setMoving(
                    false
                  );
                },
            }
          );

        introTimelineRef.current =
          timeline;

        timeline.to(
          camera.position,
          {
            x:
              closeupCamera[
                0
              ],

            y:
              closeupCamera[
                1
              ],

            z:
              closeupCamera[
                2
              ],

            duration:
              INTRO_ZOOM_DURATION,

            ease:
              "power2.out",
          },
          0
        );

        timeline.to(
          controls.target,
          {
            x:
              INTRO_STREET_TARGET[
                0
              ],

            y:
              INTRO_STREET_TARGET[
                1
              ],

            z:
              INTRO_STREET_TARGET[
                2
              ],

            duration:
              INTRO_ZOOM_DURATION,

            ease:
              "power2.out",
          },
          0
        );
      };

    window.addEventListener(
      "adventure:intro",
      handleIntro
    );

    return () => {
      window.removeEventListener(
        "adventure:intro",
        handleIntro
      );

      stopCameraTweens();
    };
  }, [
    camera,
    compact,
    lockCamera,
    stopCameraTweens,
  ]);

  useEffect(() => {
    if (
      !controlsRef.current ||
      readyRef.current
    ) {
      return;
    }

    readyRef.current =
      true;

    lockCamera(
      homeCamera,
      HOME_TARGET
    );

    requestAnimationFrame(
      () => {
        requestAnimationFrame(
          () => {
            onSceneReady?.();
          }
        );
      }
    );
  }, [
    homeCamera,
    lockCamera,
    onSceneReady,
  ]);

  return (
    <>
      <fog
        attach="fog"
        args={[
          "#010106",
          30,
          74,
        ]}
      />

      <ambientLight
        intensity={
          0.12
        }
      />

      <spotLight
        position={[
          9,
          17,
          11,
        ]}
        angle={
          0.52
        }
        penumbra={
          0.86
        }
        intensity={
          4.15
        }
        color="#ffd0b6"
        distance={
          48
        }
        decay={
          1.45
        }
        castShadow
        shadow-mapSize-width={
          1024
        }
        shadow-mapSize-height={
          1024
        }
      />

      <spotLight
        position={[
          -11,
          14,
          -10,
        ]}
        angle={
          0.68
        }
        penumbra={
          0.92
        }
        intensity={
          2.75
        }
        color="#727cff"
        distance={
          52
        }
        decay={
          1.55
        }
      />

      <pointLight
        position={[
          2.5,
          8.2,
          1.7,
        ]}
        intensity={
          1.7
        }
        color="#ff7665"
        distance={
          20
        }
        decay={
          1.5
        }
      />

      <Stars
        radius={
          78
        }
        depth={
          38
        }
        count={
          900
        }
        factor={
          2.35
        }
        saturation={
          0
        }
        fade
        speed={
          0.22
        }
      />

      <ConcreteRooftopGround />

      {/*
        Render the portfolio introduction directly on the rooftop concrete.
      */}
      <GroundGraffiti />

      <group
        onClick={
          handleLightDebugClick
        }
      >
        <MysteriousAdventureModel />
      </group>

      <RooftopVideoAdvertisement />

      <SquareWallVideoAdvertisement />

      {ENABLE_LIGHT_DEBUGGER &&
        debugClickPoint && (
          <mesh
            position={
              debugClickPoint
            }
            renderOrder={
              999
            }
          >
            <sphereGeometry
              args={[
                0.11,
                18,
                18,
              ]}
            />

            <meshBasicMaterial
              color="#00ffff"
              toneMapped={
                false
              }
              depthTest={
                false
              }
              depthWrite={
                false
              }
            />
          </mesh>
        )}

      <TokyoStreetLampGlow />

      <TrainStreetLampGlow />

      <pointLight
        position={[
          10,
          12,
          4,
        ]}
        intensity={
          5
        }
        distance={
          28
        }
        decay={
          1.6
        }
        color="#ffc87a"
      />

      <pointLight
        position={[
          10,
          7,
          5,
        ]}
        intensity={
          6
        }
        distance={
          24
        }
        decay={
          1.65
        }
        color="#ffbe72"
      />

      <pointLight
        position={[
          9,
          3.5,
          6,
        ]}
        intensity={
          7
        }
        distance={
          22
        }
        decay={
          1.6
        }
        color="#ffba68"
      />

      <pointLight
        position={[
          8,
          0.8,
          8,
        ]}
        intensity={
          7
        }
        distance={
          20
        }
        decay={
          1.55
        }
        color="#ffb660"
      />

      <pointLight
        position={[
          7,
          0.5,
          3,
        ]}
        intensity={
          3.4
        }
        distance={
          13
        }
        decay={
          1.85
        }
        color="#ffc070"
      />

      <pointLight
        position={[
          5,
          2.5,
          1,
        ]}
        intensity={
          2.8
        }
        distance={
          12
        }
        decay={
          1.9
        }
        color="#ffbe74"
      />

      <pointLight
        position={[
          9,
          0.1,
          6,
        ]}
        intensity={
          4.2
        }
        distance={
          15
        }
        decay={
          1.8
        }
        color="#ffb258"
      />

      <BackAlleyPinkGlow />

      {SECTIONS.map(
        (
          section
        ) => (
          <NumberHotspot
            key={
              section.id
            }
            section={
              section
            }
            disabled={
              moving
            }
            selected={
              activeId ===
              section.id
            }
            showCard={
              !compact
            }
            onSelect={
              selectSection
            }
            onClose={
              closeAnnotation
            }
            onProjectSelect={
              onProjectSelect
            }
            onOpenSectionDetail={
              onOpenSectionDetail
            }
          />
        )
      )}

      <EffectComposer
        multisampling={
          0
        }
        enableNormalPass
      >
        <SSAO
          blendFunction={
            BlendFunction.MULTIPLY
          }
          samples={
            12
          }
          rings={
            4
          }
          radius={
            0.075
          }
          intensity={
            1.2
          }
          luminanceInfluence={
            0.52
          }
          resolutionScale={
            0.65
          }
        />

        <Bloom
          mipmapBlur
          intensity={
            0.5
          }
          luminanceThreshold={
            0.68
          }
          luminanceSmoothing={
            0.2
          }
        />

        <Vignette
          eskil={
            false
          }
          offset={
            0.18
          }
          darkness={
            0.72
          }
        />
      </EffectComposer>

      <OrbitControls
        ref={
          controlsRef
        }
        makeDefault
        enabled={
          !moving
        }
        enablePan
        screenSpacePanning
        enableZoom
        enableRotate
        mouseButtons={{
          LEFT:
            MOUSE.PAN,

          MIDDLE:
            MOUSE.DOLLY,

          RIGHT:
            MOUSE.ROTATE,
        }}
        minDistance={
          compact
            ? 8.5
            : 7.2
        }
        maxDistance={
          compact
            ? 42
            : 34
        }
        minPolarAngle={
          Math.PI /
          7
        }
        maxPolarAngle={
          Math.PI /
          2.05
        }
        zoomSpeed={
          compact
            ? 0.9
            : 0.5
        }
        rotateSpeed={
          compact
            ? 0.38
            : 0.48
        }
        panSpeed={
          compact
            ? 0.72
            : 0.58
        }
        touches={{
          ONE:
            TOUCH.PAN,

          TWO:
            TOUCH.DOLLY_ROTATE,
        }}
        enableDamping={
          !moving
        }
        dampingFactor={
          0.08
        }
      />
    </>
  );
}
