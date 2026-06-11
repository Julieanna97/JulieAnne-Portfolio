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
          width: 100%;
          height: 100vh;
          height: 100dvh;
          place-items: center;
          overflow: hidden;
          background: #ffffff;

          /*
            Keep interactive content away from phone notches,
            rounded corners, and the iPhone home indicator.
          */
          padding:
            max(12px, env(safe-area-inset-top))
            max(12px, env(safe-area-inset-right))
            max(12px, env(safe-area-inset-bottom))
            max(12px, env(safe-area-inset-left));
        }

        .orange-loader-content {
          display: grid;

          /*
            Prevent the oversized orange animation from widening the grid column.
            All elements will remain centered against the visible screen.
          */
          grid-template-columns: minmax(0, 1fr);
          width: min(760px, 100%);
          min-width: 0;

          justify-items: center;
          align-items: center;
          padding: 16px;
          text-align: center;
        }

        /*
          Use both width and visible screen height to calculate the orange size.

          On a normal portrait phone, the animation remains large.
          On a short screen or landscape phone, it shrinks so the bar and button
          remain visible.
        */
        .orange-loader-animation {
          pointer-events: none;
          width:
            min(
              720px,
              96vw,
              calc(100dvh - 170px)
            );
          height:
            min(
              720px,
              96vw,
              calc(100dvh - 170px)
            );
          min-width: 210px;
          min-height: 210px;
          margin-bottom: -36px;
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
          width: clamp(210px, 78vw, 360px);
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
          Use a minimum touch-friendly height while retaining the
          transparent text-only appearance.
        */
        .orange-loader-enter {
          position: relative;
          z-index: 4;
          display: inline-grid;
          min-height: 44px;
          place-items: center;
          margin-top: 16px;
          border: 0;
          background: transparent;
          padding: 10px 18px;
          color: #d86f22;
          cursor: pointer;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition:
            color 180ms ease,
            transform 180ms ease;
        }

        .orange-loader-enter:hover {
          color: #a94e12;
          transform: translateY(-2px);
        }

        .orange-loader-enter:active {
          transform: scale(0.96);
        }

        .orange-loader-enter:focus-visible {
          border-radius: 6px;
          outline: 2px solid rgba(216, 111, 34, 0.6);
          outline-offset: 4px;
        }

        /*
          Portrait phones:
          allow the orange to remain intentionally wider than the screen,
          but limit its height using the visible mobile viewport.
        */
        @media (max-width: 767px) {
          .orange-loader-content {
            width: 100%;
          }

          .orange-loader-animation {
            pointer-events: none;
            justify-self: center;
            width: min(720px, 96vw);
            height: min(720px, 96vw);
            margin-bottom: -42px;
          }

          .orange-loader-bar {
            width: clamp(210px, 78vw, 300px);
          }

          .orange-loader-enter {
            margin-top: 14px;
          }
        }

        /*
          Short screens and landscape phones:
          shrink the animation further so that Enter never disappears
          below the browser toolbar.
        */
        @media (max-height: 520px) {
          .orange-loader-animation {
            width:
              min(
                460px,
                88vw,
                calc(100dvh - 118px)
              );
            height:
              min(
                460px,
                88vw,
                calc(100dvh - 118px)
              );
            min-width: 150px;
            min-height: 150px;
            margin-bottom: -20px;
          }

          .orange-loader-enter {
            min-height: 40px;
            margin-top: 8px;
            padding: 7px 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .orange-loader-bar span,
          .orange-loader-enter {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}