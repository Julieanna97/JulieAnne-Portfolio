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
    }, 2550);

    const buttonTimer = window.setTimeout(() => {
      setButtonRevealed(true);
    }, 3350);

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
        background: "var(--preloader-background)",
      }}
    >
      {/* Soft clouds around the edges */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="edge-cloud edge-cloud-left-top" />
        <div className="edge-cloud edge-cloud-right-top" />
        <div className="edge-cloud edge-cloud-left-middle" />
        <div className="edge-cloud edge-cloud-right-middle" />
      </div>

      {/* Slowly moving clouds behind the title */}
      <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
        <div className="center-cloud-row center-cloud-row-one">
          <MovingCloud className="h-24 w-[270px]" opacity={0.34} />
          <MovingCloud className="h-20 w-[220px]" opacity={0.28} />
          <MovingCloud className="h-28 w-[310px]" opacity={0.36} />
          <MovingCloud className="h-22 w-[240px]" opacity={0.3} />
        </div>

        <div className="center-cloud-row center-cloud-row-two">
          <MovingCloud className="h-26 w-[290px]" opacity={0.32} />
          <MovingCloud className="h-22 w-[235px]" opacity={0.26} />
          <MovingCloud className="h-30 w-[330px]" opacity={0.36} />
          <MovingCloud className="h-20 w-[215px]" opacity={0.24} />
        </div>

        <div className="center-cloud-row center-cloud-row-three">
          <MovingCloud className="h-24 w-[260px]" opacity={0.28} />
          <MovingCloud className="h-20 w-[210px]" opacity={0.22} />
          <MovingCloud className="h-28 w-[300px]" opacity={0.32} />
          <MovingCloud className="h-22 w-[230px]" opacity={0.24} />
        </div>
      </div>

      {/* Small background stars */}
      <div className="pointer-events-none absolute inset-0 z-[3]">
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

      {/* Decorative sparkles */}
      <div className="pointer-events-none absolute inset-0 z-[4]">
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

      {/* Name and enter button */}
      <div
        className={`relative z-30 flex h-full w-full flex-col items-center justify-center px-6 transition-all duration-700 ${
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
            className="text-center font-display leading-[0.95]"
            style={{
              fontFamily:
                "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: "clamp(5rem, 14vw, 11rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
              color: "var(--preloader-title)",
              textShadow: "0 1px 0 var(--preloader-shadow)",
            }}
          >
            Julie Anne
          </h1>
        </div>

        <p
          className="mt-10 text-center text-[11px] font-semibold uppercase tracking-[0.55em] md:text-xs"
          style={{
            color: "var(--preloader-copy)",
            opacity: textRevealed ? 1 : 0,
            transform: textRevealed ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
          }}
        >
          ⋆ Fullstack Developer ⋆
        </p>

        <button
          type="button"
          onClick={handleEnter}
          disabled={opening || !buttonRevealed}
          className="mt-12 bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.45em] transition duration-500 hover:-translate-y-1 hover:tracking-[0.55em] disabled:cursor-default"
          style={{
            color: "var(--preloader-button)",
            opacity: buttonRevealed ? 1 : 0,
            transform: buttonRevealed
              ? "translateY(0) scale(1)"
              : "translateY(30px) scale(0.96)",
            textShadow: "0 1px 8px var(--preloader-shadow)",
            transition:
              "opacity 1s ease, transform 1s ease, letter-spacing 0.5s ease, color 0.5s ease",
            pointerEvents: buttonRevealed ? "auto" : "none",
          }}
        >
          Enter
        </button>
      </div>

      {/* Large clouds opening upward */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-40 h-[104vh] ${
          cloudsParted ? "top-clouds-reveal-enter" : ""
        }`}
      >
        <div className="top-cloud-bank top-cloud-bank-back" />
        <div className="top-cloud-bank top-cloud-bank-front" />
        <div className="top-cloud-mist" />
      </div>

      {/* Large clouds opening downward */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[104vh] ${
          cloudsParted ? "bottom-clouds-reveal-enter" : ""
        }`}
      >
        <div className="bottom-cloud-bank bottom-cloud-bank-back" />
        <div className="bottom-cloud-bank bottom-cloud-bank-front" />
        <div className="bottom-cloud-mist" />
      </div>

      <style jsx>{`
        .center-cloud-row {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10vw;
          width: max-content;
          will-change: transform;
        }

        .center-cloud-row-one {
          top: 32%;
          left: 0;
          animation: moveCenterCloudsRight 54s linear infinite;
        }

        .center-cloud-row-two {
          top: 48%;
          left: 0;
          animation: moveCenterCloudsLeft 68s linear infinite;
        }

        .center-cloud-row-three {
          top: 63%;
          left: 0;
          animation: moveCenterCloudsRight 78s linear infinite;
        }

        /*
          Dreamy edge clouds
        */
        .edge-cloud {
          position: absolute;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.44);
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
          background: rgba(255, 239, 247, 0.5);
          animation-delay: 0.8s;
        }

        .edge-cloud-right-middle {
          right: -10rem;
          top: 48%;
          width: 29rem;
          height: 11rem;
          background: rgba(238, 231, 255, 0.52);
          animation-delay: 2s;
        }

        /*
          Twilight edge clouds
        */
        :global(html[data-theme="twilight"]) .edge-cloud {
          background: rgba(95, 72, 138, 0.34);
          filter: blur(26px) saturate(0.98);
        }

        :global(html[data-theme="twilight"]) .edge-cloud-left-middle {
          background: rgba(103, 79, 143, 0.28);
        }

        :global(html[data-theme="twilight"]) .edge-cloud-right-middle {
          background: rgba(87, 66, 122, 0.3);
        }

        .top-cloud-bank,
        .bottom-cloud-bank {
          position: absolute;
          left: 50%;
          width: 180vw;
          height: 128%;
          transform: translateX(-50%);
          will-change: transform;
        }

        .top-cloud-bank {
          top: -2%;
        }

        .bottom-cloud-bank {
          bottom: -2%;
        }

        /*
          Day mode: upper back cloud layer
        */
        .top-cloud-bank-back {
          top: 10%;
          opacity: 0.98;
          filter: blur(5px);
          background:
            radial-gradient(
              ellipse 340px 210px at 4% 32%,
              rgba(255, 248, 252, 1) 0%,
              rgba(255, 233, 244, 0.98) 52%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 410px 245px at 19% 45%,
              rgba(255, 249, 253, 1) 0%,
              rgba(251, 232, 247, 0.98) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 370px 220px at 36% 31%,
              rgba(255, 247, 252, 1) 0%,
              rgba(255, 235, 245, 0.98) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 450px 265px at 55% 46%,
              rgba(250, 246, 255, 1) 0%,
              rgba(238, 228, 255, 0.98) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 390px 230px at 74% 33%,
              rgba(255, 248, 252, 1) 0%,
              rgba(248, 236, 253, 0.98) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 420px 250px at 93% 44%,
              rgba(255, 249, 253, 1) 0%,
              rgba(255, 233, 244, 0.98) 54%,
              transparent 76%
            );

          animation: topCloudFloatBack 10s ease-in-out infinite;
        }

        /*
          Day mode: upper front cloud layer
        */
        .top-cloud-bank-front {
          opacity: 1;
          filter: blur(2px);
          background:
            radial-gradient(
              ellipse 330px 205px at 2% 24%,
              #fffafd 0%,
              #fff0f6 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 430px 255px at 16% 38%,
              #fffaff 0%,
              #fdf1fb 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 380px 225px at 31% 26%,
              #fcf7ff 0%,
              #f6edfb 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 470px 275px at 50% 41%,
              #fffaff 0%,
              #fdf2fb 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 410px 240px at 69% 26%,
              #f8f2ff 0%,
              #efe7fb 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 450px 265px at 86% 39%,
              #fffaff 0%,
              #fdf2fb 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 340px 210px at 99% 24%,
              #fffafd 0%,
              #fff0f6 54%,
              transparent 76%
            ),
            linear-gradient(
              to top,
              transparent 0%,
              rgba(249, 235, 247, 0.96) 58%,
              rgba(245, 231, 250, 0.98) 100%
            );

          animation: topCloudFloatFront 8s ease-in-out infinite;
        }

        /*
          Day mode: lower back cloud layer
        */
        .bottom-cloud-bank-back {
          bottom: 10%;
          opacity: 0.98;
          filter: blur(5px);
          background:
            radial-gradient(
              ellipse 340px 210px at 4% 68%,
              rgba(255, 248, 252, 1) 0%,
              rgba(255, 233, 244, 0.98) 52%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 410px 245px at 19% 55%,
              rgba(255, 249, 253, 1) 0%,
              rgba(251, 232, 247, 0.98) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 370px 220px at 36% 68%,
              rgba(255, 247, 252, 1) 0%,
              rgba(255, 235, 245, 0.98) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 450px 265px at 55% 54%,
              rgba(250, 246, 255, 1) 0%,
              rgba(238, 228, 255, 0.98) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 390px 230px at 74% 66%,
              rgba(255, 248, 252, 1) 0%,
              rgba(248, 236, 253, 0.98) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 420px 250px at 93% 57%,
              rgba(255, 249, 253, 1) 0%,
              rgba(255, 233, 244, 0.98) 54%,
              transparent 76%
            );

          animation: bottomCloudFloatBack 10s ease-in-out infinite;
        }

        /*
          Day mode: lower front cloud layer
        */
        .bottom-cloud-bank-front {
          opacity: 1;
          filter: blur(2px);
          background:
            radial-gradient(
              ellipse 330px 205px at 2% 76%,
              #fffafd 0%,
              #fff0f6 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 430px 255px at 16% 62%,
              #fffaff 0%,
              #fdf1fb 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 380px 225px at 31% 74%,
              #fcf7ff 0%,
              #f6edfb 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 470px 275px at 50% 59%,
              #fffaff 0%,
              #fdf2fb 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 410px 240px at 69% 74%,
              #f8f2ff 0%,
              #efe7fb 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 450px 265px at 86% 61%,
              #fffaff 0%,
              #fdf2fb 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 340px 210px at 99% 76%,
              #fffafd 0%,
              #fff0f6 54%,
              transparent 76%
            ),
            linear-gradient(
              to bottom,
              transparent 0%,
              rgba(249, 235, 247, 0.96) 58%,
              rgba(245, 231, 250, 0.98) 100%
            );

          animation: bottomCloudFloatFront 8s ease-in-out infinite;
        }

        /*
          Day-mode mist
        */
        .top-cloud-mist {
          position: absolute;
          inset: -7% -5% auto -5%;
          height: 52%;
          background: linear-gradient(
            0deg,
            rgba(241, 228, 248, 0) 0%,
            rgba(231, 214, 243, 0.32) 42%,
            rgba(218, 205, 238, 0.62) 100%
          );
          filter: blur(8px);
        }

        .bottom-cloud-mist {
          position: absolute;
          inset: auto -5% -7% -5%;
          height: 52%;
          background: linear-gradient(
            180deg,
            rgba(241, 228, 248, 0) 0%,
            rgba(231, 214, 243, 0.32) 42%,
            rgba(218, 205, 238, 0.62) 100%
          );
          filter: blur(8px);
        }

        /*
          Twilight mode:
          Use actual purple gradients rather than applying brightness()
          to the daytime clouds. This avoids the flat gray appearance.
        */
        :global(html[data-theme="twilight"]) .top-cloud-bank-back {
          top: 10%;
          opacity: 0.95;
          filter: blur(6px) saturate(0.95);
          background:
            radial-gradient(
              ellipse 340px 210px at 4% 32%,
              rgba(87, 66, 122, 0.95) 0%,
              rgba(70, 52, 103, 0.88) 52%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 410px 245px at 19% 45%,
              rgba(103, 79, 143, 0.94) 0%,
              rgba(79, 60, 118, 0.88) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 370px 220px at 36% 31%,
              rgba(92, 69, 131, 0.94) 0%,
              rgba(74, 56, 108, 0.87) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 450px 265px at 55% 46%,
              rgba(107, 82, 145, 0.95) 0%,
              rgba(83, 63, 122, 0.89) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 390px 230px at 74% 33%,
              rgba(94, 74, 130, 0.94) 0%,
              rgba(73, 56, 110, 0.87) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 420px 250px at 93% 44%,
              rgba(87, 66, 122, 0.95) 0%,
              rgba(67, 50, 100, 0.88) 54%,
              transparent 76%
            );
        }

        :global(html[data-theme="twilight"]) .top-cloud-bank-front {
          opacity: 0.98;
          filter: blur(3px) saturate(0.98);
          background:
            radial-gradient(
              ellipse 330px 205px at 2% 24%,
              rgba(103, 79, 143, 0.96) 0%,
              rgba(85, 64, 126, 0.9) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 430px 255px at 16% 38%,
              rgba(118, 92, 160, 0.96) 0%,
              rgba(92, 70, 134, 0.9) 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 380px 225px at 31% 26%,
              rgba(98, 77, 138, 0.95) 0%,
              rgba(79, 60, 117, 0.89) 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 470px 275px at 50% 41%,
              rgba(124, 97, 167, 0.97) 0%,
              rgba(95, 72, 138, 0.91) 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 410px 240px at 69% 26%,
              rgba(103, 79, 143, 0.95) 0%,
              rgba(83, 63, 122, 0.89) 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 450px 265px at 86% 39%,
              rgba(113, 87, 154, 0.96) 0%,
              rgba(90, 68, 131, 0.9) 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 340px 210px at 99% 24%,
              rgba(98, 77, 138, 0.96) 0%,
              rgba(77, 58, 114, 0.89) 54%,
              transparent 76%
            ),
            linear-gradient(
              to top,
              transparent 0%,
              rgba(77, 58, 114, 0.74) 58%,
              rgba(48, 35, 70, 0.92) 100%
            );
        }

        :global(html[data-theme="twilight"]) .bottom-cloud-bank-back {
          bottom: 10%;
          opacity: 0.95;
          filter: blur(6px) saturate(0.95);
          background:
            radial-gradient(
              ellipse 340px 210px at 4% 68%,
              rgba(87, 66, 122, 0.95) 0%,
              rgba(70, 52, 103, 0.88) 52%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 410px 245px at 19% 55%,
              rgba(103, 79, 143, 0.94) 0%,
              rgba(79, 60, 118, 0.88) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 370px 220px at 36% 68%,
              rgba(92, 69, 131, 0.94) 0%,
              rgba(74, 56, 108, 0.87) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 450px 265px at 55% 54%,
              rgba(107, 82, 145, 0.95) 0%,
              rgba(83, 63, 122, 0.89) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 390px 230px at 74% 66%,
              rgba(94, 74, 130, 0.94) 0%,
              rgba(73, 56, 110, 0.87) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 420px 250px at 93% 57%,
              rgba(87, 66, 122, 0.95) 0%,
              rgba(67, 50, 100, 0.88) 54%,
              transparent 76%
            );
        }

        :global(html[data-theme="twilight"]) .bottom-cloud-bank-front {
          opacity: 0.98;
          filter: blur(3px) saturate(0.98);
          background:
            radial-gradient(
              ellipse 330px 205px at 2% 76%,
              rgba(103, 79, 143, 0.96) 0%,
              rgba(85, 64, 126, 0.9) 54%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 430px 255px at 16% 62%,
              rgba(118, 92, 160, 0.96) 0%,
              rgba(92, 70, 134, 0.9) 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 380px 225px at 31% 74%,
              rgba(98, 77, 138, 0.95) 0%,
              rgba(79, 60, 117, 0.89) 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 470px 275px at 50% 59%,
              rgba(124, 97, 167, 0.97) 0%,
              rgba(95, 72, 138, 0.91) 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 410px 240px at 69% 74%,
              rgba(103, 79, 143, 0.95) 0%,
              rgba(83, 63, 122, 0.89) 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 450px 265px at 86% 61%,
              rgba(113, 87, 154, 0.96) 0%,
              rgba(90, 68, 131, 0.9) 56%,
              transparent 78%
            ),
            radial-gradient(
              ellipse 340px 210px at 99% 76%,
              rgba(98, 77, 138, 0.96) 0%,
              rgba(77, 58, 114, 0.89) 54%,
              transparent 76%
            ),
            linear-gradient(
              to bottom,
              transparent 0%,
              rgba(77, 58, 114, 0.74) 58%,
              rgba(48, 35, 70, 0.92) 100%
            );
        }

        :global(html[data-theme="twilight"]) .top-cloud-mist {
          background: linear-gradient(
            0deg,
            rgba(35, 25, 51, 0) 0%,
            rgba(73, 56, 110, 0.34) 42%,
            rgba(48, 35, 70, 0.76) 100%
          );
        }

        :global(html[data-theme="twilight"]) .bottom-cloud-mist {
          background: linear-gradient(
            180deg,
            rgba(35, 25, 51, 0) 0%,
            rgba(73, 56, 110, 0.34) 42%,
            rgba(48, 35, 70, 0.76) 100%
          );
        }

        .top-clouds-reveal-enter {
          animation: topCloudsMoveUp 2.8s cubic-bezier(0.77, 0, 0.175, 1)
            forwards;
        }

        .bottom-clouds-reveal-enter {
          animation: bottomCloudsMoveDown 2.8s cubic-bezier(0.77, 0, 0.175, 1)
            forwards;
        }

        .content-fade {
          animation: contentFade 0.7s ease forwards;
        }

        .preloader-fade-out {
          animation: preloaderFadeOut 1.1s ease forwards;
        }

        @keyframes moveCenterCloudsRight {
          0% {
            transform: translateX(-48vw);
          }

          100% {
            transform: translateX(115vw);
          }
        }

        @keyframes moveCenterCloudsLeft {
          0% {
            transform: translateX(115vw);
          }

          100% {
            transform: translateX(-48vw);
          }
        }

        @keyframes topCloudsMoveUp {
          0% {
            transform: translateY(0);
          }

          100% {
            transform: translateY(-62%);
          }
        }

        @keyframes bottomCloudsMoveDown {
          0% {
            transform: translateY(0);
          }

          100% {
            transform: translateY(62%);
          }
        }

        @keyframes topCloudFloatBack {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }

          50% {
            transform: translateX(-48.5%) translateY(12px);
          }
        }

        @keyframes topCloudFloatFront {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }

          50% {
            transform: translateX(-51.5%) translateY(18px);
          }
        }

        @keyframes bottomCloudFloatBack {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }

          50% {
            transform: translateX(-48.5%) translateY(-12px);
          }
        }

        @keyframes bottomCloudFloatFront {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }

          50% {
            transform: translateX(-51.5%) translateY(-18px);
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
          .top-cloud-bank,
          .bottom-cloud-bank {
            width: 260vw;
          }

          .center-cloud-row {
            gap: 18vw;
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

function MovingCloud({
  className = "",
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      className={`moving-cloud relative shrink-0 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <style jsx>{`
        /*
          Full overlapping cloud lobes for a softer and more natural shape.
        */
        .moving-cloud {
          border-radius: 999px;
          filter: blur(7px);
          background:
            radial-gradient(
              ellipse 26% 42% at 8% 67%,
              rgba(255, 235, 255, 0.95) 0%,
              rgba(255, 235, 255, 0.88) 48%,
              transparent 72%
            ),
            radial-gradient(
              ellipse 30% 50% at 23% 56%,
              rgba(255, 245, 255, 0.98) 0%,
              rgba(255, 245, 255, 0.9) 50%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 28% 48% at 41% 66%,
              rgba(255, 235, 255, 0.93) 0%,
              rgba(255, 235, 255, 0.86) 52%,
              transparent 75%
            ),
            radial-gradient(
              ellipse 34% 56% at 61% 53%,
              rgba(255, 245, 255, 0.98) 0%,
              rgba(255, 245, 255, 0.9) 50%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 29% 48% at 80% 65%,
              rgba(248, 238, 255, 0.94) 0%,
              rgba(248, 238, 255, 0.86) 52%,
              transparent 75%
            ),
            radial-gradient(
              ellipse 25% 42% at 96% 58%,
              rgba(245, 250, 255, 0.95) 0%,
              rgba(245, 250, 255, 0.86) 50%,
              transparent 72%
            ),
            linear-gradient(
              to bottom,
              transparent 0%,
              rgba(255, 238, 255, 0.38) 54%,
              rgba(255, 232, 255, 0.72) 100%
            );
        }

        .moving-cloud::after {
          content: "";
          position: absolute;
          inset: 18% 6% 8%;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.18),
            rgba(255, 220, 250, 0.16)
          );
          filter: blur(12px);
        }

        /*
          Twilight moving clouds:
          the same family of purples used in the larger opening clouds.
        */
        :global(html[data-theme="twilight"]) .moving-cloud {
          background:
            radial-gradient(
              ellipse 26% 42% at 8% 67%,
              rgba(87, 66, 122, 0.92) 0%,
              rgba(87, 66, 122, 0.8) 48%,
              transparent 72%
            ),
            radial-gradient(
              ellipse 30% 50% at 23% 56%,
              rgba(107, 82, 145, 0.95) 0%,
              rgba(107, 82, 145, 0.84) 50%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 28% 48% at 41% 66%,
              rgba(92, 69, 131, 0.9) 0%,
              rgba(92, 69, 131, 0.78) 52%,
              transparent 75%
            ),
            radial-gradient(
              ellipse 34% 56% at 61% 53%,
              rgba(103, 79, 143, 0.95) 0%,
              rgba(103, 79, 143, 0.83) 50%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 29% 48% at 80% 65%,
              rgba(87, 66, 122, 0.9) 0%,
              rgba(87, 66, 122, 0.78) 52%,
              transparent 75%
            ),
            radial-gradient(
              ellipse 25% 42% at 96% 58%,
              rgba(94, 74, 130, 0.92) 0%,
              rgba(94, 74, 130, 0.8) 50%,
              transparent 72%
            ),
            linear-gradient(
              to bottom,
              transparent 0%,
              rgba(63, 45, 91, 0.32) 54%,
              rgba(39, 28, 60, 0.78) 100%
            );

          filter: blur(8px) saturate(0.9);
        }

        :global(html[data-theme="twilight"]) .moving-cloud::after {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.08),
            rgba(212, 188, 255, 0.1)
          );
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