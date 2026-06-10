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
import type { HeroSceneProps } from "@/components/HeroScene";
import {
  getAmbientAudioMuted,
  setAmbientAudioMuted,
} from "@/lib/ambientAudio";

/*
  Explicitly provide HeroScene's prop type.

  This prevents next/dynamic from incorrectly inferring that HeroScene
  accepts no props.
*/
const HeroScene =
  dynamic<HeroSceneProps>(
    () =>
      import(
        "@/components/HeroScene"
      ).then(
        (module) =>
          module.default
      ),
    {
      ssr: false,
      loading: () => null,
    }
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
    sceneVisible,
    setSceneVisible,
  ] = useState(false);

  const [
    shouldPlayIntro,
    setShouldPlayIntro,
  ] = useState(false);

  const [
    musicMuted,
    setMusicMuted,
  ] = useState(false);

  /*
    Load the 3D model immediately behind the orange loader.

    The orange animation and loading bar remain visible until HeroScene
    reports that the scene is ready. Music still waits for the Enter click.
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
    Reveal the scene and play the intro animation only after:
    - HeroScene is ready,
    - the visitor has clicked Enter,
    - the orange loader has faded away.
  */
  useEffect(() => {
    if (
      !sceneMounted ||
      !sceneReady ||
      showPreloader
    ) {
      return;
    }

    setSceneVisible(true);

    if (!shouldPlayIntro) {
      return;
    }

    const introFrame =
      window.requestAnimationFrame(
        () => {
          window.dispatchEvent(
            new CustomEvent(
              "adventure:intro"
            )
          );

          setShouldPlayIntro(false);
        }
      );

    return () => {
      window.cancelAnimationFrame(
        introFrame
      );
    };
  }, [
    sceneMounted,
    sceneReady,
    showPreloader,
    shouldPlayIntro,
  ]);

  useEffect(() => {
    setMusicMuted(
      getAmbientAudioMuted()
    );

    const handleMute = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<{
          muted?: boolean;
        }>;

      const nextMuted =
        customEvent.detail
          ?.muted ??
        true;

      setAmbientAudioMuted(
        nextMuted
      );

      setMusicMuted(
        nextMuted
      );
    };

    window.addEventListener(
      "ambient:set-muted",
      handleMute
    );

    return () => {
      window.removeEventListener(
        "ambient:set-muted",
        handleMute
      );
    };
  }, []);

  /*
    This callback is triggered only after the visitor clicks Enter.

    Preloader.tsx starts the music from the same click event.
  */
  const handleEntered = () => {
    setSceneVisible(false);
    setShouldPlayIntro(true);
  };

  return (
    <>
      {bootChecked &&
        !showPreloader && (
          <button
            type="button"
            onClick={() => {
              const nextMuted =
                !musicMuted;

              setAmbientAudioMuted(
                nextMuted
              );

              setMusicMuted(
                nextMuted
              );
            }}
            className="fixed bottom-4 right-4 z-[160] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#0d1020]/70 text-white shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5"
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
              setShowPreloader(false);
            }}
            musicSrc="/music/lofivision-lost-in-tokyo-242003.mp3"
          />
        )}

      {bootChecked &&
        sceneMounted && (
          <main
            className={`h-[100dvh] w-full overflow-hidden transition-opacity duration-500 ${
              sceneVisible
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <HeroScene
              onSceneReady={() => {
                setSceneReady(true);
              }}
            />
          </main>
        )}
    </>
  );
}