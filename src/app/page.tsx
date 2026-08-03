"use client";

import dynamic from "next/dynamic";

import {
  useEffect,
  useState,
} from "react";

import {
  Volume2,
  VolumeX,
} from "lucide-react";

import Preloader from "@/components/Preloader";

import SceneReturnButton from "@/components/hero-scene/modals/SceneReturnButton";

import {
  getAmbientAudioMuted,
  setAmbientAudioMuted,
} from "@/lib/ambientAudio";

type HeroSceneProps = {
  onSceneReady?: () => void;
};

const HeroScene =
  dynamic<HeroSceneProps>(
    () =>
      import(
        "@/components/hero-scene/HeroScene"
      ).then(
        (module) =>
          module.default,
      ),
    {
      ssr: false,
      loading: () => null,
    },
  );

export default function HomePage() {
  const [
    bootChecked,
    setBootChecked,
  ] = useState(false);

  const [
    sceneMounted,
    setSceneMounted,
  ] = useState(false);

  const [
    showPreloader,
    setShowPreloader,
  ] = useState(true);

  const [
    sceneReady,
    setSceneReady,
  ] = useState(false);

  const [
    musicMuted,
    setMusicMuted,
  ] = useState(false);

  /*
   * Mount the Three.js scene immediately behind the loader
   * so it can initialize before Enter is clicked.
   */
  useEffect(() => {
    document.documentElement.dataset.theme =
      "twilight";

    document.documentElement.style.colorScheme =
      "dark";

    setSceneMounted(true);
    setShowPreloader(true);
    setBootChecked(true);
  }, []);

  /*
   * Safety fallback.
   *
   * Normally HeroScene calls onSceneReady after the scene
   * mounts. If that callback fails, display Enter after
   * twelve seconds.
   */
  useEffect(() => {
    if (
      !sceneMounted ||
      sceneReady
    ) {
      return;
    }

    const safetyTimer =
      window.setTimeout(() => {
        console.warn(
          "Scene readiness timed out. Showing the Enter button.",
        );

        setSceneReady(true);
      }, 12000);

    return () => {
      window.clearTimeout(
        safetyTimer,
      );
    };
  }, [
    sceneMounted,
    sceneReady,
  ]);

  /*
   * Read and update the shared ambient-audio mute state.
   */
  useEffect(() => {
    setMusicMuted(
      getAmbientAudioMuted(),
    );

    const handleMute = (
      event: Event,
    ) => {
      const customEvent =
        event as CustomEvent<{
          muted?: boolean;
        }>;

      const nextMuted =
        customEvent.detail
          ?.muted ?? true;

      setAmbientAudioMuted(
        nextMuted,
      );

      setMusicMuted(
        nextMuted,
      );
    };

    window.addEventListener(
      "ambient:set-muted",
      handleMute,
    );

    return () => {
      window.removeEventListener(
        "ambient:set-muted",
        handleMute,
      );
    };
  }, []);

  /*
   * Start the camera introduction after Enter is clicked.
   */
  const handleEntered = () => {
    window.dispatchEvent(
      new CustomEvent(
        "adventure:intro",
      ),
    );
  };

  /*
   * The permanent upper-left sticker performs both actions:
   *
   * 1. Escape closes Projects, About, Credits, or an open
   *    project case study through their existing handlers.
   *
   * 2. adventure:return-home returns the camera to the main
   *    3D model view.
   */
  const handleReturnToSceneHome =
    () => {
      window.dispatchEvent(
        new KeyboardEvent(
          "keydown",
          {
            key: "Escape",
            code: "Escape",
          },
        ),
      );

      /*
       * Wait until React has processed the modal close before
       * starting the camera return animation.
       */
      window.requestAnimationFrame(
        () => {
          window.dispatchEvent(
            new CustomEvent(
              "adventure:return-home",
            ),
          );
        },
      );
    };

  const handleMusicToggle =
    () => {
      const nextMuted =
        !musicMuted;

      setAmbientAudioMuted(
        nextMuted,
      );

      setMusicMuted(
        nextMuted,
      );
    };

  return (
    <>
      {/*
       * This is the only visible sticker instance.
       *
       * It mounts once after the preloader and stays mounted
       * while Projects, About, Credits, and case studies open.
       */}
      {bootChecked &&
        !showPreloader && (
          <SceneReturnButton
            persistent
            onClick={
              handleReturnToSceneHome
            }
            ariaLabel="Return to the main 3D model view"
            primaryText="Julie Anne"
            secondaryText="3D Portfolio"
            tooltip="Return to the 3D home view"
          />
        )}

      {bootChecked &&
        !showPreloader && (
          <button
            type="button"
            onClick={
              handleMusicToggle
            }
            className="fixed z-[160] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#0d1020]/70 text-white shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5"
            style={{
              bottom:
                "max(1rem, env(safe-area-inset-bottom))",

              right:
                "max(1rem, env(safe-area-inset-right))",
            }}
            aria-label={
              musicMuted
                ? "Unmute background music"
                : "Mute background music"
            }
          >
            {musicMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        )}

      {bootChecked &&
        showPreloader && (
          <Preloader
            sceneReady={
              sceneReady
            }
            onEnter={
              handleEntered
            }
            onFinished={() => {
              setShowPreloader(
                false,
              );
            }}
            musicSrc="/music/puyopuyomegafan1234-japanese-jazz-2-385180.mp3"
          />
        )}

      {bootChecked &&
        sceneMounted && (
          <main className="h-screen h-[100dvh] w-full overflow-hidden bg-[#010106]">
            <HeroScene
              onSceneReady={() => {
                setSceneReady(
                  true,
                );
              }}
            />
          </main>
        )}
    </>
  );
}