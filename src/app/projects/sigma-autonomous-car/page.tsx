"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bug,
  Camera,
  Car,
  CheckCircle2,
  Cpu,
  Film,
  Maximize2,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  Wrench,
} from "lucide-react";

const galleryImages = [
  "/projects/sigma-autonomous-car/image-1.jpg",
  "/projects/sigma-autonomous-car/image-2.jpg",
  "/projects/sigma-autonomous-car/image-3.jpg",
];

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

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function ModernVideoPlayer({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;

    const onLoadedMetadata = () => {
      setDuration(video.duration || 0);
      setCurrentTime(video.currentTime || 0);
    };

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime || 0);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };
    const onEnded = () => setIsPlaying(false);

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("volumechange", onVolumeChange);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("volumechange", onVolumeChange);
      video.removeEventListener("ended", onEnded);
    };
  }, [volume]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowControls(false);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [isPlaying, currentTime]);

  const progress = useMemo(() => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;

    if (!video.muted && video.volume === 0) {
      video.volume = 0.9;
      setVolume(0.9);
    }
  };

  const handleVolumeChange = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    const normalized = value / 100;
    video.volume = normalized;
    video.muted = normalized === 0;
    setVolume(normalized);
    setIsMuted(normalized === 0);
  };

  const toggleFullscreen = async () => {
    const player = playerRef.current;
    if (!player) return;

    if (!document.fullscreenElement) {
      await player.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <div
      ref={playerRef}
      className="group relative overflow-hidden rounded-[1.55rem] border border-white/65 bg-[#120f18] shadow-[0_12px_40px_rgba(17,12,28,0.35)] sm:rounded-[1.85rem]"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
      }}
    >
      <video
        ref={videoRef}
        className="aspect-video w-full bg-black object-contain"
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        onClick={togglePlay}
      >
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/82 text-[#6e4d93] shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white"
          aria-label="Play video"
        >
          <Play className="ml-1 h-8 w-8 fill-current" />
        </button>
      )}

      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#120f18]/65 via-transparent to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute inset-x-0 bottom-0 z-20 transition-all duration-300 ${
          showControls || !isPlaying
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-10 sm:px-5 sm:pb-5">
          <div className="rounded-[1.3rem] border border-white/15 bg-[rgba(20,15,30,0.66)] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:rounded-[1.4rem] sm:p-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="min-w-[3.1rem] text-[11px] font-semibold text-white/85 sm:text-xs">
                {formatTime(currentTime)}
              </span>

              <div className="flex-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="video-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15"
                  style={{
                    background: `linear-gradient(to right, #b992ff 0%, #b992ff ${progress}%, rgba(255,255,255,0.15) ${progress}%, rgba(255,255,255,0.15) 100%)`,
                  }}
                  aria-label="Seek video"
                />
              </div>

              <span className="min-w-[3.1rem] text-right text-[11px] font-semibold text-white/85 sm:text-xs">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/14 text-white shadow-sm transition duration-300 hover:scale-105 hover:bg-white/22"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/14 text-white shadow-sm transition duration-300 hover:scale-105 hover:bg-white/22"
                  aria-label={isMuted || volume === 0 ? "Unmute video" : "Mute video"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>

                <div className="hidden w-28 sm:block">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={isMuted ? 0 : Math.round(volume * 100)}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="video-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15"
                    style={{
                      background: `linear-gradient(to right, #f4b8df 0%, #f4b8df ${
                        isMuted ? 0 : Math.round(volume * 100)
                      }%, rgba(255,255,255,0.15) ${
                        isMuted ? 0 : Math.round(volume * 100)
                      }%, rgba(255,255,255,0.15) 100%)`,
                    }}
                    aria-label="Volume"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/82">
                  Demo clip
                </span>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/14 text-white shadow-sm transition duration-300 hover:scale-105 hover:bg-white/22"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SigmaAutonomousCarPage() {
  return (
    <main
      className="relative min-h-[100dvh] w-full overflow-hidden px-4 py-8 text-[#3b2a45] sm:py-10 md:px-6 md:py-14"
      style={{
        background:
          "radial-gradient(circle at 20% 72%, rgba(255, 170, 190, 0.55), transparent 32%), radial-gradient(circle at 78% 68%, rgba(151, 207, 255, 0.5), transparent 34%), radial-gradient(circle at 50% 18%, rgba(255, 239, 204, 0.75), transparent 38%), linear-gradient(180deg, #fff7ec 0%, #f8dfe8 48%, #d8d5ff 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <CloudShape
          className="absolute left-[-6%] top-[6%] h-24 w-[260px] cloud-drift-slow"
          opacity={0.5}
        />
        <CloudShape
          className="absolute right-[-4%] top-[14%] h-28 w-[300px] cloud-drift-medium"
          opacity={0.42}
        />
        <CloudShape
          className="absolute left-[40%] top-[2%] h-20 w-[220px] cloud-drift-slow"
          opacity={0.3}
        />
        <CloudShape
          className="absolute right-[12%] bottom-[6%] h-32 w-[360px] cloud-bob-delayed"
          opacity={0.4}
        />
        <CloudShape
          className="absolute left-[8%] bottom-[10%] h-28 w-[320px] cloud-bob"
          opacity={0.38}
        />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/projects"
            className="group relative inline-flex h-12 w-fit items-center justify-center px-2 transition-transform duration-300 hover:-translate-y-1 hover:scale-105 sm:h-14"
          >
            <CloudShape
              className="absolute inset-0 h-full w-full drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-xl"
              opacity={0.96}
            />
            <span
              className="relative z-10 inline-flex items-center gap-2 px-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#5a3a6e]"
              style={{ textShadow: "0 1px 2px rgba(255,255,255,0.9)" }}
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to projects
            </span>
          </Link>

          <p className="hidden rotate-[3deg] text-right text-xs font-bold uppercase tracking-[0.3em] text-[#a875d8]/70 md:block">
            ☁ a thing I built
          </p>
        </div>

        <header className="relative mt-10 md:mt-14">
          <div className="relative mx-auto max-w-3xl">
            <CloudShape
              className="absolute inset-0 h-full w-full cloud-bob"
              opacity={0.95}
            />
            <div className="relative px-7 py-10 text-center sm:px-14 sm:py-12">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#a875d8] sm:text-[11px] sm:tracking-[0.32em]">
                ✨ Embedded / Robotics Project
              </p>

              <h1
                className="mt-3 font-display text-[clamp(2.35rem,9vw,4rem)] font-bold leading-[1.05] text-[#3b2a45]"
                style={{ textShadow: "0 2px 12px rgba(255,255,255,0.8)" }}
              >
                Sigma
                <br />
                Autonomous Car
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-[14px] font-semibold leading-relaxed text-[#7a4d77] sm:text-[15px]">
                A hands-on autonomous car project where I worked through the full
                build process — from planning the electrical schematic and
                assembling the hardware to programming the car, testing its
                behavior, and refining how it responded to different situations.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  "Embedded Systems",
                  "C++",
                  "Electronics",
                  "Sensors",
                  "Assembly",
                  "Testing",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/70 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5a3a6e] shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md sm:text-[11px]"
                    style={{ textShadow: "0 1px 1px rgba(255,255,255,0.8)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="relative mx-auto mt-12 max-w-4xl">
          <div className="float-card group rounded-[2rem] border border-white/70 bg-white/55 p-3 shadow-[0_30px_80px_rgba(168,142,199,0.35)] backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:bg-white/65 hover:shadow-[0_36px_90px_rgba(168,142,199,0.45)] sm:rounded-[2.5rem]">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.55rem] bg-gradient-to-br from-[#fff7fb] via-[#f6efff] to-[#e9f5ff] sm:rounded-[2rem]">
              <img
                src="/projects/sigma-autonomous-car/cover.jpg"
                alt="Building and programming an autonomous car"
                className="h-full w-full object-contain p-2 transition duration-700 group-hover:scale-[1.025] sm:p-3"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2c2336]/15 via-transparent to-white/10" />

              <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-1000 group-hover:translate-x-[120%]" />

              <div
                className="absolute bottom-4 left-4 right-4 inline-flex w-fit max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-[11px] font-bold text-[#5a3a6e] shadow-lg backdrop-blur-md sm:text-xs"
                style={{ textShadow: "0 1px 1px rgba(255,255,255,0.9)" }}
              >
                <Car className="h-4 w-4 shrink-0" />
                Building and programming an autonomous car ✨
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-10 max-w-4xl">
          <div className="float-card overflow-hidden rounded-[2rem] border border-white/70 bg-white/62 p-4 shadow-[0_30px_80px_rgba(168,142,199,0.32)] backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:bg-white/72 hover:shadow-[0_36px_90px_rgba(168,142,199,0.42)] sm:rounded-[2.5rem] sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-[#a875d8]">
                <Film className="h-5 w-5" />
                <p className="text-xs font-black uppercase tracking-[0.25em]">
                  Demo Video
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a4d77] shadow-sm backdrop-blur-md">
                <Play className="h-3.5 w-3.5" />
                Project snippet
              </div>
            </div>

            <div className="rounded-[1.7rem] bg-gradient-to-br from-[#ffddea] via-[#fff5d8] to-[#dceeff] p-[2px] shadow-[0_18px_45px_rgba(168,142,199,0.28)] sm:rounded-[2rem]">
              <ModernVideoPlayer
                src="/projects/sigma-autonomous-car/demo.mp4"
                poster="/projects/sigma-autonomous-car/cover.jpg"
              />
            </div>

            <p className="px-1 pt-4 text-sm font-semibold leading-relaxed text-[#7a4d77]">
              This short clip shows the autonomous car in action after the
              hardware, wiring, and programming were put together.
            </p>
          </div>
        </div>

        <div className="relative mt-12 grid gap-5 md:grid-cols-3">
          <InfoCard
            icon={<Wrench className="h-5 w-5" />}
            title="What I worked on"
            text="I worked on the project from the electrical schematic to the physical assembly, wiring, programming, testing, and debugging."
            tint="#ffe2ee"
          />

          <InfoCard
            icon={<Cpu className="h-5 w-5" />}
            title="Skills used"
            text="Circuit planning, hardware assembly, embedded programming, sensor integration, debugging, and system testing."
            tint="#e0effd"
          />

          <InfoCard
            icon={<Bug className="h-5 w-5" />}
            title="What I learned"
            text="How electrical design, hardware components, and software logic work together to create an autonomous system."
            tint="#fff0c9"
          />
        </div>

        <div className="relative mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="float-card rounded-[2rem] border border-white/70 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:bg-white/70 hover:shadow-2xl sm:rounded-[2.5rem] sm:p-7">
            <div className="flex items-center gap-2 text-[#a875d8]">
              <Sparkles className="h-5 w-5" />
              <p className="text-xs font-black uppercase tracking-[0.25em]">
                Project Highlights
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Highlight text="Planned and followed the electrical schematic needed to connect the car’s components correctly." />
              <Highlight text="Assembled the physical car hardware, including the wiring, sensors, and electronic components." />
              <Highlight text="Programmed the car’s logic so it could respond to its environment and operate autonomously." />
              <Highlight text="Tested, debugged, and refined the system to improve how the car behaved in different situations." />
            </div>
          </div>

          <div className="float-card rounded-[2rem] border border-white/70 bg-white/60 p-4 shadow-xl backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:bg-white/70 hover:shadow-2xl sm:rounded-[2.5rem] sm:p-5">
            <div className="mb-4 flex items-center gap-2 px-2 text-[#a875d8]">
              <Camera className="h-5 w-5" />
              <p className="text-xs font-black uppercase tracking-[0.25em]">
                Gallery
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.map((image, index) => (
                <figure
                  key={image}
                  className={`group overflow-hidden rounded-[1.5rem] border border-white/70 bg-gradient-to-br from-[#fff7fb] via-[#f6efff] to-[#e9f5ff] p-2 shadow-lg transition duration-500 hover:-translate-y-1 hover:rotate-[0.4deg] hover:shadow-2xl sm:rounded-[1.75rem] ${
                    index === 2 ? "sm:col-span-2" : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`Sigma autonomous car project image ${index + 1}`}
                    className="h-full max-h-[420px] w-full rounded-[1.15rem] object-contain transition duration-700 group-hover:scale-[1.035] sm:rounded-[1.4rem]"
                  />
                </figure>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-14 flex max-w-xl flex-col items-center gap-5 text-center">
          <p className="text-sm font-semibold leading-relaxed text-[#7a4d77]">
            Want to wander back and see the rest of the room?
          </p>

          <Link
            href="/projects"
            className="group relative inline-flex h-14 w-44 items-center justify-center transition-transform duration-300 hover:-translate-y-1 hover:scale-110"
          >
            <CloudShape
              className="absolute inset-0 h-full w-full drop-shadow-lg transition-all group-hover:drop-shadow-xl"
              opacity={0.98}
            />
            <span
              className="relative z-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#5a3a6e]"
              style={{ textShadow: "0 1px 2px rgba(255,255,255,0.9)" }}
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              All Projects
            </span>
          </Link>
        </div>
      </section>

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

        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .float-card {
          animation: floatIn 0.7s ease both;
        }

        .video-slider::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 999px;
          background: transparent;
        }

        .video-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -4px;
          height: 16px;
          width: 16px;
          border-radius: 999px;
          background: #ffffff;
          border: 2px solid #c8a2ff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
        }

        .video-slider::-moz-range-track {
          height: 8px;
          border-radius: 999px;
          background: transparent;
        }

        .video-slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border: 2px solid #c8a2ff;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
        }

        @media (prefers-reduced-motion: reduce) {
          .float-card,
          .cloud-bob,
          .cloud-bob-delayed,
          .cloud-drift-slow,
          .cloud-drift-medium {
            animation: none !important;
          }

          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
  tint,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tint: string;
}) {
  return (
    <article
      className="float-card group rounded-[2rem] border border-white/70 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:rotate-[0.35deg] hover:bg-white/75 hover:shadow-2xl sm:rounded-[2.5rem]"
      style={{
        background: `linear-gradient(145deg, ${tint}88, rgba(255,255,255,0.66))`,
      }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/75 text-[#8d67cf] shadow-md transition duration-300 group-hover:scale-110 group-hover:rotate-6">
        {icon}
      </div>

      <h2 className="mt-5 text-xl font-bold text-[#3b2a45]">{title}</h2>

      <p className="mt-3 text-sm font-semibold leading-relaxed text-[#7a4d77]">
        {text}
      </p>
    </article>
  );
}

function Highlight({ text }: { text: string }) {
  return (
    <div className="group flex gap-3 rounded-[1.4rem] bg-white/60 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white/85 hover:shadow-md">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8d67cf] transition duration-300 group-hover:scale-110" />

      <p className="text-sm font-semibold leading-relaxed text-[#6a5578]">
        {text}
      </p>
    </div>
  );
}