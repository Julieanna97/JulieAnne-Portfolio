"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useState,
} from "react";
import { useProgress } from "@react-three/drei";
import {
  Volume2,
  VolumeX,
} from "lucide-react";
import Preloader from "@/components/Preloader";
import {
  getAmbientAudioMuted,
  setAmbientAudioMuted,
} from "@/lib/ambientAudio";

const HeroScene = dynamic(
  () => import("@/components/HeroScene"),
  {
    ssr: false,
    loading: () => null,
  }
);

const PRELOADER_STORAGE_KEY = "preloaderShown";

function ReturningVisitorSceneLoader() {
  const { progress } = useProgress();

  const displayedProgress = Math.min(
    99,
    Math.max(
      1,
      Math.round(progress)
    )
  );

  return (
    <div
      className="fixed inset-0 z-[140] grid place-items-center bg-[#080b18]"
      role="status"
      aria-live="polite"
      aria-label={`Loading 3D street: ${displayedProgress}%`}
    >
      <div className="grid w-[min(270px,calc(100vw-48px))] justify-items-center gap-4 text-center text-white">
        <span className="h-11 w-11 animate-spin rounded-full border border-[#e2ccff]/30 border-r-[#85aaff] border-t-[#e2ccff]" />

        <p className="m-0 text-[10px] font-black uppercase tracking-[0.3em] text-white/90">
          Preparing the street
        </p>

        <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-[#d8bfff] via-[#85aaff] to-[#ff90c8] transition-[width] duration-200"
            style={{
              width: `${displayedProgress}%`,
            }}
          />
        </div>

        <strong className="text-[10px] tracking-[0.2em] text-[#e2ccff]/90">
          {displayedProgress}%
        </strong>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [bootChecked, setBootChecked] = useState(false);
  const [sceneMounted, setSceneMounted] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(false);
  const [shouldPlayIntro, setShouldPlayIntro] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = "twilight";
    document.documentElement.style.colorScheme = "dark";

    const alreadyEntered =
      sessionStorage.getItem(
        PRELOADER_STORAGE_KEY
      ) === "true";

    setSceneMounted(alreadyEntered);
    setShowPreloader(!alreadyEntered);
    setBootChecked(true);
  }, []);

  /*
    Reveal the completed model only after:
    - the scene has mounted,
    - HeroScene has confirmed that its model and controls are ready,
    - the first-entry preloader has finished closing.
  */
  useEffect(() => {
    if (
      !sceneMounted ||
      !sceneReady ||
      showPreloader
    ) {
      return;
    }

    if (!shouldPlayIntro) {
      setSceneVisible(true);
      return;
    }

    setSceneVisible(true);

    const introFrame =
      window.requestAnimationFrame(() => {
        window.dispatchEvent(
          new CustomEvent(
            "adventure:intro"
          )
        );

        setShouldPlayIntro(false);
      });

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
    Mount the Three.js scene immediately when Enter is clicked.

    The preloader itself remains on top until sceneReady becomes true.
  */
  const handleEntered = () => {
    sessionStorage.setItem(
      PRELOADER_STORAGE_KEY,
      "true"
    );

    setSceneVisible(false);
    setShouldPlayIntro(true);
    setSceneMounted(true);
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
            onEnter={
              handleEntered
            }
            onFinished={() => {
              setShowPreloader(false);
            }}
            sceneReady={
              sceneReady
            }
            musicSrc="/music/lofivision-lost-in-tokyo-242003.mp3"
          />
        )}

      {bootChecked &&
        sceneMounted &&
        !sceneReady &&
        !showPreloader && (
          <ReturningVisitorSceneLoader />
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