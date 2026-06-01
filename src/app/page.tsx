"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import Preloader from "@/components/Preloader";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => null,
});

const PRELOADER_STORAGE_KEY = "preloaderShown";
const THEME_STORAGE_KEY = "portfolioTheme";

type ThemeMode = "day" | "night";

type RoomNavigationTarget = "about" | "projects" | "credits";

function CloudShape({
  className = "",
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      className={`dream-cloud ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

export default function HomePage() {
  const [bootChecked, setBootChecked] = useState(false);
  const [roomMounted, setRoomMounted] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("day");
  const [themeReady, setThemeReady] = useState(false);

  /*
    The canvas may be mounted while remaining invisible.

    This avoids briefly showing the normal home camera position
    before the intro rotation starts.
  */
  const [roomVisible, setRoomVisible] = useState(false);

  /*
    This becomes true only after clicking Enter on the first visit.
    Returning from a hotspot must not replay the intro rotation.
  */
  const [shouldPlayIntro, setShouldPlayIntro] = useState(false);

  /*
    Show the preloader only once during the browser session.

    Returning from:
      /about    -> /?from=about
      /projects -> /?from=projects
      /credits  -> /?from=credits

    skips the preloader so HeroScene can play its existing zoom-out
    transition from the hotspot back to the room.
  */
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const returningFromHotspot = searchParams.has("from");

    const alreadyEntered =
      sessionStorage.getItem(PRELOADER_STORAGE_KEY) === "true";

    const shouldSkipPreloader =
      alreadyEntered || returningFromHotspot;

    if (returningFromHotspot) {
      sessionStorage.setItem(PRELOADER_STORAGE_KEY, "true");
    }

    setRoomMounted(shouldSkipPreloader);
    setShowPreloader(!shouldSkipPreloader);
    setBootChecked(true);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const resolvedTheme: ThemeMode =
      storedTheme === "night" ||
      document.documentElement.dataset.theme === "twilight"
        ? "night"
        : "day";

    setTheme(resolvedTheme);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;

    const resolvedTheme = theme === "night" ? "twilight" : "day";

    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme =
      theme === "night" ? "dark" : "light";
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, themeReady]);

  /*
    Prevent the intro animation glitch.

    First visit:
      1. Mount the room invisibly.
      2. Wait until HeroScene reports that controls and the model are ready.
      3. Dispatch room:intro while the canvas is still invisible.
      4. HeroScene immediately moves the camera to INTRO_CAMERA.
      5. Reveal the canvas two animation frames later.

    Returning from a hotspot:
      Reveal the canvas normally so HeroScene can run its zoom-out animation.
  */
  useEffect(() => {
    if (!roomMounted || !sceneReady) return;

    if (!shouldPlayIntro) {
      setRoomVisible(true);
      return;
    }

    window.dispatchEvent(new CustomEvent("room:intro"));

    let revealFrame = 0;

    const prepareFrame = window.requestAnimationFrame(() => {
      revealFrame = window.requestAnimationFrame(() => {
        setRoomVisible(true);
        setShouldPlayIntro(false);
      });
    });

    return () => {
      window.cancelAnimationFrame(prepareFrame);

      if (revealFrame) {
        window.cancelAnimationFrame(revealFrame);
      }
    };
  }, [roomMounted, sceneReady, shouldPlayIntro]);

  useEffect(() => {
    document.body.style.cursor = "default";

    return () => {
      document.body.style.cursor = "default";
    };
  }, []);

  const handleEntered = () => {
    sessionStorage.setItem(PRELOADER_STORAGE_KEY, "true");

    /*
      Mount the room behind the fading preloader, but keep it invisible
      until its camera has moved to the intro starting position.
    */
    setRoomVisible(false);
    setShouldPlayIntro(true);
    setRoomMounted(true);

    /*
      Match the preloader fade-out duration.
    */
    window.setTimeout(() => {
      setShowPreloader(false);
    }, 1100);
  };

  const isNight = theme === "night";

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "night" ? "day" : "night"
    );
  };

  return (
    <>
      {themeReady && (
        <button
          type="button"
          onClick={toggleTheme}
          className="fixed right-4 top-4 z-[120] inline-flex h-12 w-12 items-center justify-center rounded-full border shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5"
          style={{
            borderColor: "var(--page-border)",
            background: "var(--page-surface)",
            color: "var(--page-text-soft)",
          }}
          aria-label={isNight ? "Switch to day mode" : "Switch to night mode"}
        >
          {isNight ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
        </button>
      )}

      {bootChecked && showPreloader && (
        <Preloader
          onEnter={handleEntered}
          musicSrc="/music/ambient.mp3"
        />
      )}

      {bootChecked && roomMounted && (
        <main
          className={`relative min-h-[100dvh] w-full overflow-hidden transition-opacity duration-500 ${
            roomVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "var(--home-background)",
          }}
        >
          {/* Background clouds */}
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

          {/* Slowly drifting cloud lanes */}
          <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden md:block">
            <div className="cloud-lane cloud-lane-one">
              <CloudShape
                className="relative h-28 w-[320px]"
                opacity={0.42}
              />

              <CloudShape
                className="relative h-20 w-[230px]"
                opacity={0.28}
              />

              <CloudShape
                className="relative h-24 w-[280px]"
                opacity={0.36}
              />
            </div>

            <div className="cloud-lane cloud-lane-two">
              <CloudShape
                className="relative h-24 w-[290px]"
                opacity={0.34}
              />

              <CloudShape
                className="relative h-32 w-[370px]"
                opacity={0.38}
              />

              <CloudShape
                className="relative h-20 w-[220px]"
                opacity={0.26}
              />
            </div>

            <div className="cloud-lane cloud-lane-three">
              <CloudShape
                className="relative h-28 w-[340px]"
                opacity={0.3}
              />

              <CloudShape
                className="relative h-24 w-[270px]"
                opacity={0.26}
              />

              <CloudShape
                className="relative h-32 w-[390px]"
                opacity={0.32}
              />
            </div>
          </div>

          {/* Clouds behind the 3D room */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden h-[36vh] sm:block">
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

          {/* Existing 3D room */}
          <div className="relative z-[2] h-full w-full">
            <HeroScene
              theme={theme}
              onSceneReady={() => {
                setSceneReady(true);
              }}
            />
          </div>

          {/* Foreground clouds */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[-8vh] z-[4] hidden h-[40vh] overflow-hidden sm:block">
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

            {isNight ? (
              <div className="absolute inset-x-0 bottom-0 h-36 blur-2xl"
                style={{
                  background: 'linear-gradient(to top, rgba(13,10,20,0.85) 0%, rgba(18,14,26,0.45) 50%, transparent 100%)'
                }}
              />
            ) : (
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white/65 via-white/35 to-transparent blur-2xl" />
            )}
          </div>

          {/* Portfolio title and navigation */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="absolute left-1/2 top-6 w-[min(92vw,420px)] -translate-x-1/2 sm:left-6 sm:top-8 sm:w-[min(86vw,420px)] sm:translate-x-0 md:left-12 md:top-16 md:w-[500px]">
              <div className="relative min-h-[210px] sm:min-h-[245px]">
                <CloudShape
                  className="absolute inset-0 h-full w-full cloud-bob"
                  opacity={0.92}
                />

                <div className="relative px-8 py-8 sm:px-12 sm:py-10 md:px-14 md:py-12">
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.28em] sm:text-[11px] sm:tracking-[0.32em]"
                    style={{ color: "var(--home-eyebrow)" }}
                  >
                    ✨ Portfolio Room
                  </p>

                  <h1
                    className="mt-2 font-display text-[clamp(2.2rem,10vw,3.25rem)] font-bold leading-[1.05] sm:mt-3 md:text-[3.25rem]"
                    style={{
                      color: "var(--home-title)",
                      textShadow: "0 2px 16px var(--home-cloud-shadow)",
                    }}
                  >
                    Hi, I&apos;m
                    <br />
                    Julie Anne
                  </h1>

                  <p
                    className="mt-2 max-w-[220px] text-[13px] font-semibold leading-relaxed sm:mt-3 sm:max-w-[280px] sm:text-sm md:text-[15px]"
                    style={{
                      color: "var(--home-copy)",
                      textShadow: "0 1px 6px rgba(10, 8, 16, 0.72)",
                    }}
                  >
                    Fullstack developer crafting cozy, creative, and
                    interactive web experiences.
                  </p>
                </div>
              </div>
            </div>

            {/* Cloud navigation background */}
            <div className="nav-cloud-bank absolute inset-x-0 bottom-[-3.2rem] z-[18] h-36 overflow-visible sm:bottom-[-4rem] sm:h-44">
              <div className="absolute bottom-0 left-1/2 h-28 w-[min(96vw,760px)] -translate-x-1/2 sm:h-32 sm:w-[820px]">
                <CloudShape
                  className="absolute bottom-0 left-0 h-full w-[36%]"
                  opacity={0.62}
                />

                <CloudShape
                  className="absolute bottom-1 left-[18%] h-full w-[36%]"
                  opacity={0.66}
                />

                <CloudShape
                  className="absolute bottom-0 left-[36%] h-full w-[36%]"
                  opacity={0.68}
                />

                <CloudShape
                  className="absolute bottom-1 left-[54%] h-full w-[36%]"
                  opacity={0.66}
                />

                <CloudShape
                  className="absolute bottom-0 right-0 h-full w-[36%]"
                  opacity={0.62}
                />
              </div>

              <div className="absolute bottom-[-1.8rem] left-1/2 h-24 w-[min(115vw,980px)] -translate-x-1/2 sm:h-28">
                <CloudShape
                  className="absolute bottom-0 left-0 h-full w-[34%]"
                  opacity={0.46}
                />

                <CloudShape
                  className="absolute bottom-1 left-[22%] h-full w-[34%]"
                  opacity={0.5}
                />

                <CloudShape
                  className="absolute bottom-0 left-[44%] h-full w-[34%]"
                  opacity={0.5}
                />

                <CloudShape
                  className="absolute bottom-1 right-0 h-full w-[34%]"
                  opacity={0.46}
                />
              </div>
            </div>

            {/* Existing cloud navigation buttons */}
            <nav className="pointer-events-auto absolute bottom-8 left-1/2 z-20 flex w-[min(92vw,30rem)] -translate-x-1/2 flex-wrap justify-center gap-3 px-4 sm:bottom-10 sm:w-auto sm:items-end sm:gap-5 sm:px-0">
              <CloudButton
                target="about"
                label="About"
                tint="#ffe2ee"
                delay="0s"
                theme={theme}
              />

              <CloudButton
                target="projects"
                label="Projects"
                tint="#ffd9e7"
                delay="0.6s"
                theme={theme}
              />

              <CloudButton
                target="credits"
                label="Credits"
                tint="#e0effd"
                delay="1.2s"
                theme={theme}
              />
            </nav>

            <div className="absolute right-8 top-12 hidden md:block">
              <p
                className="rotate-[4deg] text-right text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: "var(--home-eyebrow)" }}
              >
                ☁ click around the room
              </p>
            </div>
            {isNight ? (
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0d0a14]/85 via-[#120f1b]/45 to-transparent blur-2xl" />
            ) : null}
          </div>

          <style jsx global>{`
            .dream-cloud {
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

              filter: blur(7px);
              border-radius: 999px;
              transform-origin: center;
              will-change: transform;
            }

            html[data-theme="twilight"] .dream-cloud {
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

            .dream-cloud::after {
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

            html[data-theme="twilight"] .dream-cloud::after {
              background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.08),
                rgba(212, 188, 255, 0.1)
              );
            }

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
      )}
    </>
  );
}

function CloudButton({
  target,
  label,
  tint,
  delay,
  theme,
}: {
  target: RoomNavigationTarget;
  label: string;
  tint: string;
  delay: string;
  theme: ThemeMode;
}) {
  const isNight = theme === "night";

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
      className="cloud-nav group relative flex h-12 w-28 items-center justify-center overflow-visible transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-36"
      style={{
        animationDelay: delay,
      }}
    >
      <div
        className="dream-cloud pointer-events-none absolute inset-0 h-full w-full drop-shadow-lg transition-all group-hover:drop-shadow-xl"
        style={{
          opacity: 0.92,
          ...(isNight ? {} : { backgroundColor: tint }),
        }}
      />

      <span
        className="relative z-10 text-[10px] font-black uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.18em]"
        style={{
          color: isNight ? "#f6efff" : "var(--home-cloud-text)",
          textShadow: isNight
            ? "0 1px 6px rgba(8, 6, 14, 1)"
            : "0 1px 2px var(--home-cloud-shadow)",
          letterSpacing: isNight ? "0.24em" : undefined,
        }}
      >
        {label}
      </span>
    </button>
  );
}