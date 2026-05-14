"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Preloader from "@/components/Preloader";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => null,
});

type RoomNavigationTarget = "about" | "projects" | "credits";

function CloudShape({
  className = "",
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 100"
      className={className}
      style={{ opacity }}
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="cloudGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,1)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(255,245,250,0.85)" />
        </radialGradient>

        <filter id="cloudSoft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>

      <g filter="url(#cloudSoft)" fill="url(#cloudGrad)">
        <ellipse cx="100" cy="62" rx="78" ry="26" />
        <circle cx="58" cy="52" r="22" />
        <circle cx="92" cy="38" r="28" />
        <circle cx="128" cy="44" r="24" />
        <circle cx="155" cy="56" r="18" />
        <circle cx="38" cy="60" r="16" />
      </g>
    </svg>
  );
}

export default function HomePage() {
  const [sceneReady, setSceneReady] = useState(false);

  const [hasEntered, setHasEntered] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("preloaderShown") === "true";
  });

  const handleEntered = () => {
    setHasEntered(true);
    sessionStorage.setItem("preloaderShown", "true");
  };

  return (
    <>
      {!hasEntered && (
        <Preloader onEnter={handleEntered} musicSrc="/music/ambient.mp3" />
      )}

      <main
        className={`relative h-screen w-screen overflow-hidden transition-opacity duration-500 ${
          sceneReady ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle at 20% 72%, rgba(255, 170, 190, 0.55), transparent 32%), radial-gradient(circle at 78% 68%, rgba(151, 207, 255, 0.5), transparent 34%), radial-gradient(circle at 50% 18%, rgba(255, 239, 204, 0.75), transparent 38%), linear-gradient(180deg, #fff7ec 0%, #f8dfe8 48%, #d8d5ff 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <CloudShape
            className="absolute left-[-6%] top-[8%] h-24 w-[260px] cloud-drift-slow"
            opacity={0.55}
          />

          <CloudShape
            className="absolute right-[-4%] top-[18%] h-28 w-[300px] cloud-drift-medium"
            opacity={0.45}
          />

          <CloudShape
            className="absolute right-[10%] top-[4%] h-20 w-[200px] cloud-drift-slow"
            opacity={0.4}
          />

          <CloudShape
            className="absolute left-[30%] top-[24%] h-20 w-[230px] cloud-drift-medium"
            opacity={0.22}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div className="cloud-lane cloud-lane-one">
            <CloudShape className="h-28 w-[320px]" opacity={0.42} />
            <CloudShape className="h-20 w-[230px]" opacity={0.28} />
            <CloudShape className="h-24 w-[280px]" opacity={0.36} />
          </div>

          <div className="cloud-lane cloud-lane-two">
            <CloudShape className="h-24 w-[290px]" opacity={0.34} />
            <CloudShape className="h-32 w-[370px]" opacity={0.38} />
            <CloudShape className="h-20 w-[220px]" opacity={0.26} />
          </div>

          <div className="cloud-lane cloud-lane-three">
            <CloudShape className="h-28 w-[340px]" opacity={0.3} />
            <CloudShape className="h-24 w-[270px]" opacity={0.26} />
            <CloudShape className="h-32 w-[390px]" opacity={0.32} />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[36vh]">
          <CloudShape
            className="absolute bottom-[12%] left-[20%] h-32 w-[370px] cloud-bob"
            opacity={0.45}
          />

          <CloudShape
            className="absolute bottom-[8%] right-[18%] h-32 w-[390px] cloud-bob-delayed"
            opacity={0.42}
          />

          <CloudShape
            className="absolute bottom-[20%] left-[46%] h-24 w-[280px] cloud-drift-slow"
            opacity={0.3}
          />
        </div>

        <div className="relative z-[2] h-full w-full">
          <HeroScene onSceneReady={() => setSceneReady(true)} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-[-8vh] z-[4] h-[40vh] overflow-hidden">
          <CloudShape
            className="absolute bottom-[-4%] left-[-10%] h-44 w-[500px] cloud-drift-slow"
            opacity={0.82}
          />

          <CloudShape
            className="absolute bottom-[0%] left-[12%] h-48 w-[560px] cloud-bob"
            opacity={0.72}
          />

          <CloudShape
            className="absolute bottom-[-2%] right-[15%] h-48 w-[540px] cloud-bob-delayed"
            opacity={0.7}
          />

          <CloudShape
            className="absolute bottom-[-8%] right-[-12%] h-52 w-[590px] cloud-drift-medium"
            opacity={0.82}
          />

          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/45 to-transparent blur-xl" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute left-4 top-10 w-[420px] md:left-12 md:top-16 md:w-[500px]">
            <div className="relative">
              <CloudShape
                className="absolute inset-0 h-full w-full cloud-bob"
                opacity={0.92}
              />

              <div className="relative px-12 py-10 md:px-14 md:py-12">
                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#a875d8]">
                  ✨ Portfolio Room
                </p>

                <h1
                  className="mt-3 font-display text-[2.5rem] font-bold leading-[1.05] text-[#3b2a45] md:text-[3.25rem]"
                  style={{
                    textShadow: "0 2px 12px rgba(255,255,255,0.8)",
                  }}
                >
                  Hi, I&apos;m
                  <br />
                  Julie Anne
                </h1>

                <p className="mt-3 max-w-[280px] text-sm font-semibold leading-relaxed text-[#7a4d77] md:text-[15px]">
                  Fullstack developer crafting cozy, creative, and interactive
                  web experiences.
                </p>
              </div>
            </div>
          </div>

          <nav className="pointer-events-auto absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-end gap-5">
            <CloudButton target="about" label="About" tint="#ffe2ee" delay="0s" />

            <CloudButton
              target="projects"
              label="Projects"
              tint="#ffd9e7"
              delay="0.6s"
            />

            <CloudButton
              target="credits"
              label="Credits"
              tint="#e0effd"
              delay="1.2s"
            />
          </nav>

          <div className="absolute right-8 top-12 hidden md:block">
            <p className="rotate-[4deg] text-right text-xs font-bold uppercase tracking-[0.3em] text-[#a875d8]/70">
              ☁ click around the room
            </p>
          </div>
        </div>

        <style jsx global>{`
          @keyframes cloudBob {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-7px);
            }
          }

          .cloud-bob {
            animation: cloudBob 6s ease-in-out infinite;
          }

          .cloud-bob-delayed {
            animation: cloudBob 7s ease-in-out infinite;
            animation-delay: 1.2s;
          }

          @keyframes cloudDriftSlow {
            0%,
            100% {
              transform: translateX(0) translateY(0);
            }
            50% {
              transform: translateX(20px) translateY(-8px);
            }
          }

          .cloud-drift-slow {
            animation: cloudDriftSlow 18s ease-in-out infinite;
          }

          @keyframes cloudDriftMedium {
            0%,
            100% {
              transform: translateX(0) translateY(0);
            }
            50% {
              transform: translateX(-25px) translateY(-6px);
            }
          }

          .cloud-drift-medium {
            animation: cloudDriftMedium 14s ease-in-out infinite;
          }

          @keyframes cloudFloat {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          .cloud-nav {
            animation: cloudFloat 4s ease-in-out infinite;
          }

          @keyframes cloudLaneMoveRight {
            0% {
              transform: translateX(-45vw);
            }
            100% {
              transform: translateX(115vw);
            }
          }

          @keyframes cloudLaneMoveLeft {
            0% {
              transform: translateX(115vw);
            }
            100% {
              transform: translateX(-45vw);
            }
          }

          .cloud-lane {
            position: absolute;
            display: flex;
            align-items: center;
            gap: 14vw;
            width: max-content;
            will-change: transform;
          }

          .cloud-lane-one {
            top: 21%;
            left: 0;
            animation: cloudLaneMoveRight 42s linear infinite;
          }

          .cloud-lane-two {
            top: 39%;
            left: 0;
            animation: cloudLaneMoveLeft 56s linear infinite;
          }

          .cloud-lane-three {
            top: 57%;
            left: 0;
            animation: cloudLaneMoveRight 64s linear infinite;
          }
        `}</style>
      </main>
    </>
  );
}

function CloudButton({
  target,
  label,
  tint,
  delay,
}: {
  target: RoomNavigationTarget;
  label: string;
  tint: string;
  delay: string;
}) {
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("room:navigate", {
        detail: {
          target,
        },
      })
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="cloud-nav group relative flex h-16 w-36 items-center justify-center transition-transform duration-300 hover:scale-110"
      style={{ animationDelay: delay }}
    >
      <svg
        viewBox="0 0 200 100"
        className="absolute inset-0 h-full w-full drop-shadow-lg transition-all group-hover:drop-shadow-xl"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id={`grad-${label}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={tint} />
          </radialGradient>
        </defs>

        <g fill={`url(#grad-${label})`}>
          <ellipse cx="100" cy="62" rx="78" ry="26" />
          <circle cx="58" cy="52" r="22" />
          <circle cx="92" cy="38" r="28" />
          <circle cx="128" cy="44" r="24" />
          <circle cx="155" cy="56" r="18" />
          <circle cx="38" cy="60" r="16" />
        </g>
      </svg>

      <span
        className="relative z-10 text-xs font-black uppercase tracking-[0.18em] text-[#5a3a6e]"
        style={{ textShadow: "0 1px 2px rgba(255,255,255,0.9)" }}
      >
        {label}
      </span>
    </button>
  );
}