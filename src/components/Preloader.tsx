"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  playAmbientAudio,
  setAmbientAudioMuted,
} from "@/lib/ambientAudio";

const SushiAnimation = dynamic(
  () =>
    import("@lottiefiles/react-lottie-player").then(
      (module) => module.Player
    ),
  {
    ssr: false,
    loading: () => (
      <div className="sushi-loader-placeholder" />
    ),
  }
);

export type PreloaderProps = {
  sceneReady: boolean;
  onEnter: () => void;
  onFinished: () => void;
  musicSrc?: string;
};

const START_REVEAL_DELAY_MS =
  180;

function isAbortError(
  error: unknown
) {
  return (
    error instanceof DOMException &&
    error.name ===
      "AbortError"
  );
}

export default function Preloader({
  sceneReady,
  onEnter,
  onFinished,
  musicSrc = "/music/lofivision-lost-in-tokyo-242003.mp3",
}: PreloaderProps) {
  const [
    startVisible,
    setStartVisible,
  ] = useState(false);

  const enteredRef =
    useRef(false);

  const finishFrameRef =
    useRef<number | null>(
      null
    );

  /*
    Show Start only after HeroScene confirms that the 3D model,
    camera, and controls are ready.
  */
  useEffect(() => {
    if (
      !sceneReady
    ) {
      setStartVisible(
        false
      );

      return;
    }

    const revealTimer =
      window.setTimeout(() => {
        setStartVisible(
          true
        );
      }, START_REVEAL_DELAY_MS);

    return () => {
      window.clearTimeout(
        revealTimer
      );
    };
  }, [
    sceneReady,
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

  const handleStart =
    () => {
      if (
        !sceneReady ||
        !startVisible ||
        enteredRef.current
      ) {
        return;
      }

      enteredRef.current =
        true;

      /*
        Start playback directly inside the visitor's click.

        AbortError is harmless when a media element is replaced or paused
        while an earlier play request is still resolving.
      */
      void playAmbientAudio(
        musicSrc,
        0.1
      )
        .then(() => {
          setAmbientAudioMuted(
            false
          );

          window.dispatchEvent(
            new CustomEvent(
              "ambient:set-muted",
              {
                detail: {
                  muted:
                    false,
                },
              }
            )
          );
        })
        .catch(
          (
            error
          ) => {
            if (
              isAbortError(
                error
              )
            ) {
              return;
            }

            console.warn(
              "Background audio could not be played. Continuing without music.",
              error
            );
          }
        );

      /*
        Start the Three.js intro while the loader still covers the frame.
      */
      onEnter();

      /*
        Remove the loader on the following frame so the visitor immediately
        sees the 3D intro animation.
      */
      finishFrameRef.current =
        window.requestAnimationFrame(
          () => {
            onFinished();
          }
        );
    };

  return (
    <div className="sushi-loader">
      <div
        className="sushi-loader-animation"
        aria-hidden="true"
      >
        <SushiAnimation
          autoplay
          loop
          src="/animations/sushi-loader.json"
          style={{
            width:
              "100%",

            height:
              "100%",
          }}
        />
      </div>

      <main
        className="sushi-loader-content"
        role="status"
        aria-live="polite"
        aria-busy={
          !sceneReady
        }
        aria-label={
          sceneReady
            ? "The interactive scene is ready"
            : "Loading the interactive scene"
        }
      >
        {startVisible && (
          <button
            type="button"
            className="sushi-loader-start"
            onClick={
              handleStart
            }
          >
            Start
          </button>
        )}
      </main>

      <style jsx>{`
        .sushi-loader {
          position: fixed;
          inset: 0;
          z-index: 200;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          background: #ffffff;
        }

        /*
          The uploaded Lottie animation has a 2100 × 1200 canvas.

          These calculations make the landscape animation cover the viewport
          on desktop and mobile while cropping excess space evenly.
        */
        .sushi-loader-animation {
          pointer-events: none;
          position: absolute;
          left: 50%;
          top: 50%;
          width:
            max(
              100vw,
              calc(100dvh * 1.75)
            );
          height:
            max(
              100dvh,
              calc(100vw / 1.75)
            );
          transform:
            translate(
              -50%,
              -50%
            );
        }

        :global(.sushi-loader-placeholder) {
          width: 100%;
          height: 100%;
          background: #ffffff;
        }

        .sushi-loader-content {
          pointer-events: none;
          position: relative;
          z-index: 2;
          display: grid;
          width: 100%;
          height: 100%;
          align-items: end;
          justify-items: center;
          padding:
            max(
              18px,
              env(
                safe-area-inset-top
              )
            )
            max(
              16px,
              env(
                safe-area-inset-right
              )
            )
            max(
              34px,
              env(
                safe-area-inset-bottom
              )
            )
            max(
              16px,
              env(
                safe-area-inset-left
              )
            );
        }

        .sushi-loader-start {
          pointer-events: auto;
          min-height: 54px;
          margin-bottom:
            clamp(
              10px,
              6dvh,
              72px
            );
          border: 0;
          background: transparent;
          padding:
            14px
            30px
            14px
            35px;
          color: #ffffff;
          cursor: pointer;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 0.34em;
          line-height: 1;
          text-shadow:
            0 2px 10px
              rgba(
                22,
                28,
                38,
                0.58
              );
          text-transform: uppercase;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          backdrop-filter:
            blur(
              8px
            );
          animation:
            sushi-start-reveal
              720ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              )
              both,
            sushi-start-breathe
              2.8s
              ease-in-out
              850ms
              infinite;
          transition:
            text-shadow
              180ms
              ease,
            transform
              180ms
              ease;
        }

        .sushi-loader-start:hover {
          text-shadow:
            0 2px 10px
              rgba(
                22,
                28,
                38,
                0.58
              ),
            0 0 18px
              rgba(
                255,
                255,
                255,
                0.72
              );
          transform:
            translateY(
              -3px
            )
            scale(
              1.04
            );
        }

        .sushi-loader-start:active {
          transform:
            scale(
              0.97
            );
        }

        .sushi-loader-start:focus-visible {
          outline: 3px solid
            rgba(
              255,
              255,
              255,
              0.88
            );
          outline-offset: 5px;
        }

        @keyframes sushi-start-reveal {
          from {
            opacity: 0;
            filter:
              blur(
                8px
              );
            transform:
              translateY(
                22px
              )
              scale(
                0.92
              );
          }

          to {
            opacity: 1;
            filter:
              blur(
                0
              );
            transform:
              translateY(
                0
              )
              scale(
                1
              );
          }
        }

        @keyframes sushi-start-breathe {
          0%,
          100% {
            text-shadow:
              0 2px 10px
                rgba(
                  22,
                  28,
                  38,
                  0.58
                ),
              0 0 10px
                rgba(
                  255,
                  255,
                  255,
                  0.22
                );
          }

          50% {
            text-shadow:
              0 2px 10px
                rgba(
                  22,
                  28,
                  38,
                  0.58
                ),
              0 0 22px
                rgba(
                  255,
                  255,
                  255,
                  0.58
                );
          }
        }

        @media (
          max-width:
            767px
        ) {
          .sushi-loader-content {
            padding-bottom:
              max(
                22px,
                env(
                  safe-area-inset-bottom
                )
              );
          }

          .sushi-loader-start {
            min-height: 50px;
            margin-bottom:
              clamp(
                8px,
                4dvh,
                34px
              );
            padding:
              13px
              24px
              13px
              29px;
            font-size: 18px;
            letter-spacing:
              0.3em;
          }
        }

        @media (
          max-height:
            520px
        ) {
          .sushi-loader-start {
            min-height: 44px;
            margin-bottom: 0;
            padding:
              10px
              22px
              10px
              27px;
            font-size: 16px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .sushi-loader-start {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
