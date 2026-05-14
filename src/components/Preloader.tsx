"use client";

import { useState } from "react";
import { playAmbientAudio } from "@/lib/ambientAudio";

interface PreloaderProps {
  onEnter: () => void;
  musicSrc?: string;
}

export default function Preloader({
  onEnter,
  musicSrc = "/music/ambient.mp3",
}: PreloaderProps) {
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleEnter = async () => {
    if (opening) return;
    setOpening(true);

    window.dispatchEvent(new CustomEvent("room:intro"));

    try {
      await playAmbientAudio(musicSrc, 0.1);
    } catch (err) {
      console.error("Audio play failed:", err);
    }

    onEnter();

    window.setTimeout(() => {
      setHidden(true);
    }, 1900);
  };

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden ${
        opening ? "preloader-fade-out" : ""
      }`}
      style={{
        background:
          "radial-gradient(circle at 20% 72%, rgba(255, 170, 190, 0.55), transparent 32%), radial-gradient(circle at 78% 68%, rgba(151, 207, 255, 0.5), transparent 34%), radial-gradient(circle at 50% 18%, rgba(255, 239, 204, 0.75), transparent 38%), linear-gradient(180deg, #fff7ec 0%, #f8dfe8 48%, #d8d5ff 100%)",
      }}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[55vh] ${
          opening ? "curtain-up" : ""
        }`}
      >
        <div className="preloader-cloud cloud-top" />
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[55vh] ${
          opening ? "curtain-down" : ""
        }`}
      >
        <div className="preloader-cloud cloud-bottom" />
      </div>

      <div
        className={`relative z-10 flex h-full w-full flex-col items-center justify-center px-6 ${
          opening ? "content-fade" : ""
        }`}
      >
        <p className="mb-6 animate-pulse text-xs font-black uppercase tracking-[0.45em] text-[#a875d8]/80">
          ☁ welcome ☁
        </p>

        <h1
          className="text-center font-display text-5xl font-bold leading-[1.05] text-[#3b2a45] md:text-7xl"
          style={{ textShadow: "0 4px 24px rgba(255,255,255,0.85)" }}
        >
          Julie Anne&apos;s
          <br />
          <span className="text-[#a875d8]">Portfolio Room</span>
        </h1>

        <p
          className="mt-6 max-w-md text-center text-sm font-semibold leading-relaxed text-[#7a4d77] md:text-base"
          style={{ textShadow: "0 1px 8px rgba(255,255,255,0.8)" }}
        >
          Step into a cozy little world floating in the clouds.
        </p>

        <button
          type="button"
          onClick={handleEnter}
          disabled={opening}
          className="mt-12 rounded-full bg-white px-10 py-4 text-base font-black uppercase tracking-[0.25em] text-[#5a3a6e] shadow-2xl transition-transform duration-300 hover:scale-110 disabled:opacity-70"
          style={{
            boxShadow:
              "0 10px 30px rgba(168,117,216,0.3), 0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {opening ? "Opening..." : "✨ Enter"}
        </button>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#a875d8]/60">
          🎵 click to enter with music
        </p>
      </div>

      <style jsx>{`
        .preloader-cloud {
          position: absolute;
          left: 50%;
          width: 140vw;
          height: 100%;
          transform: translateX(-50%);
          background:
            radial-gradient(ellipse 240px 140px at 12% 60%, #ffffff 0%, #ffffff 50%, rgba(255, 255, 255, 0) 65%),
            radial-gradient(ellipse 280px 160px at 28% 45%, #ffffff 0%, #ffffff 50%, rgba(255, 255, 255, 0) 65%),
            radial-gradient(ellipse 260px 150px at 45% 55%, #ffffff 0%, #ffffff 50%, rgba(255, 255, 255, 0) 65%),
            radial-gradient(ellipse 300px 170px at 62% 40%, #ffffff 0%, #ffffff 50%, rgba(255, 255, 255, 0) 65%),
            radial-gradient(ellipse 270px 150px at 80% 55%, #ffffff 0%, #ffffff 50%, rgba(255, 255, 255, 0) 65%),
            radial-gradient(ellipse 250px 140px at 95% 45%, #ffffff 0%, #ffffff 50%, rgba(255, 255, 255, 0) 65%);
        }

        .cloud-top {
          background-position-y: 0;
          mask-image: linear-gradient(to bottom, #000 65%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, #000 65%, transparent 100%);
        }

        .cloud-bottom {
          background-position-y: 100%;
          transform: translateX(-50%) scaleY(-1);
          mask-image: linear-gradient(to bottom, #000 65%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, #000 65%, transparent 100%);
        }

        @keyframes curtainUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-110vh);
          }
        }

        @keyframes curtainDown {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(110vh);
          }
        }

        @keyframes contentFade {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.92);
          }
        }

        @keyframes preloaderFadeOut {
          0%,
          65% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .curtain-up {
          animation: curtainUp 1.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .curtain-down {
          animation: curtainDown 1.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .content-fade {
          animation: contentFade 0.55s ease forwards;
        }

        .preloader-fade-out {
          animation: preloaderFadeOut 1.9s ease forwards;
        }
      `}</style>
    </div>
  );
}