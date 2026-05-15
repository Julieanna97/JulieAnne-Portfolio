"use client";

import { useEffect, useState } from "react";
import { playAmbientAudio } from "@/lib/ambientAudio";

interface PreloaderProps {
  onEnter: () => void;
  musicSrc?: string;
}

export default function Preloader({
  onEnter,
  musicSrc = "/music/ambient.mp3",
}: PreloaderProps) {
  const [cloudsParted, setCloudsParted] = useState(false);
  const [textRevealed, setTextRevealed] = useState(false);
  const [buttonRevealed, setButtonRevealed] = useState(false);
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const cloudTimer = window.setTimeout(() => {
      setCloudsParted(true);
    }, 700);

    const textTimer = window.setTimeout(() => {
      setTextRevealed(true);
    }, 2600);

    const buttonTimer = window.setTimeout(() => {
      setButtonRevealed(true);
    }, 3400);

    return () => {
      window.clearTimeout(cloudTimer);
      window.clearTimeout(textTimer);
      window.clearTimeout(buttonTimer);
    };
  }, []);

  const handleEnter = async () => {
    if (opening || !buttonRevealed) return;

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
    }, 1100);
  };

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden ${
        opening ? "preloader-fade-out" : ""
      }`}
      style={{
        background:
          "radial-gradient(circle at 18% 65%, rgba(255, 218, 232, 0.7), transparent 38%), radial-gradient(circle at 82% 70%, rgba(217, 213, 245, 0.6), transparent 40%), radial-gradient(circle at 50% 22%, rgba(255, 240, 235, 0.75), transparent 45%), linear-gradient(180deg, #fde8ec 0%, #f6e3ee 45%, #ece4f5 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="stars" />
        <div className="tiny-sparkles" />
        <div className="soft-glow" />
      </div>

      <div
        className={`relative z-10 flex h-full w-full flex-col items-center justify-center px-6 transition-all duration-700 ${
          opening ? "content-fade" : ""
        }`}
      >
        <div
          className="relative flex flex-col items-center"
          style={{
            opacity: textRevealed ? 1 : 0,
            transform: textRevealed ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 1.2s ease, transform 1.2s ease",
          }}
        >
          <svg
            className="pointer-events-none absolute top-[-2.5rem] md:top-[-3.5rem]"
            width="520"
            height="120"
            viewBox="0 0 520 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ maxWidth: "92vw" }}
          >
            <path
              d="M10 90 Q 260 -10 510 90"
              stroke="url(#arcGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            <defs>
              <linearGradient id="arcGradient" x1="0" y1="0" x2="520" y2="0">
                <stop offset="0%" stopColor="#e8c7d9" stopOpacity="0" />
                <stop offset="35%" stopColor="#c9a3d4" />
                <stop offset="65%" stopColor="#d4a8c0" />
                <stop offset="100%" stopColor="#e8c7d9" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <svg
            className="pointer-events-none absolute bottom-[-2.5rem] md:bottom-[-3.5rem]"
            width="520"
            height="120"
            viewBox="0 0 520 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ maxWidth: "92vw" }}
          >
            <path
              d="M10 30 Q 260 130 510 30"
              stroke="url(#arcGradient2)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            <defs>
              <linearGradient id="arcGradient2" x1="0" y1="0" x2="520" y2="0">
                <stop offset="0%" stopColor="#e8c7d9" stopOpacity="0" />
                <stop offset="35%" stopColor="#d4a8c0" />
                <stop offset="65%" stopColor="#c9a3d4" />
                <stop offset="100%" stopColor="#e8c7d9" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <Sparkle
            className="absolute left-[-3rem] top-[10%] md:left-[-5rem]"
            size={28}
            delay="0s"
          />
          <Sparkle
            className="absolute left-[-1.5rem] top-[60%] md:left-[-3.5rem]"
            size={18}
            delay="0.6s"
          />
          <Sparkle
            className="absolute right-[-3rem] top-[20%] md:right-[-5rem]"
            size={32}
            delay="1.2s"
          />
          <Sparkle
            className="absolute right-[-1rem] top-[70%] md:right-[-3rem]"
            size={20}
            delay="0.3s"
          />
          <Sparkle
            className="absolute left-[40%] top-[-1.5rem]"
            size={14}
            delay="0.9s"
          />
          <Sparkle
            className="absolute bottom-[-1.5rem] right-[35%]"
            size={16}
            delay="1.5s"
          />

          <h1
            className="text-center font-display leading-[0.95] text-[#3b2a45]"
            style={{
              fontFamily:
                "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: "clamp(5rem, 14vw, 11rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
              textShadow:
                "0 4px 24px rgba(255,255,255,0.6), 0 0 40px rgba(232, 199, 217, 0.5)",
            }}
          >
            Julie Anne
          </h1>
        </div>

        <p
          style={{
            opacity: textRevealed ? 1 : 0,
            transform: textRevealed ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
          }}
          className="mt-10 text-center text-[11px] font-semibold uppercase tracking-[0.55em] text-[#8b6b9e] md:text-xs"
        >
          ⋆ Fullstack Developer ⋆
        </p>

        <button
          type="button"
          onClick={handleEnter}
          disabled={opening || !buttonRevealed}
          style={{
            opacity: buttonRevealed ? 1 : 0,
            transform: buttonRevealed
              ? "translateY(0) scale(1)"
              : "translateY(30px) scale(0.96)",
            transition:
              "opacity 1s ease, transform 1s ease, letter-spacing 0.5s ease, color 0.5s ease",
            pointerEvents: buttonRevealed ? "auto" : "none",
          }}
          className="mt-14 bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.45em] text-[#8b6b9e] hover:text-[#3b2a45] hover:tracking-[0.55em] disabled:cursor-default"
        >
          Enter
        </button>
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[58vh] ${
          cloudsParted ? "clouds-reveal-enter" : ""
        }`}
      >
        <div className="cloud-bank cloud-bank-back" />
        <div className="cloud-bank cloud-bank-front" />
        <div className="cloud-mist" />
      </div>

      <style jsx>{`
        .stars {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(255, 255, 255, 0.85) 0 1.5px, transparent 2.5px),
            radial-gradient(circle, rgba(255, 255, 255, 0.55) 0 1px, transparent 2px);
          background-size: 150px 150px, 210px 210px;
          background-position: 20px 30px, 80px 70px;
        }

        .tiny-sparkles {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(232, 199, 217, 0.6) 0 1px, transparent 2px),
            radial-gradient(circle, rgba(217, 199, 232, 0.5) 0 1.2px, transparent 2.5px);
          background-size: 80px 80px, 130px 130px;
          background-position: 40px 20px, 10px 60px;
          opacity: 0.7;
        }

        .soft-glow {
          position: absolute;
          left: 50%;
          top: 45%;
          width: 720px;
          height: 720px;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            rgba(255, 230, 240, 0.35) 0%,
            rgba(230, 215, 245, 0.22) 35%,
            transparent 65%
          );
          filter: blur(32px);
        }

        .cloud-bank {
          position: absolute;
          left: 50%;
          bottom: -10%;
          width: 155vw;
          height: 112%;
          transform: translateX(-50%);
          filter: blur(5px);
          will-change: transform;
        }

        .cloud-bank-back {
          opacity: 0.86;
          bottom: 12%;
          filter: blur(8px);
          background:
            radial-gradient(ellipse 300px 175px at 8% 65%, rgba(255, 240, 247, 0.98) 0%, rgba(255, 240, 247, 0.92) 48%, transparent 70%),
            radial-gradient(ellipse 350px 200px at 25% 55%, rgba(252, 235, 245, 0.98) 0%, rgba(252, 235, 245, 0.94) 50%, transparent 72%),
            radial-gradient(ellipse 320px 190px at 46% 64%, rgba(255, 240, 247, 0.96) 0%, rgba(255, 240, 247, 0.9) 52%, transparent 72%),
            radial-gradient(ellipse 390px 215px at 68% 52%, rgba(248, 235, 248, 0.98) 0%, rgba(248, 235, 248, 0.94) 50%, transparent 72%),
            radial-gradient(ellipse 330px 190px at 88% 65%, rgba(255, 240, 247, 0.98) 0%, rgba(255, 240, 247, 0.92) 50%, transparent 72%);
          animation: cloudFloatBack 9s ease-in-out infinite;
        }

        .cloud-bank-front {
          opacity: 1;
          filter: blur(4px);
          background:
            radial-gradient(ellipse 290px 170px at 4% 72%, #ffeef4 0%, #ffeef4 50%, transparent 72%),
            radial-gradient(ellipse 380px 220px at 17% 58%, #fdf3f7 0%, #fdf3f7 52%, transparent 74%),
            radial-gradient(ellipse 330px 195px at 34% 70%, #f7ebf3 0%, #f7ebf3 54%, transparent 76%),
            radial-gradient(ellipse 420px 240px at 54% 58%, #fdf3f7 0%, #fdf3f7 52%, transparent 74%),
            radial-gradient(ellipse 360px 205px at 73% 70%, #f0e8f5 0%, #f0e8f5 54%, transparent 76%),
            radial-gradient(ellipse 410px 235px at 93% 60%, #fdf3f7 0%, #fdf3f7 52%, transparent 74%),
            linear-gradient(to bottom, transparent 0%, rgba(253, 238, 244, 0.96) 60%, #fdeef4 100%);
          animation: cloudFloatFront 8s ease-in-out infinite;
        }

        .cloud-mist {
          position: absolute;
          inset: auto -5% -8% -5%;
          height: 62%;
          background: linear-gradient(
            180deg,
            rgba(253, 238, 244, 0) 0%,
            rgba(253, 238, 244, 0.78) 35%,
            rgba(248, 232, 242, 1) 100%
          );
          filter: blur(16px);
        }

        .clouds-reveal-enter {
          animation: cloudsMoveDown 2.8s cubic-bezier(0.77, 0, 0.175, 1)
            forwards;
        }

        .content-fade {
          animation: contentFade 0.7s ease forwards;
        }

        .preloader-fade-out {
          animation: preloaderFadeOut 1.1s ease forwards;
        }

        @keyframes cloudsMoveDown {
          0% {
            transform: translateY(0);
          }

          100% {
            transform: translateY(74%);
          }
        }

        @keyframes cloudFloatBack {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }

          50% {
            transform: translateX(-50%) translateY(-10px);
          }
        }

        @keyframes cloudFloatFront {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }

          50% {
            transform: translateX(-50%) translateY(-15px);
          }
        }

        @keyframes contentFade {
          0% {
            opacity: 1;
            transform: scale(1);
          }

          100% {
            opacity: 0;
            transform: scale(0.96);
          }
        }

        @keyframes preloaderFadeOut {
          0% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .soft-glow {
            width: 480px;
            height: 480px;
          }

          .cloud-bank {
            width: 220vw;
          }
        }
      `}</style>
    </div>
  );
}

function Sparkle({
  className = "",
  size = 24,
  delay = "0s",
}: {
  className?: string;
  size?: number;
  delay?: string;
}) {
  return (
    <div
      className={`pointer-events-none sparkle-twinkle ${className}`}
      style={{
        width: size,
        height: size,
        animationDelay: delay,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        <path
          d="M12 0 Q 13 10 24 12 Q 13 14 12 24 Q 11 14 0 12 Q 11 10 12 0 Z"
          fill="url(#sparkleGrad)"
        />
        <defs>
          <radialGradient id="sparkleGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="60%" stopColor="#f4d4e3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c9a3d4" stopOpacity="0.6" />
          </radialGradient>
        </defs>
      </svg>

      <style jsx>{`
        .sparkle-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.85) rotate(0deg);
          }

          50% {
            opacity: 1;
            transform: scale(1.1) rotate(15deg);
          }
        }
      `}</style>
    </div>
  );
}