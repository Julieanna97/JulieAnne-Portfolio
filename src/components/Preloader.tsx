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

const TERMINAL_LINES = [
  "> Initializing portfolio...",
  "> Loading Tokyo scene...",
  "> Waking the city lights...",
  "> Almost ready!",
];

const TOTAL_CHARACTERS = TERMINAL_LINES.reduce(
  (total, line) => total + line.length,
  0
);

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
  const [typedLines, setTypedLines] = useState<string[]>(
    () => TERMINAL_LINES.map(() => "")
  );

  const [completedLines, setCompletedLines] = useState(0);
  const [terminalComplete, setTerminalComplete] = useState(false);
  const [startVisible, setStartVisible] = useState(false);

  const enteredRef = useRef(false);
  const typingTimerRef = useRef<number | null>(null);
  const finishFrameRef = useRef<number | null>(null);

  /*
    Type each terminal line and show [ OK ] as soon as that
    individual line has finished typing.
  */
  useEffect(() => {
    let cancelled = false;
    let lineIndex = 0;
    let characterIndex = 0;

    const typeNextCharacter = () => {
      if (cancelled) {
        return;
      }

      const currentLine = TERMINAL_LINES[lineIndex];

      if (characterIndex < currentLine.length) {
        characterIndex += 1;

        setTypedLines((previousLines) => {
          const nextLines = [...previousLines];

          nextLines[lineIndex] = currentLine.slice(
            0,
            characterIndex
          );

          return nextLines;
        });

        typingTimerRef.current = window.setTimeout(
          typeNextCharacter,
          characterIndex === 1 ? 140 : 22
        );

        return;
      }

      /*
        Mark this line complete immediately.
      */
      setCompletedLines(lineIndex + 1);

      if (lineIndex < TERMINAL_LINES.length - 1) {
        lineIndex += 1;
        characterIndex = 0;

        typingTimerRef.current = window.setTimeout(
          typeNextCharacter,
          170
        );

        return;
      }

      typingTimerRef.current = window.setTimeout(() => {
        if (!cancelled) {
          setTerminalComplete(true);
        }
      }, 220);
    };

    typingTimerRef.current = window.setTimeout(
      typeNextCharacter,
      260
    );

    return () => {
      cancelled = true;

      if (typingTimerRef.current !== null) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  /*
    Show the start control only after both the terminal and
    actual Three.js scene are ready.
  */
  useEffect(() => {
    if (!sceneReady || !terminalComplete) {
      setStartVisible(false);
      return;
    }

    const revealTimer = window.setTimeout(() => {
      setStartVisible(true);
    }, 180);

    return () => {
      window.clearTimeout(revealTimer);
    };
  }, [sceneReady, terminalComplete]);

  useEffect(() => {
    return () => {
      if (finishFrameRef.current !== null) {
        window.cancelAnimationFrame(
          finishFrameRef.current
        );
      }
    };
  }, []);

  const handleStart = useCallback(() => {
    if (
      !sceneReady ||
      !startVisible ||
      enteredRef.current
    ) {
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

    finishFrameRef.current =
      window.requestAnimationFrame(() => {
        onFinished();
      });
  }, [
    musicSrc,
    onEnter,
    onFinished,
    sceneReady,
    startVisible,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        startVisible
      ) {
        handleStart();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [handleStart, startVisible]);

  /*
    The bar progresses with the typing animation.

    It pauses at 94% if the terminal finishes before the Three.js
    scene, then reaches 100% as soon as both are ready.
  */
  const typedCharacterCount = typedLines.reduce(
    (total, line) => total + line.length,
    0
  );

  const typingRatio =
    TOTAL_CHARACTERS > 0
      ? typedCharacterCount / TOTAL_CHARACTERS
      : 0;

  const fullyReady =
    terminalComplete && sceneReady;

  const progressPercent = fullyReady
    ? 100
    : Math.min(
        94,
        7 + typingRatio * 87
      );

  return (
    <div className="sakura-loader">
      <div
        className="sakura-loader-haze sakura-loader-haze--pink"
        aria-hidden="true"
      />

      <div
        className="sakura-loader-haze sakura-loader-haze--violet"
        aria-hidden="true"
      />

      <main
        className="sakura-loader-card"
        role="status"
        aria-live="polite"
        aria-busy={!fullyReady}
        aria-label={
          fullyReady
            ? "The interactive portfolio is ready"
            : "Loading the interactive portfolio"
        }
      >
        <div
          className="sakura-loader-window-bar"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />

          <b>BOOT.PORTFOLIO</b>
        </div>

        {/*
          No inner box, grid, scanlines, petals, or animated cat.
        */}
        <div className="sakura-loader-terminal">
          <p className="sakura-loader-version">
            BOOT.PORTFOLIO v2.0.6
          </p>

          <div className="sakura-loader-lines">
            {typedLines.map((line, index) => {
              const lineComplete =
                index < completedLines;

              const currentLine =
                index === completedLines &&
                !terminalComplete;

              return (
                <p key={index}>
                  <span>
                    {line}

                    {currentLine && (
                      <b className="sakura-loader-cursor">
                        ▋
                      </b>
                    )}
                  </span>

                  {lineComplete && (
                    <em>[ OK ]</em>
                  )}
                </p>
              );
            })}
          </div>
        </div>

        <div
          className="sakura-loader-progress"
          role="progressbar"
          aria-label="Portfolio loading progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(
            progressPercent
          )}
        >
          <span
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>

        <p className="sakura-loader-copy">
          {fullyReady
            ? "YOUR TOKYO NIGHT IS READY"
            : terminalComplete
              ? "PREPARING THE 3D WORLD..."
              : "BUILDING SOMETHING MAGICAL..."}
        </p>

        {startVisible && (
          <button
            type="button"
            className="sakura-loader-start"
            onClick={handleStart}
          >
            <span>PRESS</span>
            <kbd>ENTER</kbd>
            <span>TO START</span>
            <b>→</b>
          </button>
        )}
      </main>

      <style jsx>{`
        .sakura-loader {
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
              circle at 50% 12%,
              rgba(165, 99, 255, 0.13),
              transparent 32%
            ),
            radial-gradient(
              circle at 18% 80%,
              rgba(255, 71, 164, 0.15),
              transparent 32%
            ),
            linear-gradient(
              180deg,
              #070611 0%,
              #05040d 55%,
              #020208 100%
            );
          font-family: var(--font-body), sans-serif;
        }

        .sakura-loader-card {
          position: relative;
          z-index: 3;
          width: min(620px, calc(100vw - 32px));
          overflow: hidden;
          border: 1px solid
            rgba(238, 150, 255, 0.38);
          border-radius: 26px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 12, 31, 0.96),
              rgba(8, 8, 22, 0.94)
            ),
            rgba(9, 8, 24, 0.94);
          box-shadow:
            0 0 0 1px
              rgba(255, 255, 255, 0.035)
              inset,
            0 0 30px
              rgba(214, 70, 255, 0.16),
            0 30px 90px
              rgba(0, 0, 0, 0.62);
          padding: 0 28px 28px;
          color: white;
        }

        .sakura-loader-window-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 -28px;
          border-bottom: 1px solid
            rgba(232, 147, 255, 0.2);
          background:
            rgba(131, 51, 168, 0.14);
          padding: 13px 18px;
        }

        .sakura-loader-window-bar span {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: #ff7bb9;
          box-shadow:
            0 0 10px
            rgba(255, 92, 176, 0.72);
        }

        .sakura-loader-window-bar span:nth-child(2) {
          background: #b16cff;
        }

        .sakura-loader-window-bar span:nth-child(3) {
          background: #65ddff;
        }

        .sakura-loader-window-bar b {
          margin-left: 8px;
          color:
            rgba(239, 220, 255, 0.72);
          font-family:
            var(--font-mono),
            monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        /*
          Plain terminal area: no border, no rounded inner box,
          no scanline grid, and no background animation.
        */
        .sakura-loader-terminal {
          min-height: 245px;
          padding: 38px 24px 25px;
          font-family:
            var(--font-mono),
            monospace;
        }

        .sakura-loader-version {
          margin: 0 0 25px;
          color: #ff76c6;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.17em;
          text-transform: uppercase;
          text-shadow:
            0 0 14px
            rgba(255, 95, 192, 0.48);
        }

        .sakura-loader-lines {
          display: grid;
          gap: 14px;
        }

        .sakura-loader-lines p {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            auto;
          align-items: center;
          min-height: 20px;
          margin: 0;
          color:
            rgba(239, 235, 255, 0.86);
          font-size:
            clamp(10px, 1.4vw, 13px);
          line-height: 1.55;
        }

        .sakura-loader-lines em {
          color: #8ae7ff;
          font-size: 10px;
          font-style: normal;
          letter-spacing: 0.08em;
          text-shadow:
            0 0 10px
            rgba(101, 221, 255, 0.52);
          animation:
            sakura-loader-ok
            260ms ease-out both;
        }

        .sakura-loader-cursor {
          margin-left: 3px;
          color: #ff76c6;
          animation:
            sakura-loader-blink
            760ms steps(1) infinite;
        }

        .sakura-loader-progress {
          height: 10px;
          overflow: hidden;
          border: 1px solid
            rgba(224, 140, 255, 0.42);
          border-radius: 999px;
          background:
            rgba(3, 3, 12, 0.72);
          box-shadow:
            inset 0 0 12px
            rgba(126, 55, 191, 0.18);
        }

        .sakura-loader-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #8b5cff,
              #f252b5,
              #ff8bd0
            );
          box-shadow:
            0 0 18px
            rgba(244, 74, 182, 0.75);
          transition:
            width 220ms
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            );
        }

        .sakura-loader-copy {
          margin: 14px 0 0;
          color:
            rgba(226, 215, 255, 0.66);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.24em;
          text-align: center;
          text-transform: uppercase;
        }

        .sakura-loader-start {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 13px;
          margin-top: 22px;
          border: 1px solid
            rgba(238, 128, 255, 0.5);
          border-radius: 14px;
          background:
            linear-gradient(
              110deg,
              rgba(128, 59, 196, 0.2),
              rgba(255, 72, 172, 0.16)
            );
          padding: 17px 18px;
          color: #fff7ff;
          cursor: pointer;
          font: inherit;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.21em;
          text-transform: uppercase;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .sakura-loader-start:hover {
          transform: translateY(-2px);
          border-color:
            rgba(255, 170, 237, 0.84);
          background:
            linear-gradient(
              110deg,
              rgba(128, 59, 196, 0.31),
              rgba(255, 72, 172, 0.25)
            );
          box-shadow:
            0 0 24px
            rgba(223, 74, 255, 0.17);
        }

        .sakura-loader-start:active {
          transform: scale(0.985);
        }

        .sakura-loader-start:focus-visible {
          outline: 2px solid white;
          outline-offset: 4px;
        }

        .sakura-loader-start kbd {
          border: 1px solid
            rgba(255, 255, 255, 0.22);
          border-radius: 6px;
          background:
            linear-gradient(
              180deg,
              #a65fff,
              #7135c9
            );
          box-shadow:
            0 0 12px
            rgba(164, 82, 255, 0.42);
          padding: 7px 10px;
          color: white;
          font: inherit;
          font-size: 9px;
        }

        .sakura-loader-start b {
          color: #ff8dcc;
          font-size: 17px;
          text-shadow:
            0 0 9px
            rgba(255, 97, 190, 0.7);
        }

        .sakura-loader-haze {
          position: absolute;
          width: 38vw;
          height: 38vw;
          border-radius: 999px;
          filter: blur(100px);
          opacity: 0.3;
          pointer-events: none;
        }

        .sakura-loader-haze--pink {
          left: -13vw;
          bottom: -10vw;
          background:
            rgba(255, 66, 157, 0.31);
        }

        .sakura-loader-haze--violet {
          top: -12vw;
          right: -13vw;
          background:
            rgba(135, 87, 255, 0.25);
        }

        @keyframes sakura-loader-blink {
          0%,
          48% {
            opacity: 1;
          }

          49%,
          100% {
            opacity: 0;
          }
        }

        @keyframes sakura-loader-ok {
          from {
            opacity: 0;
            transform: translateX(5px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 767px) {
          .sakura-loader-card {
            width: min(
              94vw,
              560px
            );
            border-radius: 20px;
            padding:
              0 18px 20px;
          }

          .sakura-loader-window-bar {
            margin: 0 -18px;
          }

          .sakura-loader-terminal {
            min-height: 230px;
            padding:
              30px 7px 22px;
          }

          .sakura-loader-lines {
            gap: 12px;
          }

          .sakura-loader-lines p {
            font-size:
              clamp(
                9px,
                2.9vw,
                12px
              );
          }

          .sakura-loader-start {
            gap: 8px;
            padding: 15px 8px;
            font-size: 8px;
            letter-spacing: 0.16em;
          }

          .sakura-loader-start kbd {
            padding: 6px 8px;
          }

          .sakura-loader-haze {
            width: 65vw;
            height: 65vw;
            filter: blur(74px);
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .sakura-loader-cursor,
          .sakura-loader-lines em {
            animation: none;
          }

          .sakura-loader-progress span,
          .sakura-loader-start {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}