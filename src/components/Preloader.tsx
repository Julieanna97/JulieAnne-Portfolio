"use client";

import { useEffect, useState } from "react";
import { playAmbientAudio } from "@/lib/ambientAudio";

interface PreloaderProps {
  onEnter: () => void;
  musicSrc?: string;
}

const tinyStars = [
  { left: "7%", top: "13%", size: 9, delay: "0s" },
  { left: "14%", top: "21%", size: 12, delay: "0.8s" },
  { left: "23%", top: "10%", size: 8, delay: "1.2s" },
  { left: "35%", top: "18%", size: 10, delay: "0.4s" },
  { left: "47%", top: "9%", size: 13, delay: "1.5s" },
  { left: "58%", top: "22%", size: 8, delay: "0.7s" },
  { left: "70%", top: "12%", size: 11, delay: "1.1s" },
  { left: "82%", top: "19%", size: 9, delay: "0.3s" },
  { left: "91%", top: "10%", size: 12, delay: "1.7s" },

  { left: "10%", top: "39%", size: 10, delay: "1.4s" },
  { left: "21%", top: "48%", size: 8, delay: "0.5s" },
  { left: "33%", top: "36%", size: 12, delay: "1s" },
  { left: "43%", top: "45%", size: 9, delay: "0.2s" },
  { left: "57%", top: "38%", size: 11, delay: "1.8s" },
  { left: "69%", top: "49%", size: 8, delay: "0.9s" },
  { left: "81%", top: "37%", size: 12, delay: "1.3s" },
  { left: "92%", top: "46%", size: 9, delay: "0.6s" },

  { left: "8%", top: "72%", size: 12, delay: "0.7s" },
  { left: "18%", top: "80%", size: 9, delay: "1.6s" },
  { left: "30%", top: "70%", size: 10, delay: "0.4s" },
  { left: "42%", top: "78%", size: 8, delay: "1.2s" },
  { left: "55%", top: "69%", size: 13, delay: "0.8s" },
  { left: "67%", top: "82%", size: 9, delay: "1.5s" },
  { left: "79%", top: "72%", size: 11, delay: "0.1s" },
  { left: "90%", top: "79%", size: 8, delay: "1.1s" },
];

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

    try {
      await playAmbientAudio(musicSrc, 0.1);
    } catch (error) {
      console.error("Audio play failed:", error);
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
          "radial-gradient(circle at 18% 65%, rgba(255, 201, 225, 0.55), transparent 34%), radial-gradient(circle at 82% 70%, rgba(198, 188, 245, 0.5), transparent 36%), radial-gradient(circle at 50% 18%, rgba(231, 214, 255, 0.42), transparent 40%), linear-gradient(180deg, #edd8ea 0%, #d9cdec 48%, #cfc6ea 100%)",
      }}
    >
      {/* Soft edge clouds that remain visible */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="edge-cloud edge-cloud-left-top" />
        <div className="edge-cloud edge-cloud-right-top" />
        <div className="edge-cloud edge-cloud-left-middle" />
        <div className="edge-cloud edge-cloud-right-middle" />
      </div>

      {/* Small background stars */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        {tinyStars.map((star, index) => (
          <TinyStar
            key={index}
            left={star.left}
            top={star.top}
            size={star.size}
            delay={star.delay}
          />
        ))}
      </div>

      {/* Larger decorative sparkles */}
      <div className="pointer-events-none absolute inset-0 z-[3]">
        <Sparkle
          className="absolute left-[10%] top-[16%]"
          size={28}
          delay="0s"
        />

        <Sparkle
          className="absolute right-[14%] top-[20%]"
          size={24}
          delay="0.7s"
        />

        <Sparkle
          className="absolute bottom-[27%] left-[17%]"
          size={22}
          delay="1.1s"
        />

        <Sparkle
          className="absolute bottom-[24%] right-[20%]"
          size={26}
          delay="0.4s"
        />
      </div>

      {/* Main clouds sit behind the title and Enter button */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[68vh] ${
          cloudsParted ? "clouds-reveal-enter" : ""
        }`}
      >
        <div className="cloud-bank cloud-bank-back" />
        <div className="cloud-bank cloud-bank-front" />
        <div className="cloud-mist" />
      </div>

      {/* Content stays above the cloud layers */}
      <div
        className={`relative z-30 flex h-full w-full flex-col items-center justify-center px-6 transition-all duration-700 ${
          opening ? "content-fade" : ""
        }`}
      >
        <div
          className="relative flex flex-col items-center"
          style={{
            opacity: textRevealed ? 1 : 0,
            transform: textRevealed
              ? "translateY(0)"
              : "translateY(24px)",
            transition: "opacity 1.2s ease, transform 1.2s ease",
          }}
        >
          <Sparkle
            className="absolute left-[-3rem] top-[10%] md:left-[-5rem]"
            size={38}
            delay="0s"
          />

          <Sparkle
            className="absolute left-[-1.5rem] top-[60%] md:left-[-3.5rem]"
            size={24}
            delay="0.6s"
          />

          <Sparkle
            className="absolute right-[-3rem] top-[20%] md:right-[-5rem]"
            size={40}
            delay="1.2s"
          />

          <Sparkle
            className="absolute right-[-1rem] top-[70%] md:right-[-3rem]"
            size={26}
            delay="0.3s"
          />

          <Sparkle
            className="absolute left-[40%] top-[-2.2rem]"
            size={22}
            delay="0.9s"
          />

          <Sparkle
            className="absolute bottom-[-2rem] right-[35%]"
            size={22}
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
              textShadow: "0 1px 0 rgba(255,255,255,0.45)",
            }}
          >
            Julie Anne
          </h1>
        </div>

        <p
          className="mt-10 text-center text-[11px] font-semibold uppercase tracking-[0.55em] text-[#8b6b9e] md:text-xs"
          style={{
            opacity: textRevealed ? 1 : 0,
            transform: textRevealed
              ? "translateY(0)"
              : "translateY(24px)",
            transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
          }}
        >
          ⋆ Fullstack Developer ⋆
        </p>

        <button
          type="button"
          onClick={handleEnter}
          disabled={opening || !buttonRevealed}
          className="mt-12 bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.45em] text-[#765388] transition duration-500 hover:-translate-y-1 hover:text-[#3b2a45] hover:tracking-[0.55em] disabled:cursor-default"
          style={{
            opacity: buttonRevealed ? 1 : 0,
            transform: buttonRevealed
              ? "translateY(0) scale(1)"
              : "translateY(30px) scale(0.96)",
            textShadow: "0 1px 8px rgba(255, 255, 255, 0.95)",
            transition:
              "opacity 1s ease, transform 1s ease, letter-spacing 0.5s ease, color 0.5s ease",
            pointerEvents: buttonRevealed ? "auto" : "none",
          }}
        >
          Enter
        </button>
      </div>

      <style jsx>{`
        .edge-cloud {
          position: absolute;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.42);
          filter: blur(24px);
          animation: edgeCloudFloat 10s ease-in-out infinite;
        }

        .edge-cloud-left-top {
          left: -7rem;
          top: 8%;
          width: 24rem;
          height: 9rem;
        }

        .edge-cloud-right-top {
          right: -8rem;
          top: 16%;
          width: 26rem;
          height: 10rem;
          animation-delay: 1.4s;
        }

        .edge-cloud-left-middle {
          left: -10rem;
          top: 42%;
          width: 28rem;
          height: 11rem;
          background: rgba(255, 239, 247, 0.48);
          animation-delay: 0.8s;
        }

        .edge-cloud-right-middle {
          right: -10rem;
          top: 48%;
          width: 29rem;
          height: 11rem;
          background: rgba(238, 231, 255, 0.5);
          animation-delay: 2s;
        }

        .cloud-bank {
          position: absolute;
          left: 50%;
          bottom: -8%;
          width: 155vw;
          height: 116%;
          transform: translateX(-50%);
          will-change: transform;
        }

        .cloud-bank-back {
          bottom: 14%;
          opacity: 0.9;
          filter: blur(5px);
          background:
            radial-gradient(
              ellipse 300px 175px at 8% 65%,
              rgba(255, 246, 250, 1) 0%,
              rgba(255, 236, 244, 0.96) 50%,
              transparent 72%
            ),
            radial-gradient(
              ellipse 350px 200px at 25% 55%,
              rgba(255, 245, 251, 1) 0%,
              rgba(250, 232, 247, 0.96) 52%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 320px 190px at 46% 64%,
              rgba(255, 244, 250, 1) 0%,
              rgba(255, 236, 244, 0.96) 54%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 390px 215px at 68% 52%,
              rgba(248, 242, 255, 1) 0%,
              rgba(238, 227, 255, 0.96) 52%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 330px 190px at 88% 65%,
              rgba(255, 246, 250, 1) 0%,
              rgba(255, 236, 244, 0.96) 52%,
              transparent 74%
            );

          animation: cloudFloatBack 9s ease-in-out infinite;
        }

        .cloud-bank-front {
          opacity: 0.92;
          filter: blur(2px);
          background:
            radial-gradient(
              ellipse 290px 170px at 4% 72%,
              #fff9fb 0%,
              #fff0f5 52%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 380px 220px at 17% 58%,
              #fffaff 0%,
              #fdf2fb 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 330px 195px at 34% 70%,
              #fcf6ff 0%,
              #f7edf9 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 420px 240px at 54% 58%,
              #fffaff 0%,
              #fdf2fb 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 360px 205px at 73% 70%,
              #f7f1ff 0%,
              #efe7fb 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 410px 235px at 93% 60%,
              #fffaff 0%,
              #fdf2fb 54%,
              transparent 76%
            ),
            linear-gradient(
              to bottom,
              transparent 0%,
              rgba(249, 235, 247, 0.9) 58%,
              rgba(245, 231, 250, 0.94) 100%
            );

          animation: cloudFloatFront 8s ease-in-out infinite;
        }

        .cloud-mist {
          position: absolute;
          inset: auto -5% -8% -5%;
          height: 42%;
          background: linear-gradient(
            180deg,
            rgba(241, 228, 248, 0) 0%,
            rgba(229, 213, 243, 0.22) 44%,
            rgba(218, 205, 238, 0.42) 100%
          );
          filter: blur(8px);
        }

        .clouds-reveal-enter {
          animation: cloudsMoveDown 2.8s
            cubic-bezier(0.77, 0, 0.175, 1) forwards;
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
            transform: translateY(38%);
          }
        }

        @keyframes cloudFloatBack {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }

          50% {
            transform: translateX(-50%) translateY(-12px);
          }
        }

        @keyframes cloudFloatFront {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }

          50% {
            transform: translateX(-50%) translateY(-18px);
          }
        }

        @keyframes edgeCloudFloat {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }

          50% {
            transform: translateX(18px) translateY(-10px);
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
          .cloud-bank {
            width: 220vw;
          }

          .edge-cloud-left-top,
          .edge-cloud-left-middle {
            left: -14rem;
          }

          .edge-cloud-right-top,
          .edge-cloud-right-middle {
            right: -14rem;
          }
        }
      `}</style>
    </div>
  );
}

function TinyStar({
  left,
  top,
  size = 10,
  delay = "0s",
}: {
  left: string;
  top: string;
  size?: number;
  delay?: string;
}) {
  return (
    <span
      className="tiny-star"
      style={{
        left,
        top,
        width: size,
        height: size,
        animationDelay: delay,
      }}
    >
      <svg
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <path
          d="M7 1.5V4.8M7 9.2V12.5M1.5 7H4.8M9.2 7H12.5"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <style jsx>{`
        .tiny-star {
          position: absolute;
          display: block;
          opacity: 0;
          animation: tinyStarPop 3.4s ease-in-out infinite;
        }

        @keyframes tinyStarPop {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.4) rotate(0deg);
          }

          18% {
            opacity: 1;
            transform: scale(1.2) rotate(8deg);
          }

          35% {
            opacity: 0.75;
            transform: scale(0.95) rotate(-4deg);
          }

          55% {
            opacity: 0;
            transform: scale(0.4) rotate(0deg);
          }
        }
      `}</style>
    </span>
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
    <span
      className={`accent-star ${className}`}
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
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <path
          d="M12 2.5C12.8 7.6 16.4 11.2 21.5 12C16.4 12.8 12.8 16.4 12 21.5C11.2 16.4 7.6 12.8 2.5 12C7.6 11.2 11.2 7.6 12 2.5Z"
          stroke="#d96c9f"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>

      <style jsx>{`
        .accent-star {
          position: relative;
          display: block;
          opacity: 0;
          animation: accentStarPop 2.8s ease-in-out infinite;
        }

        @keyframes accentStarPop {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.55) rotate(0deg);
          }

          20% {
            opacity: 1;
            transform: scale(1.15) rotate(8deg);
          }

          42% {
            opacity: 0.9;
            transform: scale(1) rotate(-4deg);
          }

          65% {
            opacity: 0;
            transform: scale(0.55) rotate(0deg);
          }
        }
      `}</style>
    </span>
  );
}