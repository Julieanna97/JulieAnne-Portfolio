"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import Preloader from "@/components/Preloader";
import {
  getAmbientAudioMuted,
  setAmbientAudioMuted,
} from "@/lib/ambientAudio";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => null,
});

const PRELOADER_STORAGE_KEY = "preloaderShown";

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
      sessionStorage.getItem(PRELOADER_STORAGE_KEY) === "true";

    setSceneMounted(alreadyEntered);
    setShowPreloader(!alreadyEntered);
    setBootChecked(true);
  }, []);

  useEffect(() => {
    if (!sceneMounted || !sceneReady || showPreloader) return;

    if (!shouldPlayIntro) {
      setSceneVisible(true);
      return;
    }

    setSceneVisible(true);

    const introFrame = window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("adventure:intro"));
      setShouldPlayIntro(false);
    });

    return () => {
      window.cancelAnimationFrame(introFrame);
    };
  }, [
    sceneMounted,
    sceneReady,
    showPreloader,
    shouldPlayIntro,
  ]);

  useEffect(() => {
    setMusicMuted(getAmbientAudioMuted());

    const handleMute = (event: Event) => {
      const customEvent = event as CustomEvent<{
        muted?: boolean;
      }>;

      const nextMuted = customEvent.detail?.muted ?? true;

      setAmbientAudioMuted(nextMuted);
      setMusicMuted(nextMuted);
    };

    window.addEventListener("ambient:set-muted", handleMute);

    return () => {
      window.removeEventListener("ambient:set-muted", handleMute);
    };
  }, []);

  const handleEntered = () => {
    sessionStorage.setItem(PRELOADER_STORAGE_KEY, "true");

    setSceneVisible(false);
    setShouldPlayIntro(true);
    setSceneMounted(true);

    window.setTimeout(() => {
      setShowPreloader(false);
    }, 1050);
  };

  return (
    <>
      {bootChecked && !showPreloader && (
        <button
          type="button"
          onClick={() => {
            const nextMuted = !musicMuted;

            setAmbientAudioMuted(nextMuted);
            setMusicMuted(nextMuted);
          }}
          className="fixed bottom-4 right-4 z-[120] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#0d1020]/70 text-white shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5"
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

      {bootChecked && showPreloader && (
        <Preloader
          onEnter={handleEntered}
          musicSrc="/music/lofivision-lost-in-tokyo-242003.mp3"
        />
      )}

      {bootChecked && sceneMounted && (
        <main
          className={`h-[100dvh] w-full overflow-hidden transition-opacity duration-500 ${
            sceneVisible ? "opacity-100" : "opacity-0"
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