"use client";

import {
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

const START_REVEAL_DELAY_MS = 220;

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
  musicSrc = "/music/lofivision-lost-in-tokyo-242003.mp3",
}: PreloaderProps) {
  const [startVisible, setStartVisible] = useState(false);
  const enteredRef = useRef(false);
  const finishFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sceneReady) {
      setStartVisible(false);
      return;
    }

    const revealTimer = window.setTimeout(() => {
      setStartVisible(true);
    }, START_REVEAL_DELAY_MS);

    return () => {
      window.clearTimeout(revealTimer);
    };
  }, [sceneReady]);

  useEffect(() => {
    return () => {
      if (finishFrameRef.current !== null) {
        window.cancelAnimationFrame(finishFrameRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    if (!sceneReady || !startVisible || enteredRef.current) {
      return;
    }

    enteredRef.current = true;

    void playAmbientAudio(musicSrc, 0.1)
      .then(() => {
        setAmbientAudioMuted(false);

        window.dispatchEvent(
          new CustomEvent("ambient:set-muted", {
            detail: {
              muted: false,
            },
          })
        );
      })
      .catch((error) => {
        if (isAbortError(error)) {
          return;
        }

        console.warn(
          "Background audio could not be played. Continuing without music.",
          error
        );
      });

    onEnter();

    finishFrameRef.current = window.requestAnimationFrame(() => {
      onFinished();
    });
  };

  return (
    <div className="tokyo-loader">
      <div className="tokyo-loader-stars" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${(index * 37 + 11) % 100}%`,
              top: `${(index * 53 + 7) % 88}%`,
              animationDelay: `-${(index * 0.42) % 3.4}s`,
            }}
          />
        ))}
      </div>

      <div
        className="tokyo-loader-glow tokyo-loader-glow--pink"
        aria-hidden="true"
      />

      <div
        className="tokyo-loader-glow tokyo-loader-glow--cyan"
        aria-hidden="true"
      />

      <main
        className="tokyo-loader-content"
        role="status"
        aria-live="polite"
        aria-busy={!sceneReady}
        aria-label={
          sceneReady
            ? "The interactive portfolio is ready"
            : "Loading the interactive portfolio"
        }
      >

        {!startVisible ? (
          <div className="tokyo-loader-loading">
            <span>LOADING A LITTLE WORLD</span>

            <div
              className="tokyo-loader-dots"
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="tokyo-loader-start"
            onClick={handleStart}
          >
            Start
          </button>
        )}
      </main>

      <style jsx>{`
        .tokyo-loader {
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
            radial-gradient(
              circle at 20% 72%,
              rgba(255, 96, 159, 0.14),
              transparent 30%
            ),
            radial-gradient(
              circle at 78% 66%,
              rgba(82, 210, 255, 0.12),
              transparent 34%
            ),
            linear-gradient(180deg, #080711 0%, #05050b 56%, #020307 100%);
        }

        .tokyo-loader-content {
          position: relative;
          z-index: 3;
          display: grid;
          justify-items: center;
          padding: 24px;
          text-align: center;
        }

        .tokyo-loader-kicker {
          margin: 0;
          color: rgba(223, 202, 255, 0.78);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.34em;
          text-transform: uppercase;
        }

        .tokyo-loader-title {
          margin: 12px 0 0;
          color: #ffffff;
          font-size: clamp(2.4rem, 8vw, 5.4rem);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.92;
          text-shadow:
            0 0 18px rgba(255, 255, 255, 0.12),
            0 0 30px rgba(255, 96, 159, 0.16);
        }

        .tokyo-loader-loading {
          display: grid;
          justify-items: center;
          gap: 14px;
          margin-top: 28px;
          color: rgba(255, 255, 255, 0.82);
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 0.34em;
          line-height: 1.2;
          text-align: center;
          text-transform: uppercase;
        }

        .tokyo-loader-dots {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .tokyo-loader-loading i {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: #ff79ad;
          box-shadow: 0 0 12px rgba(255, 121, 173, 0.68);
          animation: tokyo-loader-dot 1.1s ease-in-out infinite;
        }

        .tokyo-loader-loading i:nth-child(2) {
          animation-delay: 160ms;
        }

        .tokyo-loader-loading i:nth-child(3) {
          animation-delay: 320ms;
        }

        .tokyo-loader-start {
          margin-top: 28px;
          border: 0;
          background: transparent;
          padding: 12px 18px;
          color: #ffffff;
          cursor: pointer;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 0.34em;
          line-height: 1;
          text-shadow:
            0 0 10px rgba(255, 255, 255, 0.46),
            0 0 22px rgba(255, 121, 173, 0.46);
          text-transform: uppercase;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          animation:
            tokyo-loader-start-reveal 680ms cubic-bezier(0.16, 1, 0.3, 1)
              both,
            tokyo-loader-start-breathe 2.6s ease-in-out 760ms infinite;
          transition:
            transform 180ms ease,
            text-shadow 180ms ease;
        }

        .tokyo-loader-start:hover {
          transform: translateY(-3px) scale(1.05);
          text-shadow:
            0 0 13px rgba(255, 255, 255, 0.7),
            0 0 28px rgba(255, 121, 173, 0.72);
        }

        .tokyo-loader-start:active {
          transform: scale(0.97);
        }

        .tokyo-loader-start:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.84);
          outline-offset: 5px;
        }

        .tokyo-loader-stars {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .tokyo-loader-stars span {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.54);
          animation: tokyo-loader-star 3.4s ease-in-out infinite;
        }

        .tokyo-loader-glow {
          position: absolute;
          width: 34vw;
          height: 34vw;
          border-radius: 999px;
          filter: blur(94px);
          opacity: 0.36;
        }

        .tokyo-loader-glow--pink {
          left: -12vw;
          bottom: -6vw;
          background: rgba(255, 76, 167, 0.38);
        }

        .tokyo-loader-glow--cyan {
          right: -12vw;
          top: -7vw;
          background: rgba(75, 214, 255, 0.26);
        }

        @keyframes tokyo-loader-dot {
          0%,
          100% {
            opacity: 0.34;
            transform: scale(0.76);
          }

          50% {
            opacity: 1;
            transform: scale(1.12);
          }
        }

        @keyframes tokyo-loader-star {
          0%,
          100% {
            opacity: 0.18;
            transform: scale(0.74);
          }

          50% {
            opacity: 0.86;
            transform: scale(1.12);
          }
        }

        @keyframes tokyo-loader-start-reveal {
          from {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(18px) scale(0.92);
          }

          to {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0) scale(1);
          }
        }

        @keyframes tokyo-loader-start-breathe {
          0%,
          100% {
            opacity: 0.78;
          }

          50% {
            opacity: 1;
          }
        }

        @media (max-width: 767px) {
          .tokyo-loader-content {
            padding: 18px;
          }

          .tokyo-loader-title {
            font-size: clamp(2.9rem, 14vw, 4.8rem);
          }

          .tokyo-loader-loading {
            max-width: min(92vw, 520px);
            margin-top: 24px;
            font-size: 20px;
            letter-spacing: 0.26em;
          }

          .tokyo-loader-start {
            margin-top: 24px;
            font-size: 20px;
          }

          .tokyo-loader-glow {
            width: 62vw;
            height: 62vw;
            filter: blur(72px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tokyo-loader-loading i,
          .tokyo-loader-stars span,
          .tokyo-loader-start {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
