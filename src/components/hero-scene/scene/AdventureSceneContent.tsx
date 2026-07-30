"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer, SSAO, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { PerspectiveCamera } from "three";
import { MOUSE, TOUCH, Vector3 } from "three";
import gsap from "gsap";
import SakuraAtmosphere from "./SakuraAtmosphere";
import ExistingStreetSignOverlay from "./ExistingStreetSignOverlay";
import FloatingHeart from "./FloatingHeart";

import MysteriousAdventureModel from "../../../models/MysteriousAdventureModel";
import type { PortfolioSection, ProjectId, SectionId } from "../types";
import {
  ABOUT_CAMERA_MOBILE,
  CREDITS_CAMERA_MOBILE,
  ENABLE_LIGHT_DEBUGGER,
  HOME_CAMERA_DESKTOP,
  HOME_CAMERA_MOBILE,
  HOME_TARGET,
  INTRO_CAMERA_DESKTOP,
  INTRO_CAMERA_MOBILE,
  INTRO_STREET_CAMERA_DESKTOP,
  INTRO_STREET_CAMERA_MOBILE,
  INTRO_STREET_TARGET,
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

  /*
    Tracks whether a section was previously open. This lets every close path
    return the camera to the exact original whole-building view.
  */
  const previousActiveIdRef =
    useRef<
      | SectionId
      | null
    >(
      activeId
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

    /*
    * Idle camera rotation starts only after the opening
    * intro finishes. Once the visitor interacts with the
    * camera or selects a hotspot, it remains disabled.
    */
    const [
      idleRotationEnabled,
      setIdleRotationEnabled,
    ] = useState(false);

    const visitorInteractedRef =
      useRef(false);

    const stopIdleRotation =
      useCallback(() => {
        if (
          visitorInteractedRef.current
        ) {
          return;
        }

        visitorInteractedRef.current =
          true;

        setIdleRotationEnabled(false);
      }, []);

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
    Smoothly restore the exact camera position and target from sceneConfig.
  */
  const returnToHome =
    useCallback(
      () => {
        moveCamera(
          homeCamera,
          HOME_TARGET,
          1.15
        );
      },
      [
        homeCamera,
        moveCamera,
      ]
    );

  /*
    The X button only closes the selected card. The activeId effect below
    performs the zoom-out so this also works for any other external close path.
  */
  const closeAnnotation =
    useCallback(
      () => {
        if (
          moving
        ) {
          return;
        }

        onActiveChange(
          null
        );
      },
      [
        moving,
        onActiveChange,
      ]
    );

  /*
    Whenever a section changes from open to closed, return to the original
    whole-building view instead of leaving OrbitControls at the section target.
  */
  useEffect(() => {
    const previousActiveId =
      previousActiveIdRef.current;

    previousActiveIdRef.current =
      activeId;

    const sectionWasClosed =
      previousActiveId !== null &&
      activeId === null;

    if (
      sectionWasClosed
    ) {
      returnToHome();
    }
  }, [
    activeId,
    returnToHome,
  ]);

  /*
    One continuous sideways movement for About Me.
  */
  const moveToAboutDoor =
    useCallback(
      (
        section:
          PortfolioSection
      ) => {
        const finalCamera =
          compact
            ? ABOUT_CAMERA_MOBILE
            : section.camera;

        moveCamera(
          finalCamera,
          section.focus,
          1.65
        );
      },
      [
        compact,
        moveCamera,
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
        const finalCamera =
          compact
            ? PROJECTS_CAMERA_MOBILE
            : section.camera;

        moveCamera(
          finalCamera,
          section.focus,
          1.55
        );
      },
      [
        compact,
        moveCamera,
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
        const finalCamera =
          compact
            ? CREDITS_CAMERA_MOBILE
            : section.camera;

        moveCamera(
          finalCamera,
          section.focus,
          1.35
        );
      },
      [
        compact,
        moveCamera,
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

        stopIdleRotation();

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
        stopIdleRotation,
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
    const handleIntro = () => {
      const controls =
        controlsRef.current;

      if (!controls) {
        return;
      }

      const startCamera =
        compact
          ? INTRO_CAMERA_MOBILE
          : INTRO_CAMERA_DESKTOP;

      const finalCamera =
        compact
          ? INTRO_STREET_CAMERA_MOBILE
          : INTRO_STREET_CAMERA_DESKTOP;

      stopCameraTweens();
      setMoving(true);

      /*
        One stable pivot gives a proper orbit around the building.
      */
      const orbitTarget =
        new Vector3(
          INTRO_STREET_TARGET[0],
          INTRO_STREET_TARGET[1],
          INTRO_STREET_TARGET[2]
        );

      const startOffset =
        new Vector3(
          startCamera[0],
          startCamera[1],
          startCamera[2]
        ).sub(orbitTarget);

      const finalOffset =
        new Vector3(
          finalCamera[0],
          finalCamera[1],
          finalCamera[2]
        ).sub(orbitTarget);

      const orbitState = {
        angle:
          Math.atan2(
            startOffset.x,
            startOffset.z
          ),

        horizontalRadius:
          Math.hypot(
            startOffset.x,
            startOffset.z
          ),

        height:
          startCamera[1],
      };

      let finalAngle =
        Math.atan2(
          finalOffset.x,
          finalOffset.z
        );

      /*
        Force the camera to rotate forward around the building,
        rather than taking the shorter route backward.
      */
      while (
        finalAngle <=
        orbitState.angle
      ) {
        finalAngle +=
          Math.PI * 2;
      }

      const finalHorizontalRadius =
        Math.hypot(
          finalOffset.x,
          finalOffset.z
        );

      /*
        Save approximately 11 degrees for the finishing movement.
        This gives the animation an extra rotation near the end.
      */
      const finishingRotation =
        (Math.PI * 11) / 180;

      const mainRotationEnd =
        finalAngle -
        finishingRotation;

      const applyCameraPosition = () => {
        camera.position.set(
          orbitTarget.x +
            Math.sin(
              orbitState.angle
            ) *
              orbitState.horizontalRadius,

          orbitState.height,

          orbitTarget.z +
            Math.cos(
              orbitState.angle
            ) *
              orbitState.horizontalRadius
        );

        controls.target.copy(
          orbitTarget
        );

        controls.update();
      };

      /*
        Begin from the higher, closer camera.
      */
      lockCamera(
        startCamera,
        INTRO_STREET_TARGET
      );

      const timeline =
        gsap.timeline({
          onComplete: () => {
            lockCamera(
              finalCamera,
              INTRO_STREET_TARGET
            );

            introTimelineRef.current =
              null;

            setMoving(false);

            /*
            * Begin the gentle orbit only when the visitor
            * has not already interacted with the scene.
            */
            if (
              !visitorInteractedRef.current
            ) {
              setIdleRotationEnabled(
                true
              );
            }
          },

          onInterrupt: () => {
            introTimelineRef.current =
              null;

            setMoving(false);
          },
        });

      introTimelineRef.current =
        timeline;

      /*
        Main movement:
        - rotate around the model,
        - zoom outward,
        - descend from the higher opening angle.
      */
      timeline.to(
        orbitState,
        {
          angle:
            mainRotationEnd,

          horizontalRadius:
            finalHorizontalRadius *
            0.98,

          /*
            Stop slightly above the final camera height.
          */
          height:
            finalCamera[1] +
            0.65,

          duration:
            INTRO_ZOOM_DURATION *
            0.76,

          ease:
            "power1.inOut",

          onUpdate:
            applyCameraPosition,
        },
        0
      );

      /*
        Finishing movement:
        - rotate a little farther,
        - move slightly downward,
        - reach the exact final zoom distance.
      */
      timeline.to(
        orbitState,
        {
          angle:
            finalAngle,

          horizontalRadius:
            finalHorizontalRadius,

          height:
            finalCamera[1],

          duration:
            INTRO_ZOOM_DURATION *
            0.24,

          ease:
            "power1.out",

          onUpdate:
            applyCameraPosition,
        }
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
      <color
        attach="background"
        args={[
          "#000000",
        ]}
      />

      <fog
        attach="fog"
        args={[
          "#000000",
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

      <ConcreteRooftopGround />

      {/*
        Render the portfolio introduction directly on the rooftop concrete.
      */}
      <GroundGraffiti />

      <ExistingStreetSignOverlay />

      <SakuraAtmosphere />

      <FloatingHeart
        position={[
          0,
          15.2,
          0,
        ]}
        scale={0.72}
      />

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
        ref={controlsRef}
        makeDefault

        autoRotate={
          idleRotationEnabled &&
          !moving &&
          activeId === null
        }

        autoRotateSpeed={1.6}

        onStart={
          stopIdleRotation
        }

        /*
          Lock all manual movement while a section is open or while a camera
          transition is running. The X button therefore performs only the
          controlled zoom-out to the original home view.
        */
        enabled={
          !moving &&
          activeId === null
        }

        enablePan={false}
        enableRotate
        enableZoom

        mouseButtons={{
          LEFT:
            MOUSE.ROTATE,

          MIDDLE:
            MOUSE.DOLLY,

          /*
            Panning is disabled, so right drag does nothing.
          */
          RIGHT:
            MOUSE.PAN,
        }}

        touches={{
          ONE:
            TOUCH.ROTATE,

          TWO:
            TOUCH.DOLLY_ROTATE,
        }}

        minDistance={
          compact
            ? 8.5
            : 7
        }

        maxDistance={
          compact
            ? 48
            : 40
        }

        minPolarAngle={
          Math.PI / 7
        }

        maxPolarAngle={
          Math.PI / 2.02
        }

        zoomSpeed={
          compact
            ? 0.95
            : 0.72
        }

        rotateSpeed={
          compact
            ? 0.58
            : 0.72
        }

        enableDamping={
          !moving &&
          activeId === null
        }

        dampingFactor={0.075}
      />
    </>
  );
}
