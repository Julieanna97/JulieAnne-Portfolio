"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useProgress } from "@react-three/drei";
import {
  playAmbientAudio,
  setAmbientAudioMuted,
} from "@/lib/ambientAudio";

interface PreloaderProps {
  onEnter: () => void;
  onFinished: () => void;
  sceneReady: boolean;
  musicSrc?: string;
}

/*
  Keep the curtains visible long enough for their closing animation to finish.

  When the model needs longer than this, the loader remains visible until
  sceneReady becomes true.
*/
const MINIMUM_CURTAIN_TIME_MS = 1050;
const READY_REVEAL_DELAY_MS = 180;

function PreloaderStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 46 }, (_, index) => ({
        id: index,
        left: `${(index * 37 + 7) % 100}%`,
        top: `${(index * 47 + 11) % 96}%`,
        size: 4 + ((index * 11) % 10),
        delay: `${-((index * 0.36) % 5.2)}s`,
        duration: `${2.4 + ((index * 5) % 18) / 10}s`,
      })),
    []
  );

  return (
    <div
      className="preloader-stars"
      aria-hidden="true"
    >
      {stars.map((star) => (
        <span
          key={star.id}
          className="preloader-star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}

export default function Preloader({
  onEnter,
  onFinished,
  sceneReady,
  musicSrc = "/music/lofivision-lost-in-tokyo-242003.mp3",
}: PreloaderProps) {
  const [revealed, setRevealed] = useState(false);
  const [opening, setOpening] = useState(false);
  const [minimumCurtainTimePassed, setMinimumCurtainTimePassed] =
    useState(false);

  const finishTriggeredRef = useRef(false);

  const { progress } = useProgress();

  /*
    Do not show 100% until the complete scene has reported that it is ready.

    Three.js may finish downloading the GLB slightly before your scene controls
    have mounted.
  */
  const displayedProgress = sceneReady
    ? 100
    : Math.min(
        99,
        Math.max(
          1,
          Math.round(progress)
        )
      );

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setRevealed(true);
    }, 420);

    return () => {
      window.clearTimeout(revealTimer);
    };
  }, []);

  useEffect(() => {
    if (!opening) return;

    const curtainTimer = window.setTimeout(() => {
      setMinimumCurtainTimePassed(true);
    }, MINIMUM_CURTAIN_TIME_MS);

    return () => {
      window.clearTimeout(curtainTimer);
    };
  }, [opening]);

  /*
    Remove the preloader only when:
    - the visitor has clicked Enter,
    - the curtain animation has completed,
    - the GLB scene and controls are ready.
  */
  useEffect(() => {
    if (
      !opening ||
      !minimumCurtainTimePassed ||
      !sceneReady ||
      finishTriggeredRef.current
    ) {
      return;
    }

    finishTriggeredRef.current = true;

    const finishTimer = window.setTimeout(() => {
      onFinished();
    }, READY_REVEAL_DELAY_MS);

    return () => {
      window.clearTimeout(finishTimer);
    };
  }, [
    minimumCurtainTimePassed,
    onFinished,
    opening,
    sceneReady,
  ]);

  const handleEnter = () => {
    if (opening) return;

    setOpening(true);

    /*
      Mount the Three.js scene immediately.

      Audio loading must not delay the GLB request.
    */
    onEnter();

    void (async () => {
      try {
        setAmbientAudioMuted(false);

        window.dispatchEvent(
          new CustomEvent("ambient:set-muted", {
            detail: {
              muted: false,
            },
          })
        );

        await playAmbientAudio(
          musicSrc,
          0.1
        );
      } catch (error) {
        console.error(
          "Audio play failed:",
          error
        );
      }
    })();
  };

  return (
    <div
      className={`tokyo-preloader ${
        opening
          ? "is-opening"
          : ""
      }`}
    >
      <PreloaderStars />

      <div className="tokyo-preloader-haze haze-left" />
      <div className="tokyo-preloader-haze haze-right" />
      <div className="tokyo-preloader-haze haze-bottom" />

      <div
        className="tokyo-preloader-skyline"
        aria-hidden="true"
      >
        <span className="building building-one" />
        <span className="building building-two" />
        <span className="building building-three" />
        <span className="building building-four" />
        <span className="building building-five" />

        <span className="power-line line-one" />
        <span className="power-line line-two" />

        <span className="lantern lantern-one" />
        <span className="lantern lantern-two" />
        <span className="lantern lantern-three" />
      </div>

      <div
        className={`tokyo-preloader-content ${
          revealed
            ? "is-visible"
            : ""
        }`}
      >
        <p className="tokyo-preloader-kicker">
          Interactive Portfolio
        </p>

        <h1>Julie Anne</h1>

        <p className="tokyo-preloader-copy">
          A small mysterious adventure through my work.
        </p>

        <button
          type="button"
          onClick={handleEnter}
          disabled={opening}
        >
          <span>
            Enter the street
          </span>

          <i aria-hidden="true">
            →
          </i>
        </button>
      </div>

      <div className="tokyo-preloader-curtain curtain-left" />
      <div className="tokyo-preloader-curtain curtain-right" />

      {opening && (
        <div
          className={`tokyo-scene-loader ${
            sceneReady
              ? "is-ready"
              : ""
          }`}
          role="status"
          aria-live="polite"
          aria-label={
            sceneReady
              ? "Street ready"
              : `Loading 3D street: ${displayedProgress}%`
          }
        >
          <span
            className="tokyo-scene-loader-orbit"
            aria-hidden="true"
          />

          <p>
            {sceneReady
              ? "Street ready"
              : "Preparing the street"}
          </p>

          <div className="tokyo-scene-loader-track">
            <span
              style={{
                width: `${displayedProgress}%`,
              }}
            />
          </div>

          <strong>
            {displayedProgress}%
          </strong>
        </div>
      )}

      <style jsx>{`
        .tokyo-preloader {
          position: fixed;
          inset: 0;
          z-index: 150;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 20% 74%,
              rgba(166, 108, 255, 0.36),
              transparent 30%
            ),
            radial-gradient(
              circle at 82% 72%,
              rgba(76, 151, 255, 0.22),
              transparent 30%
            ),
            radial-gradient(
              circle at 50% 45%,
              rgba(255, 147, 189, 0.08),
              transparent 25%
            ),
            linear-gradient(
              180deg,
              #090d1d 0%,
              #10172f 42%,
              #211a3a 72%,
              #352049 100%
            );
        }

        .preloader-stars {
          pointer-events: none;
          position: absolute;
          inset: 0;
        }

        .preloader-star {
          position: absolute;
          display: block;
          animation: twinkle ease-in-out infinite;
          filter: drop-shadow(
            0 0 5px rgba(255, 255, 255, 0.7)
          );
        }

        .preloader-star::before,
        .preloader-star::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.94);
          transform: translate(-50%, -50%);
        }

        .preloader-star::before {
          width: 100%;
          height: 1.2px;
        }

        .preloader-star::after {
          width: 1.2px;
          height: 100%;
        }

        .tokyo-preloader-haze {
          position: absolute;
          border-radius: 999px;
          filter: blur(48px);
          animation: hazeFloat 9s ease-in-out infinite alternate;
        }

        .haze-left {
          left: -12%;
          bottom: 12%;
          width: 42vw;
          height: 25vw;
          background: rgba(189, 115, 255, 0.22);
        }

        .haze-right {
          right: -12%;
          bottom: 20%;
          width: 40vw;
          height: 23vw;
          background: rgba(67, 151, 255, 0.2);
          animation-delay: -3s;
        }

        .haze-bottom {
          left: 30%;
          bottom: -14%;
          width: 45vw;
          height: 20vw;
          background: rgba(255, 116, 174, 0.13);
          animation-delay: -5s;
        }

        .tokyo-preloader-skyline {
          pointer-events: none;
          position: absolute;
          inset: 0;
          opacity: 0.88;
        }

        .building {
          position: absolute;
          bottom: -2px;
          display: block;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: linear-gradient(
            180deg,
            rgba(18, 20, 39, 0.78),
            rgba(5, 7, 16, 0.96)
          );
          box-shadow: 0 -18px 38px rgba(0, 0, 0, 0.18);
        }

        .building::before {
          content: "";
          position: absolute;
          inset: 15px 12px;
          opacity: 0.45;
          background: repeating-linear-gradient(
            180deg,
            rgba(255, 185, 118, 0.35) 0 4px,
            transparent 4px 17px
          );
        }

        .building-one {
          left: 0;
          width: 18vw;
          height: 28vh;
        }

        .building-two {
          left: 15vw;
          width: 16vw;
          height: 19vh;
        }

        .building-three {
          left: 68vw;
          width: 18vw;
          height: 23vh;
        }

        .building-four {
          right: 0;
          width: 16vw;
          height: 31vh;
        }

        .building-five {
          left: 45vw;
          width: 12vw;
          height: 15vh;
        }

        .power-line {
          position: absolute;
          top: 27%;
          left: -5%;
          width: 112%;
          height: 1px;
          background: rgba(8, 9, 19, 0.82);
          transform: rotate(-5deg);
          transform-origin: left center;
        }

        .line-two {
          top: 34%;
          opacity: 0.72;
          transform: rotate(-3deg);
        }

        .lantern {
          position: absolute;
          display: block;
          width: 20px;
          height: 34px;
          border-radius: 8px;
          background: rgba(255, 128, 97, 0.88);
          box-shadow: 0 0 22px rgba(255, 112, 87, 0.52);
          animation: lanternSway 5s ease-in-out infinite alternate;
        }

        .lantern::before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 100%;
          width: 1px;
          height: 60px;
          background: rgba(7, 8, 15, 0.86);
        }

        .lantern-one {
          left: 17%;
          top: 32%;
        }

        .lantern-two {
          right: 19%;
          top: 26%;
          animation-delay: -2s;
        }

        .lantern-three {
          right: 35%;
          top: 45%;
          animation-delay: -3.4s;
          transform: scale(0.72);
        }

        .tokyo-preloader-content {
          position: relative;
          z-index: 10;
          display: flex;
          min-height: 100dvh;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 24px;
          color: white;
          opacity: 0;
          text-align: center;
          transform: translateY(18px);
          transition:
            opacity 850ms ease,
            transform 850ms ease;
        }

        .tokyo-preloader-content.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .tokyo-preloader-kicker {
          margin: 0;
          color: #e2ccff;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.42em;
          text-transform: uppercase;
        }

        h1 {
          margin: 16px 0 0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(4.6rem, 14vw, 10.5rem);
          font-style: italic;
          font-weight: 500;
          letter-spacing: -0.075em;
          line-height: 0.92;
          text-shadow: 0 8px 28px rgba(0, 0, 0, 0.32);
        }

        .tokyo-preloader-copy {
          margin: 22px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          letter-spacing: 0.12em;
          line-height: 1.6;
          text-transform: uppercase;
        }

        button {
          display: inline-flex;
          margin-top: 36px;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 999px;
          background: rgba(8, 9, 18, 0.58);
          padding: 13px 18px 13px 22px;
          color: white;
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          backdrop-filter: blur(14px);
          transition:
            transform 180ms ease,
            background 180ms ease;
        }

        button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-3px);
        }

        button:disabled {
          cursor: wait;
          opacity: 0.72;
        }

        button i {
          font-size: 17px;
          font-style: normal;
          line-height: 1;
        }

        .tokyo-preloader-curtain {
          pointer-events: none;
          position: absolute;
          top: 0;
          z-index: 30;
          width: 52%;
          height: 100%;
          background: #080b18;
          transform: scaleX(0);
        }

        .curtain-left {
          left: 0;
          transform-origin: left center;
        }

        .curtain-right {
          right: 0;
          transform-origin: right center;
        }

        .is-opening .curtain-left,
        .is-opening .curtain-right {
          animation: curtainClose 900ms
            cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }

        .is-opening .tokyo-preloader-content {
          animation: contentFade 520ms ease forwards;
        }

        .tokyo-scene-loader {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 45;
          display: grid;
          width: min(270px, calc(100vw - 48px));
          justify-items: center;
          gap: 13px;
          color: white;
          opacity: 0;
          text-align: center;
          transform: translate(-50%, -44%);
          animation: loaderAppear 360ms ease 540ms forwards;
        }

        .tokyo-scene-loader-orbit {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(226, 204, 255, 0.28);
          border-top-color: rgba(226, 204, 255, 0.95);
          border-right-color: rgba(126, 168, 255, 0.82);
          border-radius: 999px;
          animation: loaderSpin 900ms linear infinite;
        }

        .tokyo-scene-loader p {
          margin: 0;
          color: rgba(255, 255, 255, 0.88);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }

        .tokyo-scene-loader-track {
          overflow: hidden;
          width: 100%;
          height: 3px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
        }

        .tokyo-scene-loader-track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #d8bfff,
            #85aaff,
            #ff90c8
          );
          box-shadow: 0 0 12px rgba(180, 135, 255, 0.58);
          transition: width 220ms ease;
        }

        .tokyo-scene-loader strong {
          color: rgba(226, 204, 255, 0.88);
          font-size: 10px;
          letter-spacing: 0.2em;
        }

        .tokyo-scene-loader.is-ready .tokyo-scene-loader-orbit {
          border-color: rgba(164, 255, 205, 0.72);
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.18;
            transform: scale(0.56) rotate(0deg);
          }

          52% {
            opacity: 1;
            transform: scale(1.15) rotate(9deg);
          }
        }

        @keyframes hazeFloat {
          from {
            transform: translate3d(-2%, -1%, 0) scale(0.96);
          }

          to {
            transform: translate3d(3%, 2%, 0) scale(1.06);
          }
        }

        @keyframes lanternSway {
          from {
            rotate: -3deg;
          }

          to {
            rotate: 4deg;
          }
        }

        @keyframes curtainClose {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        @keyframes contentFade {
          to {
            opacity: 0;
            transform: scale(0.96);
          }
        }

        @keyframes loaderAppear {
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @keyframes loaderSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 767px) {
          .building-one {
            width: 28vw;
            height: 23vh;
          }

          .building-two {
            left: 22vw;
            width: 24vw;
            height: 16vh;
          }

          .building-three {
            left: 60vw;
            width: 25vw;
            height: 20vh;
          }

          .building-four {
            width: 24vw;
            height: 25vh;
          }

          .building-five {
            left: 44vw;
            width: 18vw;
            height: 13vh;
          }

          .tokyo-preloader-copy {
            max-width: 290px;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}