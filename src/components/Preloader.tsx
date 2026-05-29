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
          "radial-gradient(circle at 18% 65%, rgba(255, 218, 232, 0.78), transparent 38%), radial-gradient(circle at 82% 70%, rgba(217, 213, 245, 0.68), transparent 40%), radial-gradient(circle at 50% 22%, rgba(255, 240, 235, 0.82), transparent 45%), linear-gradient(180deg, #fde8ec 0%, #f6e3ee 45%, #ece4f5 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-[1]">
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

      <div className="pointer-events-none absolute inset-0 z-[2]">
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
          className="absolute left-[17%] bottom-[27%]"
          size={22}
          delay="1.1s"
        />
        <Sparkle
          className="absolute right-[20%] bottom-[24%]"
          size={26}
          delay="0.4s"
        />
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
          .cloud-bank {
            width: 220vw;
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
        style={{ width: "100%", height: "100%" }}
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
        style={{ width: "100%", height: "100%" }}
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