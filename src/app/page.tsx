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
import {
  getAmbientAudioMuted,
  setAmbientAudioMuted,
} from "@/lib/ambientAudio";

type HeroSceneProps = {
  onSceneReady?: () => void;
};

/*
  Declare HeroScene's accepted props explicitly.

  This prevents TypeScript from incorrectly treating the dynamically imported
  component as a component with no props.
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
    musicMuted,
    setMusicMuted,
  ] = useState(false);

  /*
    Mount the Three.js scene immediately behind the loader.

    This allows the loading bar to track the model while the large orange
    remains visible on top.
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
        customEvent.detail?.muted ??
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
    Start the intro immediately after Enter is clicked.

    Preloader.tsx removes its white overlay on the following frame.
  */
  const handleEntered = () => {
    window.dispatchEvent(
      new CustomEvent(
        "adventure:intro"
      )
    );
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
            sceneReady={sceneReady}
            onEnter={handleEntered}
            onFinished={() => {
              setShowPreloader(false);
            }}
            musicSrc="/music/lofivision-lost-in-tokyo-242003.mp3"
          />
        )}

      {bootChecked &&
        sceneMounted && (
          <main className="h-[100dvh] w-full overflow-hidden bg-[#010106]">
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