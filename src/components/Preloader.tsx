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

export default function Preloader({
  sceneReady,
  onEnter,
  onFinished,
  musicSrc = "/music/lofivision-lost-in-tokyo-242003.mp3",
}: PreloaderProps) {
  const { progress } = useProgress();

  const [
    displayedProgress,
    setDisplayedProgress,
  ] = useState(3);

  const [
    enterVisible,
    setEnterVisible,
  ] = useState(false);

  const enteredRef =
    useRef(false);

  const finishFrameRef =
    useRef<number | null>(null);

  /*
    Use Drei's real loading percentage when available.

    Some cached assets may cause Drei to report zero or jump abruptly.
    The gradual fallback keeps the loader moving while HeroScene prepares
    its model, camera, and controls.

    The bar never reaches 100% until HeroScene explicitly reports readiness.
  */
  useEffect(() => {
    if (sceneReady) {
      setDisplayedProgress(100);
      return;
    }

    const realProgress = Math.min(
      92,
      Math.max(
        0,
        Math.round(progress)
      )
    );

    setDisplayedProgress(
      (currentProgress) =>
        Math.max(
          currentProgress,
          realProgress
        )
    );

    const progressTimer =
      window.setInterval(() => {
        setDisplayedProgress(
          (currentProgress) => {
            if (
              currentProgress <
              68
            ) {
              return Math.min(
                68,
                currentProgress + 2
              );
            }

            if (
              currentProgress <
              92
            ) {
              return Math.min(
                92,
                currentProgress + 1
              );
            }

            return currentProgress;
          }
        );
      }, 100);

    return () => {
      window.clearInterval(
        progressTimer
      );
    };
  }, [
    progress,
    sceneReady,
  ]);

  /*
    Reveal Enter only after the real scene-ready signal has arrived.
  */
  useEffect(() => {
    if (
      !sceneReady ||
      displayedProgress < 100
    ) {
      setEnterVisible(false);
      return;
    }

    const revealTimer =
      window.setTimeout(() => {
        setEnterVisible(true);
      }, ENTER_REVEAL_DELAY_MS);

    return () => {
      window.clearTimeout(
        revealTimer
      );
    };
  }, [
    sceneReady,
    displayedProgress,
  ]);

  useEffect(() => {
    return () => {
      if (
        finishFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          finishFrameRef.current
        );
      }
    };
  }, []);

  const handleEnter = () => {
    if (
      !sceneReady ||
      !enterVisible ||
      enteredRef.current
    ) {
      return;
    }

    enteredRef.current = true;

    /*
      Start the music only after the visitor clicks Enter.

      Keeping audio inside this click handler avoids browser autoplay
      restrictions.
    */
    try {
      setAmbientAudioMuted(false);

      window.dispatchEvent(
        new CustomEvent(
          "ambient:set-muted",
          {
            detail: {
              muted: false,
            },
          }
        )
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

    /*
      Start the Three.js intro while the loader still covers the current frame.
    */
    onEnter();

    /*
      Remove the loader on the following frame.

      There is intentionally no fade, slide, or orange exit animation.
      The visitor immediately sees the 3D intro animation.
    */
    finishFrameRef.current =
      window.requestAnimationFrame(() => {
        onFinished();
      });
  };

  return (
    <div className="orange-loader">
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

        <div
          className="orange-loader-bar"
          aria-hidden="true"
        >
          <span
            style={{
              width: `${displayedProgress}%`,
            }}
          />
        </div>

        {enterVisible && (
          <button
            type="button"
            className="orange-loader-enter"
            onClick={handleEnter}
          >
            Enter
          </button>
        )}
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
        }

        .orange-loader-content {
          display: grid;
          width: min(760px, 100%);
          justify-items: center;
          padding: 16px;
          text-align: center;
        }

        /*
          Keep the orange very large while preventing it from blocking
          the Enter button.
        */
        .orange-loader-animation {
          pointer-events: none;
          width: min(720px, 96vw);
          height: min(720px, 96vw);
          margin-bottom: -42px;
        }

        :global(.orange-loader-placeholder) {
          width: 100%;
          height: 100%;
          border-radius: 999px;
          background:
            radial-gradient(
              circle,
              rgba(255, 170, 74, 0.14),
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
            0 0 16px
            rgba(255, 151, 66, 0.35);
          transition:
            width 220ms ease;
        }

        /*
          Transparent text-only Enter button.
        */
        .orange-loader-enter {
          position: relative;
          z-index: 4;
          margin-top: 20px;
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
            transform 180ms ease;
        }

        .orange-loader-enter:hover {
          color: #a94e12;
          transform: translateY(-2px);
        }

        .orange-loader-enter:focus-visible {
          border-radius: 6px;
          outline: 2px solid rgba(216, 111, 34, 0.6);
          outline-offset: 4px;
        }

        @media (max-width: 767px) {
          .orange-loader-animation {
            width: min(620px, 132vw);
            height: min(620px, 132vw);
            margin-bottom: -34px;
          }

          .orange-loader-bar {
            width: min(300px, 78vw);
          }
        }
      `}</style>
    </div>
  );
}