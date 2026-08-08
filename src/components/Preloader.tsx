"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  playAmbientAudio,
  setAmbientAudioMuted,
} from "@/lib/ambientAudio";

export type PreloaderProps = {
  sceneReady: boolean;
  onEnter: () => void;
  onFinished: () => void;
  musicSrc?: string;
};

function isAbortError(error: unknown) {
  return (
    error instanceof DOMException &&
    error.name === "AbortError"
  );
}

export default function Preloader({
  sceneReady,
  onEnter,
  onFinished,
  musicSrc = "/music/puyopuyomegafan1234-japanese-jazz-2-385180.mp3",
}: PreloaderProps) {
  const [entered, setEntered] =
    useState(false);

  const enteredRef =
    useRef(false);

  const finishFrameRef =
    useRef<number | null>(null);

  const handleEnter =
    useCallback(() => {
      if (
        !sceneReady ||
        enteredRef.current
      ) {
        return;
      }

      enteredRef.current = true;
      setEntered(true);

      void playAmbientAudio(
        musicSrc,
        0.1,
      )
        .then(() => {
          setAmbientAudioMuted(
            false,
          );

          window.dispatchEvent(
            new CustomEvent(
              "ambient:set-muted",
              {
                detail: {
                  muted: false,
                },
              },
            ),
          );
        })
        .catch((error) => {
          if (
            isAbortError(error)
          ) {
            return;
          }

          console.warn(
            "Background audio could not be played. Continuing without music.",
            error,
          );
        });

      onEnter();

      finishFrameRef.current =
        window.requestAnimationFrame(
          () => {
            onFinished();
          },
        );
    }, [
      musicSrc,
      onEnter,
      onFinished,
      sceneReady,
    ]);

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key !== "Enter" ||
        event.repeat ||
        !sceneReady
      ) {
        return;
      }

      event.preventDefault();
      handleEnter();
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    handleEnter,
    sceneReady,
  ]);

  useEffect(() => {
    return () => {
      if (
        finishFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          finishFrameRef.current,
        );
      }
    };
  }, []);

  return (
    <div
      className="minimal-loader"
      aria-busy={!sceneReady}
    >
      <main
        className="minimal-loader__center"
        aria-live="polite"
      >
        {!sceneReady ? (
          <p
            className="minimal-loader__loading"
            role="status"
          >
            Loading
          </p>
        ) : (
          <button
            type="button"
            className="minimal-loader__enter"
            onClick={
              handleEnter
            }
            disabled={
              entered
            }
          >
            Enter
          </button>
        )}
      </main>

      <style jsx>{`
        .minimal-loader {
          position: fixed;
          inset: 0;
          z-index: 200;

          display: grid;

          width: 100%;
          height: 100vh;
          height: 100dvh;

          place-items: center;

          overflow: hidden;

          background:
            #080612;

          color:
            #fff7fd;

          font-family:
            var(--font-body),
            Arial,
            sans-serif;
        }

        /*
         * Center the loading / enter state.
         */
        .minimal-loader__center {
          display: grid;

          min-width:
            180px;

          min-height:
            64px;

          place-items:
            center;
        }

        /*
         * Very simple loading text.
         *
         * No dots.
         * No bouncing.
         * No animated layout.
         *
         * Only opacity changes, which is much lighter
         * while the 3D scene is loading in the background.
         */
        .minimal-loader__loading {
          margin: 0;

          color:
            rgba(
              255,
              247,
              253,
              0.68
            );

          font-size:
            13px;

          font-weight:
            800;

          letter-spacing:
            0.18em;

          line-height: 1;

          text-transform:
            uppercase;

          animation:
            minimalLoaderFade
            1.7s
            ease-in-out
            infinite;

          will-change:
            opacity;
        }

        /*
         * Simple text-style Enter control.
         */
        .minimal-loader__enter {
          position: relative;

          display:
            inline-flex;

          min-height:
            48px;

          align-items:
            center;

          justify-content:
            center;

          border: 0;
          outline: none;

          background:
            transparent;

          padding:
            0
            12px;

          color:
            #fff7fd;

          cursor:
            pointer;

          font:
            inherit;

          font-size:
            13px;

          font-weight:
            800;

          letter-spacing:
            0.18em;

          text-transform:
            uppercase;

          transition:
            color
              160ms ease,
            text-shadow
              160ms ease,
            transform
              160ms ease;
        }

        .minimal-loader__enter:hover:not(
            :disabled
          ) {
          color:
            #ff9dce;

          text-shadow:
            0 0 14px
              rgba(
                255,
                104,
                183,
                0.34
              );

          transform:
            translateY(-2px);
        }

        .minimal-loader__enter:focus-visible {
          outline:
            2px solid
            #69dfff;

          outline-offset:
            6px;

          border-radius:
            6px;

          color:
            #ff9dce;

          text-shadow:
            0 0 12px
              rgba(
                105,
                223,
                255,
                0.28
              );
        }

        .minimal-loader__enter:disabled {
          cursor:
            default;

          opacity:
            0.6;
        }

        /*
         * Very subtle breathing effect.
         *
         * If you want the loading text to be completely
         * static, remove this keyframe and the animation
         * property above.
         */
        @keyframes
          minimalLoaderFade {
          0%,
          100% {
            opacity:
              0.45;
          }

          50% {
            opacity:
              1;
          }
        }

        @media (
          max-width: 600px
        ) {
          .minimal-loader__loading,
          .minimal-loader__enter {
            font-size:
              11px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .minimal-loader__loading {
            animation:
              none;

            opacity:
              0.72;
          }

          .minimal-loader__enter {
            transition:
              none;
          }
        }
      `}</style>
    </div>
  );
}