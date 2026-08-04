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
          setAmbientAudioMuted(false);

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
          if (isAbortError(error)) {
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
      <div
        className="minimal-loader__brand"
        aria-label="Julie Anne Portfolio"
      >
        <span
          className="minimal-loader__brand-icon"
          aria-hidden="true"
        >
          <span>JA</span>
        </span>

        <span className="minimal-loader__brand-copy">
          <strong>
            Julie Anne
          </strong>

          <small>
            Cantillep
          </small>
        </span>
      </div>

      <main
        className="minimal-loader__center"
        aria-live="polite"
      >
        {!sceneReady ? (
          <div
            className="minimal-loader__loading"
            role="status"
          >
            <span>
              Loading
            </span>

            <span
              className="minimal-loader__dots"
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
            </span>
          </div>
        ) : (
          <button
            type="button"
            className="minimal-loader__enter"
            onClick={handleEnter}
            disabled={entered}
          >
          <span>Enter</span>
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

          background: #080612;
          color: #fff7fd;

          font-family:
            var(--font-body),
            Arial,
            sans-serif;
        }

        /*
         * Lightweight top-left website mark.
         * This uses no image request.
         */

        .minimal-loader__brand {
          position: absolute;
          top: max(
            24px,
            env(
              safe-area-inset-top
            )
          );
          left: max(
            24px,
            env(
              safe-area-inset-left
            )
          );

          display: inline-flex;
          align-items: center;

          gap: 11px;
        }

        .minimal-loader__brand-icon {
          position: relative;

          display: grid;
          width: 39px;
          height: 39px;

          place-items: center;

          overflow: hidden;

          border: 2px solid
            #ff68b7;
          border-radius: 11px;

          background:
            radial-gradient(
              circle,
              rgba(
                154,
                92,
                255,
                0.7
              )
                1.4px,
              transparent 1.7px
            );

          background-size:
            7px 7px;

          box-shadow:
            0 0 14px
              rgba(
                255,
                104,
                183,
                0.18
              );
        }

        .minimal-loader__brand-icon
          span {
          position: relative;
          z-index: 2;

          display: grid;
          width: 25px;
          height: 25px;

          place-items: center;

          border-radius: 7px;

          background:
            rgba(
              8,
              6,
              18,
              0.88
            );

          color: #fff7fd;

          font-family:
            var(--font-mono),
            monospace;

          font-size: 9px;
          font-weight: 700;
          letter-spacing: -0.06em;
        }

        .minimal-loader__brand-copy {
          display: grid;
          gap: 2px;

          line-height: 1;
        }

        .minimal-loader__brand-copy
          strong {
          color: #fff7fd;

          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .minimal-loader__brand-copy
          small {
          color: #caa8ff;

          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        /*
         * Center loading state.
         */

        .minimal-loader__center {
          display: grid;
          min-width: 180px;
          min-height: 64px;

          place-items: center;
        }

        .minimal-loader__loading {
          display: inline-flex;
          align-items: baseline;

          gap: 8px;

          color:
            rgba(
              255,
              247,
              253,
              0.58
            );

          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.14em;
          line-height: 1;
          text-transform: uppercase;
        }

        .minimal-loader__dots {
          display: inline-flex;
          gap: 3px;
        }

        .minimal-loader__dots i {
          display: block;

          width: 3px;
          height: 3px;

          border-radius: 999px;

          background: #ff68b7;

          opacity: 0.22;

          animation:
            minimalLoaderDot
            1.2s ease-in-out
            infinite;
        }

        .minimal-loader__dots
          i:nth-child(2) {
          animation-delay: 160ms;
        }

        .minimal-loader__dots
          i:nth-child(3) {
          animation-delay: 320ms;
        }

        /*
         * Simple text-style Enter control.
         */

        .minimal-loader__enter {
          position: relative;

          display: inline-flex;
          min-height: 48px;

          align-items: center;
          justify-content: center;

          border: 0;
          outline: none;

          background: transparent;

          padding: 0 12px;

          color: #fff7fd;
          cursor: pointer;

          font: inherit;
          font-size: 13px;
          font-weight: 800;

          letter-spacing: 0.18em;
          text-transform: uppercase;

          transition:
            color 160ms ease,
            text-shadow 160ms ease,
            transform 160ms ease;
        }

        .minimal-loader__enter:hover:not(
            :disabled
          ) {
          color: #ff9dce;

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

          outline-offset: 6px;

          border-radius: 6px;

          color: #ff9dce;

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
          cursor: default;
          opacity: 0.6;
        }

        .minimal-loader__footer {
          position: absolute;
          bottom: max(
            24px,
            env(
              safe-area-inset-bottom
            )
          );

          margin: 0;

          color:
            rgba(
              202,
              168,
              255,
              0.46
            );

          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        @keyframes minimalLoaderDot {
          0%,
          70%,
          100% {
            opacity: 0.2;
            transform:
              translateY(0);
          }

          35% {
            opacity: 1;
            transform:
              translateY(-2px);
          }
        }

        @media (
          max-width: 600px
        ) {
          .minimal-loader__brand {
            top: max(
              18px,
              env(
                safe-area-inset-top
              )
            );
            left: max(
              18px,
              env(
                safe-area-inset-left
              )
            );
          }

          .minimal-loader__brand-icon {
            width: 35px;
            height: 35px;
          }

          .minimal-loader__brand-copy
            strong {
            font-size: 9px;
          }

          .minimal-loader__loading,
          .minimal-loader__enter {
            font-size: 11px;
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .minimal-loader__dots i {
            animation: none;
            opacity: 0.72;
          }

          .minimal-loader__enter {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}