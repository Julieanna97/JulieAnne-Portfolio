"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useProgress } from "@react-three/drei";
import {
  playAmbientAudio,
  setAmbientAudioMuted,
} from "@/lib/ambientAudio";

const OrangeAnimation = dynamic(
  () =>
    import("@lottiefiles/react-lottie-player").then(
      (module) => module.Player
    ),
  {
    ssr: false,
    loading: () => (
      <div className="orange-loader-placeholder" />
    ),
  }
);

export type PreloaderProps = {
  sceneReady: boolean;
  onEnter: () => void;
  onFinished: () => void;
  musicSrc?: string;
};

const ENTER_REVEAL_DELAY_MS = 180;
const EXIT_ANIMATION_MS = 520;

export default function Preloader({
  sceneReady,
  onEnter,
  onFinished,
  musicSrc = "/music/lofivision-lost-in-tokyo-242003.mp3",
}: PreloaderProps) {
  const { active, progress } = useProgress();

  const [enterVisible, setEnterVisible] =
    useState(false);

  const [leaving, setLeaving] =
    useState(false);

  const exitTimerRef =
    useRef<number | null>(null);

  const enteredRef =
    useRef(false);

  /*
    Keep the percentage below 100 until HeroScene confirms that the model,
    controls, and camera are ready.
  */
  const displayedProgress = sceneReady
    ? 100
    : Math.min(
        99,
        Math.max(
          active ? 1 : 0,
          Math.round(progress)
        )
      );

  /*
    Reveal Enter shortly after the loading bar reaches 100%.
  */
  useEffect(() => {
    if (!sceneReady) {
      setEnterVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setEnterVisible(true);
    }, ENTER_REVEAL_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [sceneReady]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(
          exitTimerRef.current
        );
      }
    };
  }, []);

  const handleEnter = () => {
    if (
      !sceneReady ||
      !enterVisible ||
      leaving ||
      enteredRef.current
    ) {
      return;
    }

    enteredRef.current = true;

    /*
      Start music only from this click handler.

      Browsers require a real visitor interaction before allowing audio.
    */
    try {
      setAmbientAudioMuted(false);

      window.dispatchEvent(
        new CustomEvent("ambient:set-muted", {
          detail: {
            muted: false,
          },
        })
      );

      void playAmbientAudio(
        musicSrc,
        0.1
      ).catch((error) => {
        console.warn(
          "Background audio could not be played. Continuing without music.",
          error
        );
      });
    } catch (error) {
      console.warn(
        "Background audio could not be started. Continuing without music.",
        error
      );
    }

    onEnter();
    setLeaving(true);

    exitTimerRef.current =
      window.setTimeout(() => {
        onFinished();
      }, EXIT_ANIMATION_MS);
  };

  return (
    <div
      className={`orange-loader ${
        leaving
          ? "is-leaving"
          : ""
      }`}
    >
      <main
        className="orange-loader-content"
        role="status"
        aria-live="polite"
        aria-label={
          sceneReady
            ? "The interactive scene is ready"
            : `Loading the interactive scene: ${displayedProgress}%`
        }
      >
        <div className="orange-loader-animation">
          <OrangeAnimation
            autoplay
            loop
            src="/animations/orange-hi.json"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        <div className="orange-loader-bar">
          <span
            style={{
              width: `${displayedProgress}%`,
            }}
          />
        </div>

        <p className="orange-loader-percentage">
          {displayedProgress}%
        </p>

        <div
          className={`orange-loader-enter-wrap ${
            enterVisible
              ? "is-visible"
              : ""
          }`}
        >
          <button
            type="button"
            className="orange-loader-enter"
            onClick={handleEnter}
            disabled={
              !enterVisible ||
              leaving
            }
          >
            Enter
          </button>
        </div>
      </main>

      <style jsx>{`
        .orange-loader {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #ffffff;
          transition:
            opacity ${EXIT_ANIMATION_MS}ms ease,
            visibility ${EXIT_ANIMATION_MS}ms ease;
        }

        .orange-loader.is-leaving {
          visibility: hidden;
          opacity: 0;
        }

        .orange-loader-content {
          display: grid;
          width: min(680px, 100%);
          justify-items: center;
          padding: 18px;
          text-align: center;
        }

        .orange-loader-animation {
          width: min(620px, 88vw);
          height: min(620px, 88vw);
          margin-bottom: -24px;
        }

        :global(.orange-loader-placeholder) {
          width: 100%;
          height: 100%;
          border-radius: 999px;
          background:
            radial-gradient(
              circle,
              rgba(255, 170, 74, 0.18),
              transparent 68%
            );
        }

        .orange-loader-bar {
          overflow: hidden;
          width: min(360px, 78vw);
          height: 6px;
          border-radius: 999px;
          background: rgba(240, 135, 49, 0.14);
        }

        .orange-loader-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #ffd27a 0%,
              #ffad4f 44%,
              #ff7d3e 100%
            );
          box-shadow:
            0 0 16px rgba(255, 151, 66, 0.35);
          transition: width 220ms ease;
        }

        .orange-loader-percentage {
          margin: 11px 0 0;
          color: rgba(123, 76, 42, 0.72);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.22em;
        }

        .orange-loader-enter-wrap {
          display: grid;
          grid-template-rows: 0fr;
          margin-top: 0;
          opacity: 0;
          transition:
            grid-template-rows 260ms ease,
            margin-top 260ms ease,
            opacity 260ms ease;
        }

        .orange-loader-enter-wrap.is-visible {
          grid-template-rows: 1fr;
          margin-top: 18px;
          opacity: 1;
        }

        .orange-loader-enter {
          min-height: 0;
          overflow: hidden;
          border: 0;
          background: transparent;
          padding: 12px 18px;
          color: #d86f22;
          cursor: pointer;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          transition:
            color 180ms ease,
            opacity 180ms ease,
            transform 180ms ease;
        }

        .orange-loader-enter:hover:not(:disabled) {
          color: #a94e12;
          transform: translateY(-2px);
        }

        .orange-loader-enter:disabled {
          cursor: wait;
          opacity: 0.64;
        }

        @media (max-width: 767px) {
          .orange-loader-animation {
            width: min(500px, 112vw);
            height: min(500px, 112vw);
            margin-bottom: -18px;
          }

          .orange-loader-bar {
            width: min(300px, 78vw);
          }
        }
      `}</style>
    </div>
  );
}